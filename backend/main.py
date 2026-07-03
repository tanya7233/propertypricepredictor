from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import numpy as np
import pickle

app = FastAPI()

# ✅ Allow frontend (Vercel Production & Local) to talk to backend without CORS blocks
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://propertypricepredictor.vercel.app",  # Aapka live Vercel URL
        "http://localhost:5173",                      # Local Vite development environment
        "*"                                           # Public bypass safety net
    ],   
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Try loading trained models
try:
    model_dehu = pickle.load(open("model_dehu.pkl", "rb"))
    print("✅ Dehu–Solapur model loaded")
except Exception as e:
    print("⚠️ Dehu–Solapur model not found:", e)
    model_dehu = None

try:
    model_kolhapur = pickle.load(open("model_kolhapur.pkl", "rb"))
    print("✅ Kolhapur–Nashik model loaded")
except Exception as e:
    print("⚠️ Kolhapur–Nashik model not found:", e)
    model_kolhapur = None

# Input schema
class PropertyDetails(BaseModel):
    corridor: str
    bhk: int
    sqft: int
    bathrooms: int
    floor: int
    amenities: list[str]

# 🛠️ Helper function to apply dynamic floor adjustment factors
def apply_floor_adjustment(base_price: float, floor_num: int) -> float:
    # Ground Floor standard minor discount
    if floor_num == 0:
        base_price = base_price * 0.98  # 2% reduction
    # High floors view premium adjustment
    elif floor_num > 5:
        # Har extra floor par 0.1L (10,000 Rs) view factor add hoga
        base_price = base_price + ((floor_num - 5) * 0.10)
    return max(base_price, 0.0)

# ✅ Single corridor prediction
@app.post("/predict")
def predict_price(data: PropertyDetails):
    amenities_count = len(data.amenities)
    features = np.array([[data.sqft, data.bhk, data.bathrooms]])

    if data.corridor.lower().startswith("dehu") or "solapur" in data.corridor.lower():
        if model_dehu:
            price = model_dehu.predict(features)[0]
            price = max(price, 0)
            if price == 0:  # fallback
                price = (data.sqft * 0.05) + (data.bhk * 2) + (amenities_count * 1.5)
        else:
            price = (data.sqft * 0.05) + (data.bhk * 2) + (amenities_count * 1.5)

    elif "kolhapur" in data.corridor.lower() or "nashik" in data.corridor.lower():
        if model_kolhapur:
            price = model_kolhapur.predict(features)[0]
            price = max(price, 0)
            if price == 0:  # fallback
                price = (data.sqft * 0.05) + (data.bhk * 2) + (amenities_count * 1.5)
        else:
            price = (data.sqft * 0.05) + (data.bhk * 2) + (amenities_count * 1.5)

    else:
        price = (data.sqft * 0.05) + (data.bhk * 2) + (amenities_count * 1.5)

    # 🚀 Apply the dynamic backend UI logic for Floor Numbers
    final_price = apply_floor_adjustment(price, data.floor)

    return {
        "corridor": data.corridor,
        "predicted_price_lakhs": round(final_price, 2)
    }

# ✅ Side-by-side comparison
@app.post("/compare")
def compare_price(data: PropertyDetails):
    features = np.array([[data.sqft, data.bhk, data.bathrooms]])
    amenities_count = len(data.amenities)

    # Dehu–Solapur
    if model_dehu:
        price_dehu = model_dehu.predict(features)[0]
        price_dehu = max(price_dehu, 0)
        if price_dehu == 0:
            price_dehu = (data.sqft * 0.05) + (data.bhk * 2) + (amenities_count * 1.5)
    else:
        price_dehu = (data.sqft * 0.05) + (data.bhk * 2) + (amenities_count * 1.5)

    # Kolhapur–Nashik
    if model_kolhapur:
        price_kolhapur = model_kolhapur.predict(features)[0]
        price_kolhapur = max(price_kolhapur, 0)
        if price_kolhapur == 0:
            price_kolhapur = (data.sqft * 0.05) + (data.bhk * 2) + (amenities_count * 1.5)
    else:
        price_kolhapur = (data.sqft * 0.05) + (data.bhk * 2) + (amenities_count * 1.5)

    # 🚀 Apply floor rules to comparison cards as well to keep data uniform
    final_dehu = apply_floor_adjustment(price_dehu, data.floor)
    final_kolhapur = apply_floor_adjustment(price_kolhapur, data.floor)

    return {
        "Dehu-Solapur": round(final_dehu, 2),
        "Kolhapur-Nashik": round(final_kolhapur, 2)
    }

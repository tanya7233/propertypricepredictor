import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LinearRegression
import pickle

# Load dataset
df = pd.read_csv("dataset.csv")

# Extract BHK safely
def extract_bhk(x):
    try:
        return int(str(x).split(' ')[0])
    except:
        return None

df['bhk'] = df['size'].apply(extract_bhk)

# Convert sqft to numeric
def convert_sqft(x):
    try:
        if '-' in str(x):
            parts = str(x).split('-')
            return (float(parts[0]) + float(parts[1])) / 2
        return float(x)
    except:
        return None

df['total_sqft'] = df['total_sqft'].apply(convert_sqft)

# Clean dataset
df = df.dropna(subset=['bhk', 'total_sqft', 'bath', 'price'])

# ✅ Train model for Dehu–Solapur
df_dehu = df[df['location'].str.contains("Dehu|Solapur", case=False, na=False)]
X_dehu = df_dehu[['total_sqft', 'bhk', 'bath']]
y_dehu = df_dehu['price']

X_train, X_test, y_train, y_test = train_test_split(X_dehu, y_dehu, test_size=0.2, random_state=42)
model_dehu = LinearRegression()
model_dehu.fit(X_train, y_train)
pickle.dump(model_dehu, open("model_dehu.pkl", "wb"))
print("✅ Dehu–Solapur model saved as model_dehu.pkl")

# ✅ Train model for Kolhapur–Nashik
df_kolhapur = df[df['location'].str.contains("Kolhapur|Nashik", case=False, na=False)]
X_kolhapur = df_kolhapur[['total_sqft', 'bhk', 'bath']]
y_kolhapur = df_kolhapur['price']

X_train, X_test, y_train, y_test = train_test_split(X_kolhapur, y_kolhapur, test_size=0.2, random_state=42)
model_kolhapur = LinearRegression()
model_kolhapur.fit(X_train, y_train)
pickle.dump(model_kolhapur, open("model_kolhapur.pkl", "wb"))
print("✅ Kolhapur–Nashik model saved as model_kolhapur.pkl")

# 🏢 AI-Powered Property Price Predictor

An interactive, production-ready full-stack machine learning web application that forecasts real estate valuations across emerging regional corridors. Built with a responsive **React Single Page Application (SPA)** architecture and a high-performance **FastAPI micro-backend**, this project delivers transparent, rule-adjusted regression insights paired with live market analytics.

---

## 🚀 Core Features

* **Dual-Corridor Machine Learning Forecasts:** Implements dedicated predictive regression pipelines for targeting key economic pipelines (`Dehu-Solapur` & `Kolhapur-Nashik`).
* **Hybrid Layout Form Controls:** Smart UI layout that supports standard toggle matrices but seamlessly switches to validation input fields when managing complex outlier property parameters (e.g., 5+ BHK arrangements, large bathroom clusters, or custom floor depths).
* **Transparent Valuation Factor Summaries:** Completely eliminates misleading pseudo-precision calculations. Features a highly clean, realistic "how your selections affect price" breakdown panel utilizing everyday real estate logic.
* **Side-by-Side Market Matrix:** Generates clean, dynamic comparative bar charts using synchronized `Recharts` visualization blocks to benchmark asset value across alternative sectors immediately.
* **Dynamic Backend Floor Corrections:** Infuses analytical rule-based processing layers directly on top of model inferences to adjust pricing variables for grounded configurations (e.g., ease-of-access reductions) and high-rise premium view heights.

---

## 🛠️ Architecture & Tech Stack

```text
       ┌─────────────────┐             ┌─────────────────┐
       │   React Client  │ ◄─────────► │  FastAPI Server │ ◄─── Scikit-Learn (PKL)
       │  (Framer/Charts)│  REST API   │   (Uvicorn Engine)│
       └─────────────────┘             └─────────────────┘

Frontend Dashboard: React.js, Vite engine, Tailwind CSS layouts, Framer Motion transitions, and Recharts interactive vector graphs.

Microservices Backend: FastAPI (Python), Uvicorn asynchronous server loop, NumPy matrices, and Pydantic schema validation layers.

Predictive Layer: Scikit-Learn pipeline instances exported and mapped via binary serialized Pickle models.

📋 API Architecture & Endpoints
1. Compute Pipeline Valuation
Endpoint: POST /predict

Payload Structure:
{
  "corridor": "Dehu-Solapur",
  "bhk": 2,
  "sqft": 1200,
  "bathrooms": 2,
  "floor": 3,
  "amenities": ["Lift", "Open Parking"]
}
Success Output: Yields base predicted parameters augmented with real-time floor modifiers.

2. Multi-Zone Comparison Pipeline
Endpoint: POST /compare

Payload Structure: Accepts matching profile configuration files to compute side-by-side market valuations across parallel corridor pipelines simultaneously.

💻 Local Installation & Environment Setup
Follow these streamlined instructions to get your local development instance initialized:
Step 1: Clone the Repository Infrastructure
git clone <your-github-repository-link>
cd property-price-predictor

Step 2: Establish the Micro-Backend (FastAPI)
1.Initialize your terminal system and drill into the background folder: cd backend
2.Set up package requirements using your preferred workspace toolchain or active virtual environment:pip install -r requirements.txt
3.Boot up the asynchronous API worker loop:uvicorn main:app --reload

Port Note: The local FastAPI connection establishes active listeners instantly at: http://127.0.0.1:8000
open : http://127.0.0.1:8000/docs

Step 3: Launch the UI Interface (React + Vite)
1.Initialize a separate concurrent terminal layer and navigate into your client workspace directory:cd frontend
2.Pull down required web infrastructure and layout packages:npm install
3.Initialize the lightning-fast Vite execution module:npm run dev

Port Note: Open your client window to engage with the layout panel live at: http://localhost:5173

💡 Developer Insights: Project Engineering Quality
Clean Frontend Logic Flow: Managed state isolation techniques securely within centralized custom handlers to prevent unnecessary component reflow cycles.

Architectural Safety Fallbacks: Integrated adaptive rule layers inside prediction methods to gracefully handle empty parameter maps or missed feature queries without disrupting app runtimes.

Production Readability: Free from academic buzzwords, creating a highly clear user experience built around realistic real estate industry mechanics.
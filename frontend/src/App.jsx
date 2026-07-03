import { useState } from "react";
import "./App.css";
import PriceComparison from "./components/PriceComparison";
import { motion } from "framer-motion";

function App() {
  const [form, setForm] = useState({
    corridor: "Dehu-Solapur",
    bhk: "2",
    sqft: "1200",
    bathrooms: "2",
    floor: "3",
    amenities: [],
  });

  const [customBhk, setCustomBhk] = useState(false);
  const [customBath, setCustomBath] = useState(false);
  const [customFloor, setCustomFloor] = useState(false);

  const [predictionData, setPredictionData] = useState(null);
  const [comparison, setComparison] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSelectValue = (name, value) => {
    if (value === "5+") {
      if (name === "bhk") setCustomBhk(true);
      if (name === "bathrooms") setCustomBath(true);
      setForm({ ...form, [name]: "6" });
    } else if (value === "Other") {
      if (name === "floor") setCustomFloor(true);
      setForm({ ...form, [name]: "6" });
    } else {
      if (name === "bhk") setCustomBhk(false);
      if (name === "bathrooms") setCustomBath(false);
      if (name === "floor") setCustomFloor(false);
      setForm({ ...form, [name]: value });
    }
  };

  const handleAmenityChange = (e) => {
    if (e.target.checked) {
      setForm({ ...form, amenities: [...form.amenities, e.target.value] });
    } else {
      setForm({
        ...form,
        amenities: form.amenities.filter((a) => a !== e.target.value),
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    await new Promise((resolve) => setTimeout(resolve, 1000));

    try {
      const response = await fetch("http://127.0.0.1:8000/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const result = await response.json();
      const basePrice = parseFloat(result.predicted_price_lakhs);
      
      const calculatedSqftPrice = form.sqft ? Math.round((basePrice * 100000) / parseInt(form.sqft)) : 0;
      const lowerRange = (basePrice * 0.95).toFixed(2);
      const upperRange = (basePrice * 1.05).toFixed(2);

      // --- ULTRA-SHORT PROPERTY SUMMARY FACTOR LOGIC (FIXED SPACING) ---
const drivers = [];
const sqftVal = parseInt(form.sqft) || 0;
const bhkVal = parseInt(form.bhk) || 0;
const floorVal = parseInt(form.floor) || 0;

drivers.push({
  label: "Property Size:", // Added colon for separation
  value: ` ${sqftVal.toLocaleString('en-IN')} Sq. Ft.`, // Added leading space
  detail: `Area price set at ₹${calculatedSqftPrice.toLocaleString('en-IN')}/sq.ft. base price.`,
  type: "neutral"
});

drivers.push({
  label: "Layout:", 
  value: ` ${bhkVal} BHK`, 
  detail: `Keep configuration standard for a ${bhkVal}-room unit.`,
  type: "neutral"
});

if (floorVal === 0) {
  drivers.push({
    label: "Floor Position:",
    value: " Ground Floor",
    detail: "Slightly reduced price due to ground level adjustment.",
    type: "negative"
  });
} else if (floorVal > 5) {
  drivers.push({
    label: "Floor Position:",
    value: ` Floor ${floorVal}`,
    detail: "Higher levels add standard high-rise view pricing.",
    type: "neutral"
  });
} else {
  drivers.push({
    label: "Floor Position:",
    value: ` Floor ${floorVal}`,
    detail: "Mid-level positioning maintains a stable baseline value.",
    type: "positive"
  });
}

if (form.amenities.length > 0) {
  drivers.push({
    label: "Amenities:",
    value: ` ${form.amenities.length} Added`,
    detail: `Premium included for: ${form.amenities.join(", ")}.`,
    type: "positive"
  });
} else {
  drivers.push({
    label: "Amenities:",
    value: " None Selected",
    detail: "No premium amenities chosen; base rate remains clean.",
    type: "neutral"
  });
}
      setPredictionData({
        formattedPrice: `₹ ${basePrice.toFixed(2)} Lakhs`,
        perSqft: `₹ ${calculatedSqftPrice.toLocaleString('en-IN')} / sq.ft`,
        range: `₹ ${lowerRange}L – ₹ ${upperRange}L`,
        activeCorridor: form.corridor,
        valuationDrivers: drivers
      });

    } catch (error) {
      console.error("Error fetching prediction:", error);
      setPredictionData({ 
        formattedPrice: "Server Connection Error", 
        perSqft: "N/A", 
        range: "N/A", 
        activeCorridor: form.corridor,
        valuationDrivers: [{ label: "Error", value: "N/A", detail: "Could not generate breakdown.", type: "negative" }]
      });
    }

    setLoading(false);
  };

  const handleCompare = async () => {
    setLoading(true);
    try {
      const response = await fetch("http://127.0.0.1:8000/compare", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const result = await response.json();
      setComparison(result);
    } catch (error) {
      console.error("Error fetching comparison:", error);
      setComparison(null);
    }
    setLoading(false);
  };

  return (
    <div>
      <motion.header
        className="app-header"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h1>AI-Powered Property Price Predictor</h1>
        <p>Know the right price of your dream property</p>
      </motion.header>

      <div className="main-container">
        {/* Left Side Form Box */}
        <motion.div
          className="form-card glass-card"
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <form onSubmit={handleSubmit} className="form-layout">
            
            <div className="input-group">
              <label>Corridor</label>
              <select name="corridor" value={form.corridor} onChange={handleChange}>
                <option>Dehu-Solapur</option>
                <option>Kolhapur-Nashik</option>
              </select>
            </div>

            <div className="input-group">
              <label>Super Built-up Area (Sq. Ft.)</label>
              <input
                type="number"
                name="sqft"
                placeholder="e.g. 1200"
                value={form.sqft}
                onChange={handleChange}
              />
            </div>

            <div className="input-group">
              <div className="label-row-split">
                <label>No. of Bedrooms (BHK)</label>
                {customBhk && <button type="button" className="inline-reset" onClick={() => handleSelectValue("bhk", "2")}>← Use Toggles</button>}
              </div>
              {!customBhk ? (
                <div className="toggle-row">
                  {["1", "2", "3", "4", "5+"].map((num) => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => handleSelectValue("bhk", num)}
                      className={`toggle-btn ${form.bhk === num ? "active" : ""}`}
                    >
                      {num}
                    </button>
                  ))}
                </div>
              ) : (
                <input
                  type="number"
                  name="bhk"
                  min="1"
                  value={form.bhk}
                  onChange={handleChange}
                  className="manual-input-highlight"
                />
              )}
            </div>

            <div className="input-group">
              <div className="label-row-split">
                <label>Bathrooms</label>
                {customBath && <button type="button" className="inline-reset" onClick={() => handleSelectValue("bathrooms", "2")}>← Use Toggles</button>}
              </div>
              {!customBath ? (
                <div className="toggle-row">
                  {["1", "2", "3", "4", "5+"].map((num) => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => handleSelectValue("bathrooms", num)}
                      className={`toggle-btn ${form.bathrooms === num ? "active" : ""}`}
                    >
                      {num}
                    </button>
                  ))}
                </div>
              ) : (
                <input
                  type="number"
                  name="bathrooms"
                  min="1"
                  value={form.bathrooms}
                  onChange={handleChange}
                  className="manual-input-highlight"
                />
              )}
            </div>

            <div className="input-group">
              <div className="label-row-split">
                <label>Floor Number</label>
                {customFloor && <button type="button" className="inline-reset" onClick={() => handleSelectValue("floor", "3")}>← Use Toggles</button>}
              </div>
              {!customFloor ? (
                <div className="toggle-row">
                  {["0", "1", "2", "3", "5", "Other"].map((f) => (
                    <button
                      key={f}
                      type="button"
                      onClick={() => handleSelectValue("floor", f)}
                      className={`toggle-btn ${form.floor === f ? "active" : ""}`}
                    >
                      {f === "0" ? "GF" : f}
                    </button>
                  ))}
                </div>
              ) : (
                <input
                  type="number"
                  name="floor"
                  min="0"
                  value={form.floor}
                  onChange={handleChange}
                  className="manual-input-highlight"
                />
              )}
            </div>

            <div className="input-group">
              <label style={{ marginBottom: "10px", display: "block" }}>Amenities</label>
              <div className="amenities-row">
                {["Covered Parking", "Open Parking", "Lift"].map((a) => (
                  <label key={a} className="checkbox-label">
                    <input
                      type="checkbox"
                      value={a}
                      checked={form.amenities.includes(a)}
                      onChange={handleAmenityChange}
                    />{" "}
                    {a}
                  </label>
                ))}
              </div>
            </div>

            <div className="actions-row">
              <button type="submit" className="predict-btn primary" disabled={loading}>
                {loading ? (
                  <div className="btn-loader-container">
                    <div className="spinner"></div>
                    <span>Calculating...</span>
                  </div>
                ) : (
                  "Calculate Property Price"
                )}
              </button>
              
              <button type="button" onClick={handleCompare} className="predict-btn secondary" disabled={loading}>
                Compare Prices
              </button>
            </div>
          </form>
        </motion.div>

        {/* Right Side Dashboard Results Panel */}
        <motion.div
          className="result-card glass-card"
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          {predictionData ? (
            <div className="analytics-display">
              <div className="corridor-highlight-badge">
                <span className="badge-label">Selected Target:</span>
                <span className="badge-value">{predictionData.activeCorridor}</span>
              </div>

              <h2 className="section-title">Estimated Price</h2>
              <div className="main-price-badge">
                {predictionData.formattedPrice}
              </div>
              
              <div className="stats-grid">
                <div className="stat-card">
                  <span className="stat-label">Unit Rate</span>
                  <span className="stat-val">{predictionData.perSqft}</span>
                </div>
                <div className="stat-card">
                  <span className="stat-label">Market Range (±5%)</span>
                  <span className="stat-val">{predictionData.range}</span>
                </div>
              </div>

              {/* Dependable Valuation Factor Summary */}
              <div className="explainability-block">
                <h3 className="explainability-title">📋 Valuation Factor Summary</h3>
                <div className="drivers-list">
                  {predictionData.valuationDrivers.map((driver, idx) => (
                    <div key={idx} className={`driver-item ${driver.type}`}>
                      <div className="driver-header-row">
                        <span className="driver-label-text">{driver.label}</span>
                        <span className="driver-math-badge">{driver.value}</span>
                      </div>
                      <p className="driver-sub-detail">{driver.detail}</p>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          ) : (
            <div className="empty-state">
              <h2>Estimated Price</h2>
              <p className="placeholder-text">Enter specifications to calculate price summary.</p>
            </div>
          )}

          {comparison && (
            <motion.div
              className="chart-container"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="section-title" style={{ marginTop: "1.5rem" }}>
                Corridor Comparison
              </h2>
              <PriceComparison
                dehuPrice={comparison["Dehu-Solapur"]}
                kolhapurPrice={comparison["Kolhapur-Nashik"]}
              />
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
}

export default App;
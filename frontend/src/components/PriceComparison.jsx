import { BarChart, Bar, Cell, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, LabelList } from "recharts";

function PriceComparison({ dehuPrice, kolhapurPrice }) {
  
  // Clean raw numerical parsing to map direct live states accurately
  const data = [
    { 
      corridor: "Dehu–Solapur", 
      price: dehuPrice ? Number(dehuPrice) : 0,
      barColor: "#38a169" // Brand Emerald Green
    },
    { 
      corridor: "Kolhapur–Nashik", 
      price: kolhapurPrice ? Number(kolhapurPrice) : 0,
      barColor: "#3182ce" // Brand Slate Blue
    },
  ];

  // Custom Premium Hover Tooltip Box
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div style={{
          background: "rgba(31, 41, 55, 0.95)",
          color: "#fff",
          padding: "10px 14px",
          borderRadius: "8px",
          boxShadow: "0 4px 15px rgba(0,0,0,0.2)",
          border: "none",
          fontFamily: "'Segoe UI', sans-serif",
          fontSize: "13px"
        }}>
          <p style={{ margin: 0, fontWeight: "bold" }}>{payload[0].payload.corridor}</p>
          <p style={{ margin: "4px 0 0 0", color: "#a7f3d0", fontWeight: "600" }}>
            Valuation: ₹ {Number(payload[0].value).toFixed(2)} Lakhs
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <ResponsiveContainer width="100%" height={260}>
      <BarChart data={data} margin={{ top: 25, right: 20, left: -10, bottom: 5 }}>
        
        {/* Horizontal structural guide grid borders */}
        <CartesianGrid strokeDasharray="4 4" stroke="#e2e8f0" vertical={false} />
        
        <XAxis 
          dataKey="corridor" 
          axisLine={false}
          tickLine={false}
          tick={{ fill: "#4a5568", fontSize: 12, fontWeight: 600, fontFamily: "'Segoe UI'" }}
        />
        
        <YAxis 
          axisLine={false}
          tickLine={false}
          tick={{ fill: "#718096", fontSize: 11, fontFamily: "'Segoe UI'" }}
          tickFormatter={(value) => `₹${Math.round(value)}L`}
        />
        
        {/* Tooltip config with safe layout triggers */}
        <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(0,0,0,0.02)" }} />
        
        <Bar 
          dataKey="price" 
          radius={[6, 6, 0, 0]} 
          maxBarSize={50}
        >
          {/* CORRECTED: Standard Cell injection mapping preserves the hover state and mouse event tracking */}
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.barColor} />
          ))}
          
          {/* Dynamic Top Badge Values */}
          <LabelList 
            dataKey="price" 
            position="top" 
            offset={8}
            formatter={(value) => `₹${Number(value).toFixed(2)}L`}
            style={{ fill: "#2d3748", fontSize: 12, fontWeight: 700, fontFamily: "'Segoe UI'" }}
          />
        </Bar>

      </BarChart>
    </ResponsiveContainer>
  );
}

export default PriceComparison;
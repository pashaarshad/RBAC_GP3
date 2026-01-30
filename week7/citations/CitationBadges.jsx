export default function CitationBadges() {
  const citations = [
    {
      document: "Q1_Financial_Report.md",
      department: "Finance",
      confidence: 0.88,
    },
    {
      document: "HR_Leave_Policy.md",
      department: "HR",
      confidence: 0.82,
    },
  ];

  const badgeColor = (dept) => {
    if (dept === "Finance") return "#1e90ff";
    if (dept === "HR") return "#2ecc71";
    if (dept === "Engineering") return "#9b59b6";
    return "#7f8c8d";
  };

  return (
    <div style={{ marginTop: "10px" }}>
      <h4>📌 Sources</h4>

      {citations.map((item, index) => (
        <span
          key={index}
          title={`Confidence: ${item.confidence}`}
          style={{
            backgroundColor: badgeColor(item.department),
            color: "white",
            padding: "6px 12px",
            marginRight: "8px",
            borderRadius: "12px",
            fontSize: "12px",
            cursor: "pointer",
          }}
        >
          {item.document}
        </span>
      ))}
    </div>
  );
}

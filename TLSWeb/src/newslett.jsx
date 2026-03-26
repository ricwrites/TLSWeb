import React, { useEffect, useState } from "react";

/* =========================
   MAIN NEWSLETTER WRAPPER
========================= */
export function Newsletter() {
  return <NewsletterApp />;
}

/* =========================
   HELPER: SAFE JSON PARSE
========================= */
function parseJSONSafe(val, fallback) {
  if (!val) return fallback;
  if (typeof val === "object") return val;
  try {
    return JSON.parse(val);
  } catch {
    return fallback;
  }
}

/* =========================
   NORMALIZE ISSUE
========================= */
function normalizeIssue(issue) {
  return {
    ...issue,
    layout: parseJSONSafe(issue.layout, []).map((row) => ({
      ...row,
      style: parseJSONSafe(row.style, {
        margin: "0",
        padding: "0",
        border: "none",
        borderRadius: "0px",
        backgroundColor: "#fff",
      }),
      columns: (row.columns || []).map((col) => ({
        ...col,
        style: parseJSONSafe(col.style, {
          margin: "0",
          padding: "0",
          border: "none",
          borderRadius: "0px",
          backgroundColor: "#fff",
        }),
        items: col.items || [],
      })),
    })),
    items: Object.fromEntries(
      Object.entries(parseJSONSafe(issue.items, {})).map(([id, item]) => [
        id,
        {
          ...item,
          style: parseJSONSafe(item.style, {
            margin: "0",
            padding: "0",
            border: "none",
            borderRadius: "0px",
            backgroundColor: "#fff",
            fontFamily: "Arial",
            fontSize: 16,
            color: "#000",
            bold: false,
            italic: false,
          }),
        },
      ])
    ),
    theme: parseJSONSafe(issue.theme, {
      primary: "#2c3e50",
      secondary: "#f4f4f4",
      accent: "#f39c12",
    }),
    headerStyle: parseJSONSafe(issue.headerStyle, {
      bold: true,
      italic: false,
      fontFamily: "Georgia",
      fontSize: 32,
      color: "#fff",
    }),
  };
}

/* =========================
   FULL APP COMPONENT
========================= */
function NewsletterApp() {
  const [issues, setIssues] = useState([]);
  const [selectedIssue, setSelectedIssue] = useState(null);

  /* =========================
     FETCH PUBLISHED ISSUES
  ========================== */
  useEffect(() => {
    fetch("https://learningsanctuaryt.onrender.com/api/newsletter/published")
      .then((res) => res.json())
      .then((data) => {
        const normalized = (data || []).map(normalizeIssue);
        setIssues(normalized);
      })
      .catch((err) => console.error("Failed to fetch published issues:", err));
  }, []);

  /* =========================
     FETCH SINGLE ISSUE
  ========================== */
  const fetchIssue = (id) => {
    fetch(`https://learningsanctuaryt.onrender.com/api/newsletter/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setSelectedIssue(normalizeIssue(data));
      })
      .catch((err) => console.error("Failed to fetch issue:", err));
  };

  const goBack = () => setSelectedIssue(null);

  /* =========================
     LIST VIEW
  ========================== */
  if (!selectedIssue) {
    return (
      <div>
        <h2>Newsletters</h2>
        {issues.length === 0 && <p>No published issues yet.</p>}
        {issues.map((issue) => (
          <button
            key={issue.id}
            onClick={() => fetchIssue(issue.id)}
            style={{ display: "block", margin: "10px 0", padding: "10px 20px" }}
          >
            {issue.month} {issue.year}
          </button>
        ))}
      </div>
    );
  }

  /* =========================
     SINGLE ISSUE VIEW
  ========================== */
  return (
    <div>
      <button onClick={goBack} style={{ marginBottom: "20px" }}>
        ← Back to all issues
      </button>

      {/* HEADER */}
      <div
        style={{
          background: selectedIssue.theme.primary,
          color: selectedIssue.headerStyle.color,
          padding: 30,
          textAlign: "center",
          fontSize: selectedIssue.headerStyle.fontSize,
          fontWeight: selectedIssue.headerStyle.bold ? "bold" : "normal",
          fontStyle: selectedIssue.headerStyle.italic ? "italic" : "normal",
          fontFamily: selectedIssue.headerStyle.fontFamily,
          marginBottom: 30,
          borderRadius: 8,
        }}
      >
        {selectedIssue.month} {selectedIssue.year} Newsletter
      </div>

      {/* CONTENT LAYOUT */}
      {(!selectedIssue.layout || selectedIssue.layout.length === 0) && (
        <p>No content in this issue.</p>
      )}

      {selectedIssue.layout.map((row, i) => (
        <div
          key={row.id || i}
          style={{
            display: "grid",
            gridTemplateColumns: row.columns.map(() => "1fr").join(" "),
            gap: 20,
            marginBottom: 20,
            ...row.style,
          }}
        >
          {row.columns.map((col) => (
            <div key={col.id} style={col.style}>
              {col.items.map((itemId) => {
                const item = selectedIssue.items[itemId];
                if (!item) return null;

                return (
                  <div key={itemId} style={item.style}>
                    {/* TEXT BLOCK */}
                    {item.type === "text" && (
                      <>
                        <h3>{item.title}</h3>
                        <p>{item.content}</p>
                        {item.author && <small>— {item.author}</small>}
                      </>
                    )}

                    {/* IMAGE BLOCK */}
                    {item.type === "image" && (
                      <>
                        {item.title && <h3>{item.title}</h3>}
                        <img
                          src={item.image || item.images?.[0]}
                          alt={item.title}
                          style={{ maxWidth: "100%" }}
                        />
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

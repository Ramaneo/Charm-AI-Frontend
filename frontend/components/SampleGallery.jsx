import React from "react";

export default function SampleGallery({ samples, imageUrl, onSampleClick }) {
  if (samples.length === 0) return null;

  return (
    <div
      style={{
        padding: "12px 8px",
        overflowX: "auto",
        overflowY: "hidden",
      }}
    >
      <div
        style={{
          gap: "8px",
          display: "inline-flex",
        }}
      >
        {samples.map((sample, index) => (
          <div
            key={index}
            onClick={() => onSampleClick(sample)}
            style={{
              cursor: "pointer",
              border:
                imageUrl === sample.url
                  ? "2px solid #000"
                  : "2px solid transparent",
              borderRadius: "6px",
              overflow: "hidden",
              transition: "all 0.2s ease",
              flexShrink: 0,
              width: "60px",
              height: "60px",
              aspectRatio: 1,
              flex: 1,
              backgroundColor: "#fff",
            }}
            onMouseEnter={(e) => {
              if (imageUrl !== sample.url) {
                e.currentTarget.style.borderColor = "#999";
              }
            }}
            onMouseLeave={(e) => {
              if (imageUrl !== sample.url) {
                e.currentTarget.style.borderColor = "transparent";
              }
            }}
            title={sample.prompt}
          >
            <img
              src={sample.url}
              alt={sample.prompt}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                scale: "4",
                translate: "0 -75%",
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

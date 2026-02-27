import React from "react";
import Aurora from "./Aurora";

export default function CharmPreview({ imageUrl, loading, error, color }) {
  const isDebugMode =
    typeof window !== "undefined" &&
    new URLSearchParams(window.location.search).has("charmDebug");

  const isMobile = typeof window !== "undefined" && window.innerWidth <= 768;

  const getTransform = () => {
    return isMobile
      ? "scale(1.7) translate(0, -30px)"
      : "scale(1.3) translate(0, -60px)";
  };

  return (
    <div
      style={{
        position: "relative",
        flex: "1",
        minHeight: 0,
        overflow: "hidden",
        aspectRatio: "1.35",
        // aspectRatio: isDebugMode ? "1" : "1.35",
      }}
    >
      <div
        style={{
          opacity: loading ? 1 : 0,
          width: "100%",
          height: "100%",
          position: "absolute",
          transition: "opacity 0.5s ease-in-out",
          pointerEvents: loading ? "auto" : "none",
          zIndex: 2,
        }}
      >
        <Aurora
          colorStops={["#a35784", "#4d776f", "#a35784"]}
          blend={1}
          amplitude={1.0}
          speed={2}
        />
      </div>
      {error && <div style={{ color: "red", padding: "8px" }}>{error}</div>}
      <img
        src={imageUrl}
        alt="Generated"
        style={{
          maxWidth: "100%",
          width: "100%",
          filter:
            color === "White"
              ? `grayscale(1)`
              : color === "Rose"
              ? `hue-rotate(336deg) saturate(0.8)`
              : "none",
          objectFit: "cover",
          position: "absolute",
          top: "0",
          height: "100%",
          objectPosition: "bottom",
          transform: getTransform(),
        }}
      />
    </div>
  );
}

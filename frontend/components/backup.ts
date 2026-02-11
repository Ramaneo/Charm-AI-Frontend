import { usePollinationsImage } from "@pollinations/react";
import React, { useState, useEffect } from "react";
import { GradientBackground } from "react-gradient-animation";

export default function App() {
  const [inputValue, setInputValue] = useState("");
  const [generateValue, setGenerateValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [options] = useState({
    width: 1024,
    height: 1024,
    seed: 13428,
    model: "nanobanana",
  });

  useEffect(() => {
    const btn = document.querySelector(".generate-btn");
    const input = document.querySelector(".custom-name-input");
    if (!btn || !input) return;
    const handleClick = () => {
      const value = input.value.trim();
      if (!value) return;
      setLoading(true);
      setError("");
      setGenerateValue(value);
      setLoading(false);
    };
    btn.addEventListener("click", handleClick);
    return () => btn.removeEventListener("click", handleClick);
  }, []);

  // Compose prompts for each angle
  const basePrompt =
    "one single jewelry charm, made entirely of yellow gold, no other colors, no gems, no stones, no other materials, isolated, {ANGLE}, white background, no chain, no props, no text, highly detailed, realistic. ";
  const prompts = [
    {
      label: "Front",
      prompt: basePrompt.replace("{ANGLE}", "front view") + generateValue,
    },
    {
      label: "Side",
      prompt: basePrompt.replace("{ANGLE}", "side view") + generateValue,
    },
    {
      label: "Back",
      prompt: basePrompt.replace("{ANGLE}", "back view") + generateValue,
    },
    {
      label: "Top",
      prompt: basePrompt.replace("{ANGLE}", "top view") + generateValue,
    },
    {
      label: "3/4",
      prompt:
        basePrompt.replace("{ANGLE}", "three quarter view") + generateValue,
    },
  ];

  // Use hooks in fixed order
  const imageUrlFront = usePollinationsImage(prompts[0].prompt, options);
  const imageUrlSide = usePollinationsImage(prompts[1].prompt, options);
  const imageUrlBack = usePollinationsImage(prompts[2].prompt, options);
  const imageUrlTop = usePollinationsImage(prompts[3].prompt, options);
  const imageUrl34 = usePollinationsImage(prompts[4].prompt, options);

  return (
    <div>
      <div style={{ marginTop: "1em" }}>
        {loading && <div>Loading...</div>}
        {error && <div style={{ color: "red" }}>{error}</div>}
        {generateValue && (
          <div style={{ display: "flex", flexWrap: "wrap", gap: 16 }}>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontWeight: 500, marginBottom: 4 }}>Front</div>
              {imageUrlFront ? (
                <img
                  src={imageUrlFront}
                  alt="Front view"
                  style={{
                    maxWidth: "180px",
                    height: "auto",
                    clipPath: "inset(6% 0% 6% 0%)",
                    marginTop: "-6%",
                    border: "1px solid #eee",
                    borderRadius: 8,
                  }}
                />
              ) : (
                <div>Loading...</div>
              )}
            </div>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontWeight: 500, marginBottom: 4 }}>Side</div>
              {imageUrlSide ? (
                <img
                  src={imageUrlSide}
                  alt="Side view"
                  style={{
                    maxWidth: "180px",
                    height: "auto",
                    clipPath: "inset(6% 0% 6% 0%)",
                    marginTop: "-6%",
                    border: "1px solid #eee",
                    borderRadius: 8,
                  }}
                />
              ) : (
                <div>Loading...</div>
              )}
            </div>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontWeight: 500, marginBottom: 4 }}>Back</div>
              {imageUrlBack ? (
                <img
                  src={imageUrlBack}
                  alt="Back view"
                  style={{
                    maxWidth: "180px",
                    height: "auto",
                    clipPath: "inset(6% 0% 6% 0%)",
                    marginTop: "-6%",
                    border: "1px solid #eee",
                    borderRadius: 8,
                  }}
                />
              ) : (
                <div>Loading...</div>
              )}
            </div>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontWeight: 500, marginBottom: 4 }}>Top</div>
              {imageUrlTop ? (
                <img
                  src={imageUrlTop}
                  alt="Top view"
                  style={{
                    maxWidth: "180px",
                    height: "auto",
                    clipPath: "inset(6% 0% 6% 0%)",
                    marginTop: "-6%",
                    border: "1px solid #eee",
                    borderRadius: 8,
                  }}
                />
              ) : (
                <div>Loading...</div>
              )}
            </div>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontWeight: 500, marginBottom: 4 }}>3/4</div>
              {imageUrl34 ? (
                <img
                  src={imageUrl34}
                  alt="3/4 view"
                  style={{
                    maxWidth: "180px",
                    height: "auto",
                    clipPath: "inset(6% 0% 6% 0%)",
                    marginTop: "-6%",
                    border: "1px solid #eee",
                    borderRadius: 8,
                  }}
                />
              ) : (
                <div>Loading...</div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

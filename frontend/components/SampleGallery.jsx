import React, { useRef, useState, useEffect } from "react";

export default function SampleGallery({ samples, imageUrl, onSampleClick }) {
  const isMobile = typeof window !== "undefined" && window.innerWidth <= 768;
  const scrollContainerRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const checkScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } =
        scrollContainerRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1);
    }
  };

  useEffect(() => {
    checkScroll();
    window.addEventListener("resize", checkScroll);
    return () => window.removeEventListener("resize", checkScroll);
  }, [samples]);

  const scroll = (direction) => {
    if (scrollContainerRef.current) {
      const scrollAmount = 300;
      scrollContainerRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  if (samples.length === 0) return null;

  return (
    <div
      style={{
        position: !isMobile ? "sticky" : "relative",
        ...(!isMobile && {
          bottom: "5px",
          background: "#fff8",
          zIndex: 9,
          backdropFilter: "blur(10px)",
          padding: "5px 10px",
          margin: "0 10px",
          borderRadius: "10px",
        }),
      }}
    >
      {canScrollLeft && (
        <button
          onClick={() => scroll("left")}
          style={{
            position: "absolute",
            left: "5px",
            top: "45%",
            transform: "translateY(-50%)",
            zIndex: 7,
            background: "rgba(255, 255, 255, 0.9)",
            border: "1px solid #ddd",
            borderRadius: "50%",
            width: "32px",
            height: "32px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
            transition: "all 0.2s ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "rgba(255, 255, 255, 1)";
            e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.2)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "rgba(255, 255, 255, 0.9)";
            e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.15)";
          }}
        >
          <img
            src="https://cdn.shopify.com/s/files/1/0484/1429/4167/files/Vector_10_1.svg?v=1748504186"
            alt="Previous"
            style={{
              width: "10px",
              height: "10px",
              transform: "rotate(-90deg)",
            }}
          />
        </button>
      )}
      {canScrollRight && (
        <button
          onClick={() => scroll("right")}
          style={{
            position: "absolute",
            right: "5px",
            top: "45%",
            transform: "translateY(-50%)",
            zIndex: 7,
            background: "rgba(255, 255, 255, 0.9)",
            border: "1px solid #ddd",
            borderRadius: "50%",
            width: "32px",
            height: "32px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
            transition: "all 0.2s ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "rgba(255, 255, 255, 1)";
            e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.2)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "rgba(255, 255, 255, 0.9)";
            e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.15)";
          }}
        >
          <img
            src="https://cdn.shopify.com/s/files/1/0484/1429/4167/files/Vector_10_1.svg?v=1748504186"
            alt="Next"
            style={{
              width: "10px",
              height: "10px",
              transform: "rotate(90deg)",
            }}
          />
        </button>
      )}
      <div
        ref={scrollContainerRef}
        onScroll={checkScroll}
        style={{
          padding: "5px 0px",
          overflowX: "auto",
          overflowY: "hidden",
          display: "flex",
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
                    : "0px solid transparent",
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
    </div>
  );
}

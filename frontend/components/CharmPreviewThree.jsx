import React, { useState, useEffect, useRef } from "react";
import Aurora from "./Aurora";

const LIFESTYLE_IMAGE_URL =
  "https://cdn.shopify.com/s/files/1/0484/1429/4167/files/23022026-LYNSEH8452.jpg?v=1781691729";

export default function CharmPreview({
  imageUrl,
  modelImageUrl,
  loading,
  modelLoading,
  error,
  color,
  generatedPrompt,
}) {
  const isMobile = typeof window !== "undefined" && window.innerWidth <= 768;
  const [isFixed, setIsFixed] = useState(false);
  const [containerWidth, setContainerWidth] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [fullscreenSrc, setFullscreenSrc] = useState(null);
  const charmRef = useRef(null);
  const modelRef = useRef(null);
  const lifestyleRef = useRef(null);
  const containerRef = useRef(null);

  const [activeSlide, setActiveSlide] = useState(0);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  const hasExtraSlides = Boolean(modelImageUrl || modelLoading);
  const lastSlideIndex = hasExtraSlides ? 2 : 0;
  const slideRefs = [charmRef, modelRef, lifestyleRef];

  const scrollToSlide = (index) => {
    setActiveSlide(index);
    const el = slideRefs[index]?.current;
    if (!el) return;

    const rootFontSize = parseFloat(
      getComputedStyle(document.documentElement).fontSize,
    );
    const offset = 7 * rootFontSize;
    const top = el.getBoundingClientRect().top + window.scrollY - offset;

    window.scrollTo({ top, behavior: "smooth" });
  };

  const minSwipeDistance = 50;

  const onTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
    setIsDragging(true);
    setDragOffset(0);
  };

  const onTouchMove = (e) => {
    const currentTouch = e.targetTouches[0].clientX;
    setTouchEnd(currentTouch);

    if (touchStart) {
      const offset = currentTouch - touchStart;

      // Add slight resistance when swiping past the edges
      if (
        (activeSlide === 0 && offset > 0) ||
        (activeSlide === lastSlideIndex && offset < 0)
      ) {
        setDragOffset(offset * 0.3);
      } else {
        setDragOffset(offset);
      }
    }
  };

  const onTouchEnd = () => {
    setIsDragging(false);

    if (!touchStart || !touchEnd) {
      setDragOffset(0);
      return;
    }

    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe && activeSlide < lastSlideIndex) {
      setActiveSlide(activeSlide + 1);
    } else if (isRightSwipe && activeSlide > 0) {
      setActiveSlide(activeSlide - 1);
    }

    setDragOffset(0);
    setTouchStart(null);
    setTouchEnd(null);
  };

  // useEffect(() => {
  //   const handleScroll = () => {
  //     if (isMobile && containerRef.current) {
  //       const rect = containerRef.current.getBoundingClientRect();
  //       setContainerWidth(rect.width);

  //       // When the container scrolls past the top of the viewport, make charm fixed
  //       if (rect.top <= 0 && !isFixed) {
  //         setIsFixed(true);
  //       } else if (rect.top > 0 && isFixed) {
  //         setIsFixed(false);
  //       }
  //     }
  //   };

  //   const handleResize = () => {
  //     if (isMobile && containerRef.current) {
  //       const rect = containerRef.current.getBoundingClientRect();
  //       setContainerWidth(rect.width);
  //     }
  //   };

  //   if (isMobile) {
  //     handleResize(); // Initial width
  //     window.addEventListener("scroll", handleScroll);
  //     window.addEventListener("resize", handleResize);
  //   }

  //   return () => {
  //     window.removeEventListener("scroll", handleScroll);
  //     window.removeEventListener("resize", handleResize);
  //   };
  // }, [isFixed, isMobile]);

  const getTransform = () => {
    return isMobile
      ? "scale(1.7) translate(0, -30px)"
      : "scale(1.3) translate(0, -60px)";
  };

  return (
    <div
      ref={containerRef}
      style={{
        position: "relative",
        flex: "1",
        minHeight: 0,
        display: "flex",
        flexDirection: "column",
        overflowX: isMobile ? "hidden" : "visible",
      }}
    >
      <div
        onTouchStart={isMobile ? onTouchStart : null}
        onTouchMove={isMobile ? onTouchMove : null}
        onTouchEnd={isMobile ? onTouchEnd : null}
        style={{
          display: "flex",
          flexDirection: isMobile ? "row" : "column",
          alignItems: "flex-start",
          flex: 1,
          width: isMobile && hasExtraSlides ? "300%" : "100%",
          transform:
            isMobile && hasExtraSlides
              ? `translateX(calc(-${
                  activeSlide * (100 / 3)
                }% + ${dragOffset}px))`
              : "none",
          transition: isDragging ? "none" : "transform 0.3s ease-in-out",
          touchAction: "none",
        }}
      >
        <div
          ref={charmRef}
          onClick={() =>
            isMobile &&
            imageUrl &&
            (setFullscreenSrc(imageUrl), setIsFullscreen(true))
          }
          style={{
            position: isFixed ? "fixed" : "relative",
            top: 0,
            left: isFixed ? "50%" : "auto",
            transform: isFixed ? "translateX(-50%)" : "none",
            width: isFixed
              ? `${containerWidth}px`
              : isMobile && hasExtraSlides
              ? "33.3333%"
              : "100%",
            flexShrink: 0,
            overflow: "hidden",
            // aspectRatio: isMobile && !isFixed ? 1 : "0.8",
            aspectRatio: 1,
            // zIndex: 8,
            backgroundColor: "white",
            transition:
              "transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), width 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
            flex: 1,
            cursor: isMobile && imageUrl ? "pointer" : "default",
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
            alt="Generated Charm"
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
              objectPosition: isFixed ? "center" : "bottom",
              // transform: getTransform(),
            }}
          />
          {isMobile && imageUrl && (
            <div
              id="zoom-charm"
              style={{
                position: "absolute",
                bottom: "8px",
                right: "8px",
                background: "rgba(0, 0, 0, 0.6)",
                borderRadius: "50%",
                width: "25px",
                height: "25px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                pointerEvents: "none",
              }}
            >
              <svg
                width="15"
                height="15"
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.35-4.35" />
                <line x1="11" y1="8" x2="11" y2="14" />
                <line x1="8" y1="11" x2="14" y2="11" />
              </svg>
            </div>
          )}
          {generatedPrompt && !loading && (
            <div
              style={{
                position: "absolute",
                bottom: isMobile ? "1%" : "10%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                zIndex: 3,
                // background: "rgba(0, 0, 0, 0.55)",
                // color: "white",
                padding: "8px 14px",
                borderRadius: "8px",
                fontSize: "20px",
                fontFamily: "'OptimaNormalv1Nov2023'",
                fontWeight: 500,
                textAlign: "center",
                // maxWidth: "80%",
                lineHeight: 1.4,
                width: "100%",
                backdropFilter: "blur(4px)",
                pointerEvents: "none",
              }}
            >
              {generatedPrompt}
            </div>
          )}
        </div>

        {isFixed && <div style={{ aspectRatio: "1.35", flexShrink: 0 }} />}

        {(modelImageUrl || modelLoading) && (
          <div
            ref={modelRef}
            onClick={() =>
              isMobile &&
              modelImageUrl &&
              (setFullscreenSrc(modelImageUrl), setIsFullscreen(true))
            }
            style={{
              position: "relative",
              flexShrink: 0,
              overflow: "hidden",
              aspectRatio: 1,
              flex: 1,
              width: isMobile ? "33.3333%" : "100%",
              cursor: isMobile ? "pointer" : "default",
            }}
          >
            <div
              style={{
                opacity: modelLoading ? 1 : 0,
                width: "100%",
                height: "100%",
                position: "absolute",
                transition: "opacity 0.5s ease-in-out",
                pointerEvents: modelLoading ? "auto" : "none",
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
            {modelImageUrl && (
              <img
                src={modelImageUrl}
                alt="Model Reference"
                style={{
                  maxWidth: "100%",
                  width: "100%",
                  objectFit: "cover",
                  position: "absolute",
                  top: "0",
                  height: "100%",
                  objectPosition: "bottom",
                }}
              />
            )}
            {isMobile && modelImageUrl && (
              <div
                id="zoom-charm"
                style={{
                  position: "absolute",
                  bottom: "8px",
                  right: "8px",
                  background: "rgba(0, 0, 0, 0.6)",
                  borderRadius: "50%",
                  width: "25px",
                  height: "25px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  pointerEvents: "none",
                }}
              >
                <svg
                  width="15"
                  height="15"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="11" cy="11" r="8" />
                  <path d="m21 21-4.35-4.35" />
                  <line x1="11" y1="8" x2="11" y2="14" />
                  <line x1="8" y1="11" x2="14" y2="11" />
                </svg>
              </div>
            )}
          </div>
        )}

        {hasExtraSlides && (
          <div
            ref={lifestyleRef}
            onClick={() =>
              isMobile &&
              (setFullscreenSrc(LIFESTYLE_IMAGE_URL), setIsFullscreen(true))
            }
            style={{
              position: "relative",
              flexShrink: 0,
              overflow: "hidden",
              aspectRatio: 1,
              flex: 1,
              width: isMobile ? "33.3333%" : "100%",
              cursor: isMobile ? "pointer" : "default",
            }}
          >
            <img
              src={LIFESTYLE_IMAGE_URL}
              alt="Charm Lifestyle"
              style={{
                maxWidth: "100%",
                width: "100%",
                objectFit: "cover",
                position: "absolute",
                top: "0",
                height: "100%",
                objectPosition: "bottom",
              }}
            />
            {isMobile && (
              <div
                id="zoom-lifestyle"
                style={{
                  position: "absolute",
                  bottom: "8px",
                  right: "8px",
                  background: "rgba(0, 0, 0, 0.6)",
                  borderRadius: "50%",
                  width: "25px",
                  height: "25px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  pointerEvents: "none",
                }}
              >
                <svg
                  width="15"
                  height="15"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="11" cy="11" r="8" />
                  <path d="m21 21-4.35-4.35" />
                  <line x1="11" y1="8" x2="11" y2="14" />
                  <line x1="8" y1="11" x2="14" y2="11" />
                </svg>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Slider dots for Mobile */}
      {isMobile && hasExtraSlides && (
        <div
          style={{
            position: "absolute",
            bottom: "16px",
            left: "0",
            right: "0",
            display: "flex",
            justifyContent: "center",
            gap: "8px",
            zIndex: 10,
          }}
        >
          {[0, 1, 2].map((slideIndex) => (
            <button
              key={slideIndex}
              onClick={() => setActiveSlide(slideIndex)}
              style={{
                width: "8px",
                height: "8px",
                borderRadius: "50%",
                backgroundColor:
                  activeSlide === slideIndex ? "#111" : "rgba(0, 0, 0, 0.3)",
                border: "none",
                padding: 0,
              }}
            />
          ))}
        </div>
      )}

      {/* Vertical scroll dots for Desktop */}
      {!isMobile && hasExtraSlides && (
        <div
          style={{
            position: "fixed",
            top: "50%",
            left: 20,
            right: "16px",
            transform: "translateY(-50%)",
            display: "flex",
            flexDirection: "column",
            gap: "8px",
            zIndex: 10,
          }}
        >
          {[0, 1, 2].map((slideIndex) => (
            <button
              key={slideIndex}
              onClick={() => scrollToSlide(slideIndex)}
              style={{
                width: "8px",
                height: "8px",
                borderRadius: "50%",
                backgroundColor:
                  activeSlide === slideIndex ? "#111" : "rgba(0, 0, 0, 0.3)",
                border: "none",
                padding: 0,
                cursor: "pointer",
              }}
            />
          ))}
        </div>
      )}

      {/* Fullscreen Modal for Mobile */}
      {isMobile && isFullscreen && fullscreenSrc && (
        <div
          onClick={() => setIsFullscreen(false)}
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(0, 0, 0, 0.95)",
            zIndex: 9999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "20px",
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              position: "relative",
              maxWidth: "100%",
              maxHeight: "100%",
              overflow: "auto",
              touchAction: "pinch-zoom",
            }}
          >
            <img
              src={fullscreenSrc}
              alt="Fullscreen Preview"
              style={{
                width: "100%",
                height: "auto",
                objectFit: "contain",
                touchAction: "pinch-zoom",
              }}
            />
          </div>
          <button
            onClick={() => setIsFullscreen(false)}
            style={{
              position: "absolute",
              top: "10px",
              right: "10px",
              background: "rgba(255, 255, 255, 0.9)",
              border: "none",
              borderRadius: "50%",
              width: "40px",
              height: "40px",
              fontSize: "24px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 10000,
            }}
          >
            ×
          </button>
        </div>
      )}
    </div>
  );
}

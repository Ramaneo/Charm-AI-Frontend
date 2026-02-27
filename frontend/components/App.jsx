import React from "react";
import RegularCharmApp from "./RegularCharmApp";
import BirthdayCharmApp from "./BirthdayCharmApp";
import ZodiacCharmApp from "./ZodiacCharmApp";
import PetCharmApp from "./PetCharmApp";

export default function App() {
  // Check if this is the birthday charm page
  const isBirthdayCharmPage =
    typeof window !== "undefined" &&
    (window.location.pathname.includes("design-your-own-birthday-charm") ||
      window.location.href.includes("design-your-own-birthday-charm"));
  const isZodiacCharmPage =
    typeof window !== "undefined" &&
    (window.location.pathname.includes("design-your-own-zodiac-charm") ||
      window.location.href.includes("design-your-own-zodiac-charm"));
  const isPetCharmPage =
    typeof window !== "undefined" &&
    (window.location.pathname.includes("design-your-own-pet-charm") ||
      window.location.href.includes("design-your-own-pet-charm"));

  // Render the appropriate component based on the page
  if (isBirthdayCharmPage) {
    return <BirthdayCharmApp />;
  }
  if (isZodiacCharmPage) {
    return <ZodiacCharmApp />;
  }
  if (isPetCharmPage) {
    return <PetCharmApp />;
  }

  return <RegularCharmApp />;
}

// Initialize session tracking
//   useEffect(() => {
//     // Get or create session ID
//     let sid = localStorage.getItem("charm_session_id");
//     let sessionStart = localStorage.getItem("charm_session_start");
//     const now = Date.now();

//     // Create new session if doesn't exist or older than 30 minutes
//     if (
//       !sid ||
//       !sessionStart ||
//       now - parseInt(sessionStart) > 30 * 60 * 1000
//     ) {
//       sid = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
//       localStorage.setItem("charm_session_id", sid);
//       localStorage.setItem("charm_session_start", now.toString());

//       // Track new session start (GTM)
//       window.dataLayer = window.dataLayer || [];
//       window.dataLayer.push({
//         event: "session_start",
//         session_id: sid,
//         page_location: window.location.href,
//       });
//     }
//     setSessionId(sid);

//     // Load generation count for this session
//     const sessionData = localStorage.getItem(`charm_session_data_${sid}`);
//     if (sessionData) {
//       try {
//         const data = JSON.parse(sessionData);
//         setGenerationCount(data.generationCount || 0);
//       } catch (e) {
//         console.error("Error loading session data:", e);
//       }
//     }
//   }, []);

//   useEffect(() => {
//     if (loading) {
//       setIsPaused(true);
//     }
//   }, [loading]);

//   // Preselected sample URLs for regular charms
//   const PRESELECTED_SAMPLES = [
//     {
//       url: "https://firebasestorage.googleapis.com/v0/b/kutezadmin.appspot.com/o/user_charms%2Fgummy%20bear.png?alt=media&token=gummy%20bear",
//       prompt: "gummy bear",
//     },
//     {
//       url: "https://firebasestorage.googleapis.com/v0/b/kutezadmin.appspot.com/o/user_charms%2Frhaegal%20dragon.png?alt=media&token=rhaegal%20dragon",
//       prompt: "rhaegal dragon",
//     },
//     {
//       url: "https://firebasestorage.googleapis.com/v0/b/kutezadmin.appspot.com/o/user_charms%2Fcupcake.png?alt=media&token=cupcake",
//       prompt: "cupcake",
//     },
//     {
//       url: "https://firebasestorage.googleapis.com/v0/b/kutezadmin.appspot.com/o/user_charms%2Fzodiac%20creature.png?alt=media&token=zodiac%20creature",
//       prompt: "zodiac creature",
//     },
//     {
//       url: "https://firebasestorage.googleapis.com/v0/b/kutezadmin.appspot.com/o/user_charms%2Fdog.png?alt=media&token=dog",
//       prompt: "dog",
//     },
//     {
//       url: "https://firebasestorage.googleapis.com/v0/b/kutezadmin.appspot.com/o/user_charms%2Funicorn.png?alt=media&token=unicorn",
//       prompt: "unicorn",
//     },
//     {
//       url: "https://firebasestorage.googleapis.com/v0/b/kutezadmin.appspot.com/o/user_charms%2Fmicrophone.png?alt=media&token=microphone",
//       prompt: "microphone",
//     },
//     {
//       url: "https://firebasestorage.googleapis.com/v0/b/kutezadmin.appspot.com/o/user_charms%2Fcactus.png?alt=media&token=cactus",
//       prompt: "cactus",
//     },
//     {
//       url: "https://firebasestorage.googleapis.com/v0/b/kutezadmin.appspot.com/o/user_charms%2Fcute%20ghost.png?alt=media&token=cute%20ghost",
//       prompt: "cute ghost",
//     },
//     {
//       url: "https://firebasestorage.googleapis.com/v0/b/kutezadmin.appspot.com/o/user_charms%2Fbee.png?alt=media&token=bee",
//       prompt: "bee",
//     },
//     {
//       url: "https://firebasestorage.googleapis.com/v0/b/kutezadmin.appspot.com/o/user_charms%2Fdolphin.png?alt=media&token=dolphin",
//       prompt: "dolphin",
//     },
//     {
//       url: "https://firebasestorage.googleapis.com/v0/b/kutezadmin.appspot.com/o/user_charms%2Felephant%20tiny.png?alt=media&token=elephant%20tiny",
//       prompt: "elephant tiny",
//     },
//     {
//       url: "https://firebasestorage.googleapis.com/v0/b/kutezadmin.appspot.com/o/user_charms%2Fcat%20foot.png?alt=media&token=cat%20foot",
//       prompt: "cat foot",
//     },
//   ];

//   // Preselected sample URLs for birthday charms
//   const BIRTHDAY_CHARM_SAMPLES = [
//     {
//       url: "https://firebasestorage.googleapis.com/v0/b/kutezadmin.appspot.com/o/user_charms%2Fcat%20foot.png?alt=media&token=cat%20foot",
//       prompt: "cat foot",
//     },
//   ];

//   // Load user-generated samples from localStorage and combine with preselected
//   useEffect(() => {
//     const loadSamples = () => {
//       try {
//         // Check if this is the birthday charm page
//         const isBirthdayCharmPage =
//           window.location.pathname.includes("design-your-own-birthday-charm") ||
//           window.location.href.includes("design-your-own-birthday-charm");

//         const storageKey = isBirthdayCharmPage
//           ? "birthdayCharmGenerations"
//           : "userGeneratedCharms";
//         const userGenerations = localStorage.getItem(storageKey);
//         const userSamples = userGenerations ? JSON.parse(userGenerations) : [];

//         // Use appropriate preselected samples based on page
//         const preselectedSamples = isBirthdayCharmPage
//           ? BIRTHDAY_CHARM_SAMPLES
//           : PRESELECTED_SAMPLES;

//         // Combine user generations with preselected samples
//         setSamples([...userSamples, ...preselectedSamples]);

//         // Track gallery loaded
//         if (sessionId) {
//           trackEvent("gallery_loaded", {});
//         }
//       } catch (e) {
//         console.error("Error loading user samples:", e);
//         // Fallback to appropriate preselected samples
//         const isBirthdayCharmPage =
//           window.location.pathname.includes("design-your-own-birthday-charm") ||
//           window.location.href.includes("design-your-own-birthday-charm");
//         setSamples(
//           isBirthdayCharmPage ? BIRTHDAY_CHARM_SAMPLES : PRESELECTED_SAMPLES,
//         );
//       }
//     };
//     loadSamples();
//   }, [sessionId]);

//   useEffect(() => {
//     const detailInput = document.querySelector(".custom-name-input");
//     // Infinite random sample switching until user generates a preview
//     const blueprint =
//       // "https://cdn.shopify.com/s/files/1/0484/1429/4167/files/charm-blueprint1.png?v=1759407695";
//       "https://firebasestorage.googleapis.com/v0/b/kutezadmin.appspot.com/o/user_charms%2Fgummy%20bear.png?alt=media&token=gummy%20bear";

//     // Only proceed if samples are loaded and not paused
//     if (samples.length === 0 || isPaused) return;

//     const sampleUrls = samples.map((s) => s.url);
//     let interval;
//     // Only start animation if imageUrl is blueprint or a sample
//     if (imageUrl === blueprint || sampleUrls.includes(imageUrl)) {
//       interval = setInterval(() => {
//         // Pick a random sample different from current
//         let next;
//         do {
//           next = samples[Math.floor(Math.random() * samples.length)];
//         } while (next.url === imageUrl && samples.length > 1);
//         detailInput.placeholder = next.prompt;
//         setImageUrl(next.url);
//       }, 1000);
//     }
//     // Stop animation if imageUrl is not blueprint or sample
//     return () => {
//       if (interval) clearInterval(interval);
//     };
//   }, [imageUrl, samples, isPaused]);

//   useEffect(() => {
//     const btn = document.querySelector(".generate-btn");
//     const input = document.querySelector(".custom-name-input");
//     if (!btn || !input) return;

//     // Spinner setup
//     let spinner;
//     let originalSpan;
//     let originalSvg;

//     const setButtonLoading = (isLoading) => {
//       if (!btn) return;
//       if (!originalSpan) originalSpan = btn.querySelector("span");
//       if (!originalSvg) originalSvg = btn.querySelector("svg");
//       if (isLoading) {
//         // Hide original SVG and span
//         if (originalSpan) originalSpan.style.display = "none";
//         if (originalSvg) originalSvg.style.display = "none";
//         // Add spinner if not present
//         if (!spinner) {
//           spinner = document.createElement("span");
//           spinner.className = "copilot-spinner";
//           spinner.style.marginRight = "8px";
//           spinner.innerHTML = `<span class="copilot-spinner__circle"></span>`;
//           btn.insertBefore(spinner, btn.firstChild);
//         }
//         // Add generating text if not present
//         let genText = btn.querySelector(".copilot-generating-text");
//         if (!genText) {
//           genText = document.createElement("span");
//           genText.className = "copilot-generating-text";
//           genText.style.alignSelf = "center";
//           genText.style.fontSize = "11px";
//           genText.style.letterSpacing = ".2em";
//           genText.style.textTransform = "uppercase";
//           genText.textContent = "Generating...";
//           btn.appendChild(genText);
//         }
//       } else {
//         // Restore original SVG and span
//         if (originalSpan) originalSpan.style.display = "";
//         if (originalSvg) originalSvg.style.display = "";
//         // Remove spinner and generating text
//         if (spinner && spinner.parentNode)
//           spinner.parentNode.removeChild(spinner);
//         spinner = null;
//         let genText = btn.querySelector(".copilot-generating-text");
//         if (genText && genText.parentNode)
//           genText.parentNode.removeChild(genText);
//       }
//     };

//     const handleClick = async () => {
//       if (loadingRef.current) return;
//       loadingRef.current = true;
//       setLoading(true);
//       setButtonLoading(true);
//       setError("");
//       const value = input.value.trim();
//       if (!value) {
//         setLoading(false);
//         setButtonLoading(false);
//         loadingRef.current = false;
//         return;
//       }

//       // Track generation start
//       const startTime = Date.now();
//       generationStartTimeRef.current = startTime;

//       trackEvent("charm_generation_start", {
//         prompt: value,
//       });

//       // setImageUrl("");
//       // const apiUrl = `http://localhost:3001/charm-image?input=${encodeURIComponent(

//       // Check if page handle includes "design-your-own-birthday-charm"
//       const isBirthdayCharmPage =
//         window.location.pathname.includes("design-your-own-birthday-charm") ||
//         window.location.href.includes("design-your-own-birthday-charm");

//       let finalPrompt = value;
//       let currentSuffixIndex = 0;

//       if (isBirthdayCharmPage) {
//         // Check if this is the same prompt as last time
//         if (lastPromptRef.current === value) {
//           // Same prompt - increment the suffix index
//           currentSuffixIndex = generationCount % 3;
//         } else {
//           // Different prompt - reset to first suffix (aura)
//           currentSuffixIndex = 0;
//         }

//         const suffixes = [
//           "birthday aura",
//           "birthday spirit",
//           "birthday energy",
//         ];

//         console.log(
//           "raman test",
//           "prompt:",
//           value,
//           "lastPrompt:",
//           lastPromptRef.current,
//           "count:",
//           generationCount,
//           "suffixIndex:",
//           currentSuffixIndex,
//         );

//         finalPrompt = `${value} ${suffixes[currentSuffixIndex]}`;
//         lastPromptRef.current = value;
//       }

//       const apiUrl = `http://localhost:3002/charm-image?input=${encodeURIComponent(
//         // const apiUrl = `/apps/general/charm-image?input=${encodeURIComponent(
//         finalPrompt,
//       )}`;
//       // const apiUrl = `http://localhost:3001/charm-image-legacy?input=${encodeURIComponent(
//       //   value
//       // )}`;
//       try {
//         const res = await fetch(apiUrl);
//         const generationTime = Date.now() - startTime;

//         if (res.status === 429) {
//           trackEvent("generation_rate_limited", {
//             prompt: value,
//             generation_time_ms: generationTime,
//           });
//           setError(
//             "Daily generation limit reached. Please choose from existing prompts in the gallery below or try again tomorrow.",
//           );
//           setLoading(false);
//           setButtonLoading(false);
//           loadingRef.current = false;
//           return;
//         }
//         if (!res.ok) throw new Error("Failed to fetch image");
//         const returnedUrl = res.url;
//         setImageUrl(returnedUrl);
//         setIsPaused(true); // Stop carousel animation and show only generated image

//         // Update generation count
//         const newCount = generationCount + 1;
//         setGenerationCount(newCount);

//         // Save session data
//         try {
//           const sessionData = {
//             generationCount: newCount,
//             lastGeneration: Date.now(),
//           };
//           localStorage.setItem(
//             `charm_session_data_${sessionId}`,
//             JSON.stringify(sessionData),
//           );
//         } catch (e) {
//           console.error("Error saving session data:", e);
//         }

//         // Track successful generation
//         trackEvent("charm_generation_success", {
//           prompt: value,
//           generation_time_ms: generationTime,
//         });

//         // Save to localStorage and add to gallery
//         const promptExists = samples.some(
//           (s) => s.prompt.toLowerCase() === value.toLowerCase(),
//         );
//         if (!promptExists) {
//           // const newSample = { url: returnedUrl, prompt: value };
//           const newSample = {
//             url: `https://firebasestorage.googleapis.com/v0/b/kutezadmin.appspot.com/o/user_charms%2F${value}.png?alt=media&token=swiss%20flag`,
//             prompt: value,
//           };

//           // Update samples state
//           setSamples((prev) => [newSample, ...prev]);

//           // Save to localStorage
//           try {
//             const storageKey = isBirthdayCharmPage
//               ? "birthdayCharmGenerations"
//               : "userGeneratedCharms";
//             const userGenerations = localStorage.getItem(storageKey);
//             const existingUserSamples = userGenerations
//               ? JSON.parse(userGenerations)
//               : [];
//             const updatedUserSamples = [newSample, ...existingUserSamples];
//             localStorage.setItem(
//               storageKey,
//               JSON.stringify(updatedUserSamples),
//             );

//             trackEvent("new_charm_added_to_gallery", {
//               prompt: value,
//             });
//           } catch (e) {
//             console.error("Error saving to localStorage:", e);
//           }
//         } else {
//           trackEvent("charm_regenerated", {
//             prompt: value,
//           });
//         }
//       } catch (e) {
//         const generationTime = Date.now() - startTime;
//         trackEvent("charm_generation_error", {
//           prompt: value,
//           generation_time_ms: generationTime,
//         });
//         setError("Error generating image.");
//       } finally {
//         setLoading(false);
//         setButtonLoading(false);
//         loadingRef.current = false;
//       }
//     };

//     btn.addEventListener("click", handleClick);

//     const swatches = document.querySelectorAll(".ColorSwatch__Radio");
//     const swatchClickHandler = (e) => {
//       let value = e.target.value;
//       if (!value && e.target.dataset && e.target.dataset.value) {
//         value = e.target.dataset.value;
//       }
//       if (!value && e.target.textContent) {
//         value = e.target.textContent;
//       }

//       trackEvent("color_selected", {});

//       setColor(value);
//     };
//     swatches.forEach((swatch) => {
//       swatch.addEventListener("click", swatchClickHandler);
//     });

//     return () => {
//       btn.removeEventListener("click", handleClick);
//       swatches.forEach((swatch) => {
//         swatch.removeEventListener("click", swatchClickHandler);
//       });
//       setButtonLoading(false);
//     };
//   }, [samples, generationCount, sessionId]); // Add all dependencies used in the effect

//   const handleSampleClick = (sample) => {
//     trackEvent("sample_selected", {
//       prompt: sample.prompt,
//     });

//     document.querySelector("#your-image-url").value = sample.url;
//     document.querySelector("#your-charm-prompt").value = sample.prompt;

//     setIsPaused(true); // Pause the auto-rotation
//     setImageUrl(sample.url);
//     // setImageUrl(
//     //   `https://firebasestorage.googleapis.com/v0/b/kutezadmin.appspot.com/o/charms%2F${sample.prompt}.png?alt=media&token=${sample.prompt}`
//     // );
//     const detailInput = document.querySelector(".custom-name-input");
//     if (detailInput) {
//       detailInput.value = sample.prompt; // Set as value instead of placeholder
//     }
//   };

//   return (
//     <div
//       style={{
//         position: "relative",
//         height: "100%",
//         display: "flex",
//         flexDirection: "column",
//       }}
//     >
//       {/* Main Preview Area */}
//       <div
//         style={{
//           position: "relative",
//           flex: "1",
//           minHeight: 0,
//           overflow: "hidden", // Prevent loading overlay from extending beyond
//           aspectRatio: "1.35",
//         }}
//       >
//         {/*
//         <div
//           className={`loading${
//             loading || !imageUrl ? " loading--visible" : ""
//           }`}
//           style={{
//             opacity: loading || !imageUrl ? 1 : 0,
//             pointerEvents: loading || !imageUrl ? "auto" : "none",
//             transition: "opacity 0.7s cubic-bezier(.4,0,.2,1)",
//             zIndex: 1,
//             position: "absolute",
//             top: 0,
//             left: 0,
//             right: 0,
//             bottom: 0,
//             width: "100%",
//             height: "100%",
//             minHeight: "auto",
//             padding: 0,
//           }}
//         ></div>
//         */}
//         <div
//           style={{
//             opacity: loading ? 1 : 0,
//             width: "100%",
//             height: "100%",
//             position: "absolute",
//             transition: "opacity 0.5s ease-in-out",
//             pointerEvents: loading ? "auto" : "none",
//             zIndex: 2,
//           }}
//         >
//           <Aurora
//             colorStops={["#a35784", "#4d776f", "#a35784"]}
//             // colorStops={["#7cff67", "#B19EEF", "#5227FF"]}
//             // colorStops={["#3A29FF", "#FF94B4", "#FF3232"]}
//             // colorStops={["#E6CA97", "#D9D9D9", "#E1A4A9"]}
//             blend={1}
//             // blend={0}
//             amplitude={1.0}
//             // amplitude={1.5}
//             speed={2}
//           />
//         </div>
//         {error && <div style={{ color: "red", padding: "8px" }}>{error}</div>}
//         <img
//           src={imageUrl}
//           alt="Generated"
//           style={{
//             maxWidth: "100%",
//             width: "100%",
//             filter:
//               color == "White"
//                 ? `grayscale(1)`
//                 : color == "Rose"
//                 ? `hue-rotate(336deg) saturate(0.8)`
//                 : "none",
//             objectFit: "cover",
//             position: "absolute",
//             top: "0",
//             height: "100%",
//             objectPosition: "bottom",
//           }}
//         />
//       </div>

//       {/* Sample Gallery */}
//       {samples.length > 0 && (
//         <div
//           style={{
//             padding: "12px 8px",
//             overflowX: "auto",
//             overflowY: "hidden",
//           }}
//         >
//           <div
//             style={{
//               // display: "flex",
//               gap: "8px",
//               // minWidth: "min-content",
//               display: "inline-flex",
//             }}
//           >
//             {samples.map((sample, index) => (
//               <div
//                 key={index}
//                 onClick={() => handleSampleClick(sample)}
//                 style={{
//                   cursor: "pointer",
//                   border:
//                     imageUrl === sample.url
//                       ? "2px solid #000"
//                       : "2px solid transparent",
//                   borderRadius: "6px",
//                   overflow: "hidden",
//                   transition: "all 0.2s ease",
//                   flexShrink: 0,
//                   // minWidth: "60px",
//                   // minHeight: "60px",
//                   width: "60px",
//                   height: "60px",
//                   aspectRatio: 1,
//                   flex: 1,
//                   backgroundColor: "#fff",
//                 }}
//                 onMouseEnter={(e) => {
//                   if (imageUrl !== sample.url) {
//                     e.currentTarget.style.borderColor = "#999";
//                   }
//                 }}
//                 onMouseLeave={(e) => {
//                   if (imageUrl !== sample.url) {
//                     e.currentTarget.style.borderColor = "transparent";
//                   }
//                 }}
//                 title={sample.prompt}
//               >
//                 <img
//                   src={sample.url}
//                   alt={sample.prompt}
//                   style={{
//                     width: "100%",
//                     height: "100%",
//                     objectFit: "cover",
//                     scale: "4",
//                     translate: "0 -75%",
//                   }}
//                 />
//               </div>
//             ))}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

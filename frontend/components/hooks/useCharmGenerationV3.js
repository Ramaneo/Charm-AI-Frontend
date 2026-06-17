import { useEffect, useRef } from "react";
import { createButtonLoadingHandler } from "../utils/buttonLoading";
import { saveSessionData } from "../utils/session";

export function useCharmGenerationV3({
  samples,
  generationCount,
  sessionId,
  setLoading,
  setModelLoading,
  setError,
  setImageUrl,
  setModelImageUrl,
  setIsPaused,
  setGenerationCount,
  setSamples,
  setColor,
  loadingRef,
  generationStartTimeRef,
  trackEvent,
  storageKey,
  transformPrompt = (value) => value,
}) {
  const abortControllerRef = useRef(null);

  useEffect(() => {
    return () => {
      abortControllerRef.current?.abort();
    };
  }, []);

  useEffect(() => {
    const btn = document.querySelector(".generate-btn");
    const input = document.querySelector(".custom-name-input");
    if (!btn || !input) return;

    const setButtonLoading = createButtonLoadingHandler();

    const stopLoadingState = (options = {}) => {
      setLoading(false);
      setModelLoading?.(false);
      setButtonLoading(btn, false, options);
      loadingRef.current = false;
      abortControllerRef.current = null;
    };

    const cancelGeneration = () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };

    const handleClick = async () => {
      if (loadingRef.current) return;
      loadingRef.current = true;
      setLoading(true);
      setButtonLoading(btn, true, { onCancel: cancelGeneration });
      setError("");
      const value = input.value.trim();
      if (!value) {
        stopLoadingState({ immediate: true });
        return;
      }

      const startTime = Date.now();
      generationStartTimeRef.current = startTime;

      const finalPrompt = transformPrompt(value);

      trackEvent("charm_generation_start", {
        prompt: finalPrompt,
      });
      const requestParams = new URLSearchParams({ input: finalPrompt });
      const searchParams = new URLSearchParams(
        typeof window !== "undefined" ? window.location.search : "",
      );
      const debug = searchParams.get("debug");
      const isDebugMode = debug !== null;
      if (debug !== null) {
        requestParams.set("debug", debug);
      }
      // let apiUrl = `https://kutezadmin.uc.r.appspot.com/charm-image-with-model?${requestParams.toString()}`;
      // if (isDebugMode) {
      let apiUrl = `https://kutezadmin.uc.r.appspot.com/charm-image?${requestParams.toString()}`;
      // }

      const abortController = new AbortController();
      abortControllerRef.current = abortController;

      try {
        const res = await fetch(apiUrl, {
          headers: {
            "ngrok-skip-browser-warning": "true",
          },
          signal: abortController.signal,
        });
        const generationTime = Date.now() - startTime;

        if (res.status === 429) {
          trackEvent("generation_rate_limited", {
            prompt: finalPrompt,
            generation_time_ms: generationTime,
          });
          setError(
            "Daily generation limit reached. Please choose from existing prompts in the gallery below or try again tomorrow.",
          );
          stopLoadingState();
          return;
        }
        if (!res.ok) throw new Error("Failed to fetch image");

        const data = await res.json();

        if (!data.success) {
          throw new Error("Generation failed");
        }

        document.querySelector("#your-image-url").value = data.charmImage.url;
        document.querySelector("#your-charm-prompt").value = finalPrompt;

        setImageUrl(`${data.charmImage.url}?v=${Date.now()}`);
        setLoading(false);

        try {
          // setModelLoading?.(true);
          // const modelApiUrl = `https://kutezadmin.uc.r.appspot.com/charm-model-image?${requestParams.toString()}`;
          // const modelRes = await fetch(modelApiUrl, {
          //   method: "POST",
          //   headers: {
          //     "Content-Type": "application/json",
          //     "ngrok-skip-browser-warning": "true",
          //   },
          //   body: JSON.stringify({
          //     charmImageUrl: data.charmImage.url,
          //     input: finalPrompt,
          //   }),
          // });
          // if (modelRes.ok) {
          //   const modelData = await modelRes.json();
          //   if (modelData.success && modelData.modelImage) {
          //     setModelImageUrl(modelData.modelImage.url);
          //     data.modelImage = modelData.modelImage; // For the gallery sample
          //   }
          // }
        } catch (modelErr) {
          console.error("Error fetching model image:", modelErr);
        } finally {
          setModelLoading?.(false);
        }

        setIsPaused(true);

        // const card = document.querySelector(".generate-ai-card");
        // if (card) {
        //   card.style.border = "2px solid rgba(110, 231, 183, 0.50)";
        //   card.style.background = "rgba(236, 253, 245, 0.30)";
        // }

        const status = document.querySelector(".generate-ai-card__status");
        if (status) {
          status.style.display = ""; // Remove the inline display: none
        }

        const newCount = generationCount + 1;
        setGenerationCount(newCount);

        const sessionStorageKey = isDebugMode
          ? `debug${debug}_${sessionId}`
          : sessionId;
        saveSessionData(sessionStorageKey, newCount);

        trackEvent("charm_generation_success", {
          prompt: finalPrompt,
          generation_time_ms: generationTime,
        });

        const promptExists = samples.some(
          (s) => s.prompt.toLowerCase() === finalPrompt.toLowerCase(),
        );
        if (!promptExists) {
          const newSample = {
            url: data.charmImage.url,
            modelUrl: data.modelImage ? data.modelImage.url : null,
            prompt: finalPrompt,
          };

          setSamples((prev) => [newSample, ...prev]);

          try {
            const debugStorageKey = isDebugMode
              ? `debug${debug}_${storageKey}`
              : storageKey;
            const userGenerations = localStorage.getItem(debugStorageKey);
            const existingUserSamples = userGenerations
              ? JSON.parse(userGenerations)
              : [];
            const updatedUserSamples = [newSample, ...existingUserSamples];
            localStorage.setItem(
              debugStorageKey,
              JSON.stringify(updatedUserSamples),
            );

            trackEvent("new_charm_added_to_gallery", {
              prompt: finalPrompt,
            });
          } catch (e) {
            console.error("Error saving to localStorage:", e);
          }
        } else {
          trackEvent("charm_regenerated", {
            prompt: finalPrompt,
          });
        }
      } catch (e) {
        const generationTime = Date.now() - startTime;

        if (e.name === "AbortError") {
          setError("");
          stopLoadingState({ immediate: true });
          return;
        }

        trackEvent("charm_generation_error", {
          prompt: finalPrompt,
          generation_time_ms: generationTime,
        });
        setError("Error generating image.");
      } finally {
        if (abortControllerRef.current === abortController) {
          stopLoadingState();
        }
      }
    };

    const swatchClickHandler = (e) => {
      let value = e.target.value;
      if (!value && e.target.dataset && e.target.dataset.value) {
        value = e.target.dataset.value;
      }
      if (!value && e.target.textContent) {
        value = e.target.textContent;
      }

      trackEvent("color_selected", { color: value });
      setColor(value);
    };

    btn.addEventListener("click", handleClick);

    const swatches = document.querySelectorAll(".ColorSwatch__Radio");
    swatches.forEach((swatch) => {
      swatch.addEventListener("click", swatchClickHandler);
    });

    return () => {
      btn.removeEventListener("click", handleClick);
      swatches.forEach((swatch) => {
        swatch.removeEventListener("click", swatchClickHandler);
      });
    };
  }, [
    samples,
    generationCount,
    sessionId,
    setLoading,
    setModelLoading,
    setError,
    setImageUrl,
    setModelImageUrl,
    setIsPaused,
    setGenerationCount,
    setSamples,
    setColor,
    loadingRef,
    generationStartTimeRef,
    trackEvent,
    storageKey,
    transformPrompt,
  ]);
}

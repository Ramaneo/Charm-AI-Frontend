import { useEffect, useRef } from "react";
import { createButtonLoadingHandler } from "../utils/buttonLoading";
import { saveSessionData } from "../utils/session";

export function useCharmGenerationOld({
  samples,
  generationCount,
  sessionId,
  setLoading,
  setError,
  setImageUrl,
  setIsPaused,
  setGenerationCount,
  setSamples,
  setColor,
  loadingRef,
  generationStartTimeRef,
  trackEvent,
  storageKey,
  transformPrompt = (value) => value, // Optional prompt transformer for birthday charms
}) {
  useEffect(() => {
    const btn = document.querySelector(".generate-btn");
    const input = document.querySelector(".custom-name-input");
    if (!btn || !input) return;

    const setButtonLoading = createButtonLoadingHandler();

    const handleClick = async () => {
      if (loadingRef.current) return;
      loadingRef.current = true;
      setLoading(true);
      setButtonLoading(btn, true);
      setError("");
      const value = input.value.trim();
      if (!value) {
        setLoading(false);
        setButtonLoading(btn, false);
        loadingRef.current = false;
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
      const charmDebug = searchParams.get("charmDebug");
      const isDebugMode = charmDebug !== null;
      if (charmDebug !== null) {
        requestParams.set("charmDebug", charmDebug);
      }
      const apiUrl = `/apps/general/charm-image?${requestParams.toString()}`;

      try {
        const res = await fetch(apiUrl);
        const generationTime = Date.now() - startTime;

        if (res.status === 429) {
          trackEvent("generation_rate_limited", {
            prompt: finalPrompt,
            generation_time_ms: generationTime,
          });
          setError(
            "Daily generation limit reached. Please choose from existing prompts in the gallery below or try again tomorrow.",
          );
          setLoading(false);
          setButtonLoading(btn, false);
          loadingRef.current = false;
          return;
        }
        if (!res.ok) throw new Error("Failed to fetch image");
        const returnedUrl = res.url;
        setImageUrl(returnedUrl);
        setIsPaused(true);

        const newCount = generationCount + 1;
        setGenerationCount(newCount);

        const sessionStorageKey = isDebugMode
          ? `debug_${sessionId}`
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
          const folder = isDebugMode ? "user_charms_debug" : "user_charms";
          const newSample = {
            url: `https://firebasestorage.googleapis.com/v0/b/kutezadmin.appspot.com/o/${folder}%2F${encodeURIComponent(
              finalPrompt,
            )}.png?alt=media&token=${encodeURIComponent(finalPrompt)}`,
            prompt: finalPrompt,
          };

          setSamples((prev) => [newSample, ...prev]);

          try {
            const debugStorageKey = isDebugMode
              ? `debug_${storageKey}`
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
        trackEvent("charm_generation_error", {
          prompt: finalPrompt,
          generation_time_ms: generationTime,
        });
        setError("Error generating image.");
      } finally {
        setLoading(false);
        setButtonLoading(btn, false);
        loadingRef.current = false;
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
    setError,
    setImageUrl,
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

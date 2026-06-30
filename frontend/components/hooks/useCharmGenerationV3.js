import { useEffect, useRef } from "react";
import { createButtonLoadingHandler } from "../utils/buttonLoading";
import { saveSessionData } from "../utils/session";

const HISTORY_DISPLAY_LIMIT = 8;

function getDebugStorageKey(storageKey) {
  const searchParams = new URLSearchParams(
    typeof window !== "undefined" ? window.location.search : "",
  );
  const debug = searchParams.get("debug");
  return debug !== null ? `debug${debug}_${storageKey}` : storageKey;
}

function selectHistorySample(sample) {
  const input = document.querySelector(".custom-name-input");
  const btn = document.querySelector(".generate-btn");
  if (!input || !btn) return;

  input.value = sample.prompt;
  input.dispatchEvent(new Event("input", { bubbles: true }));
  btn.click();
}

function renderHistoryItem(sample) {
  const item = document.createElement("button");
  item.type = "button";
  item.className = "generate-ai-history__item";
  item.addEventListener("click", () => selectHistorySample(sample));

  const img = document.createElement("img");
  img.src = sample.url;
  img.alt = sample.prompt;
  img.className = "generate-ai-history__thumb";

  const promptLabel = document.createElement("span");
  promptLabel.className = "generate-ai-history__prompt";
  promptLabel.textContent = sample.prompt;

  item.appendChild(img);
  item.appendChild(promptLabel);
  return item;
}

function renderHistoryList(historySamples) {
  const list = document.querySelector("#charm-history-list");
  const box = document.querySelector("#charm-history-box");
  if (!list || !box) return;

  list.innerHTML = "";
  const visibleSamples = historySamples.slice(0, HISTORY_DISPLAY_LIMIT);
  visibleSamples.forEach((sample) => {
    list.appendChild(renderHistoryItem(sample));
  });

  box.style.display = visibleSamples.length > 0 ? "" : "none";
}

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
  setGeneratedPrompt,
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
    try {
      const debugStorageKey = getDebugStorageKey(storageKey);
      const userGenerations = localStorage.getItem(debugStorageKey);
      const historySamples = userGenerations ? JSON.parse(userGenerations) : [];
      renderHistoryList(historySamples);
    } catch (e) {
      console.error("Error loading charm history:", e);
    }
  }, [storageKey]);

  useEffect(() => {
    const btn = document.querySelector(".generate-btn");
    const input = document.querySelector(".custom-name-input");
    if (!btn || !input) return;

    const setButtonLoading = createButtonLoadingHandler();

    const stopLoadingState = (options = {}) => {
      setLoading(false);
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
      setGeneratedPrompt?.("");
      const value = input.value.trim();
      setButtonLoading(btn, true, {
        onCancel: cancelGeneration,
        prompt: value,
      });
      setError("");
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
      let apiUrl = `/apps/general/charm-image?${requestParams.toString()}`;
      // let apiUrl = `https://renart-storefronts.uc.r.appspot.com/charm-image?${requestParams.toString()}`;
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
        setGeneratedPrompt?.(finalPrompt);
        setLoading(false);

        // Fetch the model image in the background; don't block the rest
        // of the generation success flow on it.
        setModelLoading?.(true);
        const modelApiUrl = `/apps/general/charm-model-image?${requestParams.toString()}`;
        fetch(modelApiUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "ngrok-skip-browser-warning": "true",
          },
          body: JSON.stringify({
            charmImageUrl: data.charmImage.url,
            input: finalPrompt,
          }),
        })
          .then((modelRes) => (modelRes.ok ? modelRes.json() : null))
          .then((modelData) => {
            if (modelData?.success && modelData.modelImage) {
              setModelImageUrl(modelData.modelImage.url);
            }
          })
          .catch((modelErr) => {
            console.error("Error fetching model image:", modelErr);
          })
          .finally(() => {
            setModelLoading?.(false);
          });

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

        const newSample = {
          url: data.charmImage.url,
          modelUrl: data.modelImage ? data.modelImage.url : null,
          prompt: finalPrompt,
        };

        const promptExists = samples.some(
          (s) => s.prompt.toLowerCase() === finalPrompt.toLowerCase(),
        );
        if (!promptExists) {
          setSamples((prev) => [newSample, ...prev]);
          trackEvent("new_charm_added_to_gallery", {
            prompt: finalPrompt,
          });
        } else {
          trackEvent("charm_regenerated", {
            prompt: finalPrompt,
          });
        }

        try {
          const debugStorageKey = isDebugMode
            ? `debug${debug}_${storageKey}`
            : storageKey;
          const userGenerations = localStorage.getItem(debugStorageKey);
          const existingUserSamples = userGenerations
            ? JSON.parse(userGenerations)
            : [];
          const dedupedUserSamples = existingUserSamples.filter(
            (s) => s.prompt.toLowerCase() !== finalPrompt.toLowerCase(),
          );
          const updatedUserSamples = [newSample, ...dedupedUserSamples];
          localStorage.setItem(
            debugStorageKey,
            JSON.stringify(updatedUserSamples),
          );
          renderHistoryList(updatedUserSamples);
        } catch (e) {
          console.error("Error saving to localStorage:", e);
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
    setGeneratedPrompt,
    loadingRef,
    generationStartTimeRef,
    trackEvent,
    storageKey,
    transformPrompt,
  ]);
}

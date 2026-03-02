import React, { useState, useEffect, useRef } from "react";
import "./App.css";
import CharmPreviewOld from "./CharmPreviewOld.jsx";
import CharmPreview from "./CharmPreview.jsx";
import SampleGallery from "./SampleGallery.jsx";
import { createTrackEvent } from "./utils/analytics.js";
import { initializeSession, loadSessionData } from "./utils/session.js";
import { useCharmGenerationOld } from "./hooks/useCharmGenerationOld.js";
import { useCharmGeneration } from "./hooks/useCharmGeneration.js";
import {
  REGULAR_CHARM_SAMPLES,
  STORAGE_KEYS,
  BLUEPRINT_URL,
} from "./utils/constants.js";

export default function RegularCharmApp() {
  const searchParams = new URLSearchParams(
    typeof window !== "undefined" ? window.location.search : "",
  );
  const isDebugMode = searchParams.has("charmDebug");

  const [imageUrl, setImageUrl] = useState(BLUEPRINT_URL);
  const [modelImageUrl, setModelImageUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [color, setColor] = useState("");
  const loadingRef = useRef(false);
  const [samples, setSamples] = useState([]);
  const [isPaused, setIsPaused] = useState(false);

  const [sessionId, setSessionId] = useState("");
  const [generationCount, setGenerationCount] = useState(0);
  const generationStartTimeRef = useRef(null);

  const trackEvent = createTrackEvent(sessionId, generationCount);

  // Initialize session
  useEffect(() => {
    const sid = initializeSession();
    setSessionId(sid);
    const data = loadSessionData(sid);
    if (data) {
      setGenerationCount(data.generationCount || 0);
    }
  }, []);

  useEffect(() => {
    if (loading) {
      setIsPaused(true);
    }
  }, [loading]);

  // Load samples
  useEffect(() => {
    const loadSamples = () => {
      try {
        const storageKey = isDebugMode
          ? `debug_${STORAGE_KEYS.REGULAR}`
          : STORAGE_KEYS.REGULAR;

        const userGenerations = localStorage.getItem(storageKey);
        const userSamples = userGenerations ? JSON.parse(userGenerations) : [];
        setSamples([...userSamples, ...REGULAR_CHARM_SAMPLES]);

        if (sessionId) {
          trackEvent("gallery_loaded", {});
        }
      } catch (e) {
        console.error("Error loading user samples:", e);
        setSamples(REGULAR_CHARM_SAMPLES);
      }
    };
    loadSamples();
  }, [sessionId, isDebugMode]);

  // Set initial model image in debug mode
  useEffect(() => {
    if (samples.length > 0 && !modelImageUrl) {
      // Find the first sample with a modelUrl
      const sampleWithModel = samples.find((s) => s.modelUrl);
      if (sampleWithModel) {
        setModelImageUrl(
          "https://cdn.shopify.com/s/files/1/0484/1429/4167/files/bee.png?v=1772190426",
        );
      }
    }
  }, [samples, modelImageUrl]);

  // Carousel animation
  useEffect(() => {
    const detailInput = document.querySelector(".custom-name-input");
    if (samples.length === 0 || isPaused) return;

    const sampleUrls = samples.map((s) => s.url);
    let interval;
    if (imageUrl === BLUEPRINT_URL || sampleUrls.includes(imageUrl)) {
      interval = setInterval(() => {
        let next;
        do {
          next = samples[Math.floor(Math.random() * samples.length)];
        } while (next.url === imageUrl && samples.length > 1);
        if (detailInput) detailInput.placeholder = next.prompt;
        setImageUrl(next.url);
        // if (isDebugMode && next.modelUrl) {
        //   setModelImageUrl(next.modelUrl);
        // }
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [imageUrl, samples, isPaused, isDebugMode]);

  // Use the charm generation hook
  if (isDebugMode) {
    useCharmGenerationOld({
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
      storageKey: STORAGE_KEYS.REGULAR,
    });
  } else {
    useCharmGeneration({
      samples,
      generationCount,
      sessionId,
      setLoading,
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
      storageKey: STORAGE_KEYS.REGULAR,
    });
  }

  // Sample click handler
  const handleSampleClick = (sample) => {
    if (loadingRef.current) return;
    setImageUrl(sample.url);
    if (sample.modelUrl && isDebugMode) {
      // setModelImageUrl(sample.modelUrl);
    } else {
      // setModelImageUrl("");
    }
    setIsPaused(true);
    const input = document.querySelector(".custom-name-input");
    if (input) input.value = sample.prompt;

    const imageUrlInput = document.querySelector("#your-image-url");
    const promptInput = document.querySelector("#your-charm-prompt");
    if (imageUrlInput) imageUrlInput.value = sample.url;
    if (promptInput) promptInput.value = sample.prompt;

    trackEvent("sample_selected", {
      prompt: sample.prompt,
      sample_type: "preselected",
    });
  };

  return (
    <div style={{ width: "100%" }}>
      {isDebugMode ? (
        <CharmPreviewOld
          imageUrl={imageUrl}
          loading={loading}
          error={error}
          color={color}
        />
      ) : (
        <CharmPreview
          imageUrl={imageUrl}
          modelImageUrl={modelImageUrl}
          loading={loading}
          error={error}
          color={color}
        />
      )}
      <SampleGallery
        samples={samples}
        imageUrl={imageUrl}
        onSampleClick={handleSampleClick}
      />
    </div>
  );
}

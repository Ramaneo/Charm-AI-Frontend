import React, { useState, useEffect, useRef } from "react";
import "./App.css";
import CharmPreview from "./CharmPreview.jsx";
import SampleGallery from "./SampleGallery.jsx";
import { createTrackEvent } from "./utils/analytics.js";
import { initializeSession, loadSessionData } from "./utils/session.js";
import { usePetCharmGeneration } from "./hooks/usePetCharmGeneration.js";
import {
  PET_CHARM_SAMPLES,
  STORAGE_KEYS,
  BLUEPRINT_URL,
} from "./utils/constants.js";

export default function PetCharmApp() {
  const [imageUrl, setImageUrl] = useState(BLUEPRINT_URL);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [color, setColor] = useState("");
  const loadingRef = useRef(false);
  const [samples, setSamples] = useState([]);
  const [isPaused, setIsPaused] = useState(false);

  const [sessionId, setSessionId] = useState("");
  const [generationCount, setGenerationCount] = useState(0);
  const generationStartTimeRef = useRef(null);
  const lastPromptRef = useRef("");

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
        const userGenerations = localStorage.getItem(STORAGE_KEYS.PET);
        const userSamples = userGenerations ? JSON.parse(userGenerations) : [];
        setSamples([...userSamples, ...PET_CHARM_SAMPLES]);

        if (sessionId) {
          trackEvent("gallery_loaded", {});
        }
      } catch (e) {
        console.error("Error loading user samples:", e);
        setSamples(PET_CHARM_SAMPLES);
      }
    };
    loadSamples();
  }, [sessionId]);

  // Carousel animation
  useEffect(() => {
    if (samples.length === 0 || isPaused) return;

    const sampleUrls = samples.map((s) => s.url);
    let interval;
    if (imageUrl === BLUEPRINT_URL || sampleUrls.includes(imageUrl)) {
      interval = setInterval(() => {
        let next;
        do {
          next = samples[Math.floor(Math.random() * samples.length)];
        } while (next.url === imageUrl && samples.length > 1);

        setImageUrl(next.url);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [imageUrl, samples, isPaused]);

  // Use the pet charm generation hook with image upload
  usePetCharmGeneration({
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
    storageKey: STORAGE_KEYS.PET,
  });

  // Sample click handler
  const handleSampleClick = (sample) => {
    if (loadingRef.current) return;
    setImageUrl(sample.url);
    setIsPaused(true);

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
      <CharmPreview
        imageUrl={imageUrl}
        loading={loading}
        error={error}
        color={color}
      />
      <SampleGallery
        samples={samples}
        imageUrl={imageUrl}
        onSampleClick={handleSampleClick}
      />
    </div>
  );
}

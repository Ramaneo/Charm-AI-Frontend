import React, { useState, useEffect, useRef } from "react";
import "./App.css";
import CharmPreview from "./CharmPreview.jsx";
import SampleGallery from "./SampleGallery.jsx";
import { createTrackEvent } from "./utils/analytics.js";
import { initializeSession, loadSessionData } from "./utils/session.js";
import { useCharmGeneration } from "./hooks/useCharmGeneration.js";
import {
  BIRTHDAY_CHARM_SAMPLES,
  STORAGE_KEYS,
  BLUEPRINT_URL,
  BIRTHDAY_SUFFIXES,
} from "./utils/constants.js";

export default function BirthdayCharmApp() {
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

  // Birthday prompt transformer
  const transformPrompt = (value) => {
    let currentSuffixIndex = 0;
    if (lastPromptRef.current === value) {
      currentSuffixIndex = generationCount % BIRTHDAY_SUFFIXES.length;
    } else {
      lastPromptRef.current = value;
      currentSuffixIndex = 0;
    }
    return `${value} ${BIRTHDAY_SUFFIXES[currentSuffixIndex]}`;
  };

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
        const userGenerations = localStorage.getItem(STORAGE_KEYS.BIRTHDAY);
        const userSamples = userGenerations ? JSON.parse(userGenerations) : [];
        setSamples([...userSamples, ...BIRTHDAY_CHARM_SAMPLES]);

        if (sessionId) {
          trackEvent("gallery_loaded", {});
        }
      } catch (e) {
        console.error("Error loading user samples:", e);
        setSamples(BIRTHDAY_CHARM_SAMPLES);
      }
    };
    loadSamples();
  }, [sessionId]);

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
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [imageUrl, samples, isPaused]);

  // Use the charm generation hook with birthday prompt transformer
  useCharmGeneration({
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
    storageKey: STORAGE_KEYS.BIRTHDAY,
    transformPrompt,
  });

  // Sample click handler
  const handleSampleClick = (sample) => {
    if (loadingRef.current) return;
    setImageUrl(sample.url);
    setIsPaused(true);
    const input = document.querySelector(".custom-name-input");
    let extractedDate = sample.prompt;
    if (input) {
      // Extract date from prompt (format: "2020-02-02 birthday energy")
      const dateMatch = sample.prompt.match(/^\d{4}-\d{2}-\d{2}/);
      if (dateMatch) {
        input.value = dateMatch[0];
        extractedDate = dateMatch[0];
      } else {
        input.placeholder = sample.prompt;
      }
    }

    const imageUrlInput = document.querySelector("#your-image-url");
    const promptInput = document.querySelector("#your-charm-prompt");
    if (imageUrlInput) imageUrlInput.value = sample.url;
    if (promptInput) promptInput.value = extractedDate;

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

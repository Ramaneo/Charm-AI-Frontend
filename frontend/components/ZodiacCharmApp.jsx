import React, { useState, useEffect, useRef } from "react";
import "./App.css";
import CharmPreview from "./CharmPreview.jsx";
import SampleGallery from "./SampleGallery.jsx";
import { createTrackEvent } from "./utils/analytics.js";
import { initializeSession, loadSessionData } from "./utils/session.js";
import { useCharmGeneration } from "./hooks/useCharmGeneration.js";
import {
  ZODIAC_CHARM_SAMPLES,
  STORAGE_KEYS,
  BLUEPRINT_URL,
  ZODIAC_SUFFIXES,
} from "./utils/constants.js";

export default function ZodiacCharmApp() {
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

  // Zodiac prompt transformer
  const transformPrompt = (value) => {
    let currentSuffixIndex = 0;
    if (lastPromptRef.current === value) {
      currentSuffixIndex = generationCount % ZODIAC_SUFFIXES.length;
    } else {
      lastPromptRef.current = value;
      currentSuffixIndex = 0;
    }

    // Get zodiac sign and rising sign from inputs
    const zodiacInput = document.querySelector("#zodiac-sign");
    const risingInput = document.querySelector("#rising-zodiac-sign");
    const zodiacSign = zodiacInput?.value?.trim() || "";
    const risingSign = risingInput?.value?.trim() || "";

    if (!zodiacSign && !risingSign) return "";

    let prompt = "";
    if (zodiacSign) {
      prompt += `${zodiacSign} zodiac`;
    }
    if (risingSign) {
      prompt += ` ${risingSign} rising zodiac`;
    }
    prompt += ` ${ZODIAC_SUFFIXES[currentSuffixIndex]}`;

    return prompt.trim();
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
        const userGenerations = localStorage.getItem(STORAGE_KEYS.ZODIAC);
        const userSamples = userGenerations ? JSON.parse(userGenerations) : [];
        setSamples([...userSamples, ...ZODIAC_CHARM_SAMPLES]);

        if (sessionId) {
          trackEvent("gallery_loaded", {});
        }
      } catch (e) {
        console.error("Error loading user samples:", e);
        setSamples(ZODIAC_CHARM_SAMPLES);
      }
    };
    loadSamples();
  }, [sessionId]);

  // Carousel animation
  useEffect(() => {
    const zodiacInput = document.querySelector("#zodiac-sign");
    const risingInput = document.querySelector("#rising-zodiac-sign");
    if (samples.length === 0 || isPaused) return;

    const sampleUrls = samples.map((s) => s.url);
    let interval;
    if (imageUrl === BLUEPRINT_URL || sampleUrls.includes(imageUrl)) {
      interval = setInterval(() => {
        let next;
        do {
          next = samples[Math.floor(Math.random() * samples.length)];
        } while (next.url === imageUrl && samples.length > 1);

        // Extract zodiac signs from prompt and set placeholders
        const zodiacMatch = next.prompt.match(
          /^(.+?)\s+zodiac(?:\s+(.+?)\s+rising\s+zodiac)?/,
        );
        if (zodiacMatch) {
          if (zodiacInput && zodiacMatch[1]) {
            zodiacInput.placeholder = zodiacMatch[1].trim();
          }
          if (risingInput && zodiacMatch[2]) {
            risingInput.placeholder = zodiacMatch[2].trim();
          }
        }

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
    storageKey: STORAGE_KEYS.ZODIAC,
    transformPrompt,
  });

  // Sample click handler
  const handleSampleClick = (sample) => {
    if (loadingRef.current) return;
    setImageUrl(sample.url);
    setIsPaused(true);

    // Extract zodiac signs from prompt (format: "leo zodiac virgo rising zodiac aura")
    const zodiacMatch = sample.prompt.match(
      /^(.+?)\s+zodiac(?:\s+(.+?)\s+rising\s+zodiac)?/,
    );

    const zodiacInput = document.querySelector("#zodiac-sign");
    const risingInput = document.querySelector("#rising-zodiac-sign");

    if (zodiacMatch) {
      if (zodiacInput && zodiacMatch[1]) {
        zodiacInput.value = zodiacMatch[1].trim();
      }
      if (risingInput && zodiacMatch[2]) {
        risingInput.value = zodiacMatch[2].trim();
      }
    } else {
      // Fallback: use the entire prompt as placeholder
      if (zodiacInput) zodiacInput.placeholder = sample.prompt;
    }

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

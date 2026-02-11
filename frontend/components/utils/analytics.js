// Analytics Helper Function (GTM version)
export const createTrackEvent = (sessionId, generationCount) => {
  return (eventName, eventParams = {}) => {
    try {
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({
        event: eventName,
        ...eventParams,
        session_id: sessionId,
        total_generations: generationCount,
        timestamp: new Date().toISOString(),
      });

      if (window.location.hostname === "localhost") {
        console.log("📊 Analytics Event:", eventName, eventParams);
      }
    } catch (e) {
      console.error("Analytics tracking error:", e);
    }
  };
};

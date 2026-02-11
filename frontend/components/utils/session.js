// Session management utilities
export const initializeSession = () => {
  let sid = localStorage.getItem("charm_session_id");
  let sessionStart = localStorage.getItem("charm_session_start");
  const now = Date.now();

  if (!sid || !sessionStart || now - parseInt(sessionStart) > 30 * 60 * 1000) {
    sid = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    localStorage.setItem("charm_session_id", sid);
    localStorage.setItem("charm_session_start", now.toString());

    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: "session_start",
      session_id: sid,
      page_location: window.location.href,
    });
  }

  return sid;
};

export const loadSessionData = (sid) => {
  const sessionData = localStorage.getItem(`charm_session_data_${sid}`);
  if (sessionData) {
    try {
      const data = JSON.parse(sessionData);
      return data.generationCount || 0;
    } catch (e) {
      console.error("Error loading session data:", e);
      return 0;
    }
  }
  return 0;
};

export const saveSessionData = (sid, generationCount) => {
  try {
    const sessionData = {
      generationCount,
      lastGeneration: Date.now(),
    };
    localStorage.setItem(
      `charm_session_data_${sid}`,
      JSON.stringify(sessionData),
    );
  } catch (e) {
    console.error("Error saving session data:", e);
  }
};

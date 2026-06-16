// Button loading state management
export const createButtonLoadingHandler = () => {
  const estimatedDurationMs = 20000;
  const progressLabel = "Creating something new...";
  const quickFinishDurationMs = 240;
  const estimatedCompletionPercent = 95;
  const maxPendingPercent = 99;

  let progressShell = null;
  let progressContainer = null;
  let progressFill = null;
  let progressPercent = null;
  let cancelButton = null;
  let cancelAction = null;
  let progressInterval = null;
  let finishTimeout = null;
  let progressStartTime = null;
  let originalSpan = null;
  let originalSvg = null;

  const handleCancelClick = (event) => {
    event.preventDefault();
    event.stopPropagation();

    if (typeof cancelAction === "function") {
      cancelAction();
    }
  };

  const handleCancelKeyDown = (event) => {
    if (event.key !== "Enter" && event.key !== " ") return;

    handleCancelClick(event);
  };

  const clearProgressInterval = () => {
    if (progressInterval) {
      window.clearInterval(progressInterval);
      progressInterval = null;
    }
  };

  const clearFinishTimeout = () => {
    if (finishTimeout) {
      window.clearTimeout(finishTimeout);
      finishTimeout = null;
    }
  };

  const resetButton = () => {
    if (originalSpan) originalSpan.style.display = "";
    if (originalSvg) originalSvg.style.display = "";
    clearProgressInterval();
    clearFinishTimeout();
    progressStartTime = null;
    cancelAction = null;
    if (cancelButton) {
      cancelButton.removeEventListener("click", handleCancelClick);
      cancelButton.removeEventListener("keydown", handleCancelKeyDown);
    }
    if (progressShell && progressShell.parentNode) {
      progressShell.parentNode.removeChild(progressShell);
    }
    progressShell = null;
    progressContainer = null;
    progressFill = null;
    progressPercent = null;
    cancelButton = null;
  };

  const updateProgress = () => {
    if (!progressFill || !progressPercent || !progressStartTime) return;

    const elapsedMs = Date.now() - progressStartTime;
    let progressValue;

    if (elapsedMs <= estimatedDurationMs) {
      const progressRatio = elapsedMs / estimatedDurationMs;
      progressValue = Math.round(progressRatio * estimatedCompletionPercent);
    } else {
      const overtimeMs = elapsedMs - estimatedDurationMs;
      const overtimeRatio = 1 - Math.exp(-overtimeMs / estimatedDurationMs);
      progressValue = Math.round(
        estimatedCompletionPercent +
          overtimeRatio * (maxPendingPercent - estimatedCompletionPercent),
      );
    }

    progressValue = Math.min(progressValue, maxPendingPercent);

    progressFill.style.width = `${progressValue}%`;
    progressFill.setAttribute("aria-valuenow", String(progressValue));
    progressPercent.textContent = `${progressValue}%`;
  };

  return (btn, isLoading, options = {}) => {
    if (!btn) return;
    if (!originalSpan) originalSpan = btn.querySelector("span");
    if (!originalSvg) originalSvg = btn.querySelector("svg");

    if (isLoading) {
      const { onCancel } = options;

      clearFinishTimeout();
      if (originalSpan) originalSpan.style.display = "none";
      if (originalSvg) originalSvg.style.display = "none";
      if (!progressShell) {
        progressShell = document.createElement("span");
        progressShell.className = "copilot-progress-shell";

        progressContainer = document.createElement("span");
        progressContainer.className = "copilot-progress";

        const progressTextRow = document.createElement("span");
        progressTextRow.className = "copilot-progress__text-row";

        const progressText = document.createElement("span");
        progressText.className = "copilot-progress__text";
        progressText.textContent = progressLabel;

        progressPercent = document.createElement("span");
        progressPercent.className = "copilot-progress__percent";

        const progressTrack = document.createElement("span");
        progressTrack.className = "copilot-progress__track";

        progressFill = document.createElement("span");
        progressFill.className = "copilot-progress__fill";
        progressFill.setAttribute("role", "progressbar");
        progressFill.setAttribute("aria-valuemin", "0");
        progressFill.setAttribute("aria-valuemax", "100");

        progressTrack.appendChild(progressFill);
        progressTextRow.append(progressText, progressPercent);
        progressContainer.append(progressTextRow, progressTrack);
        progressShell.appendChild(progressContainer);
        btn.appendChild(progressShell);
      }

      if (typeof onCancel === "function") {
        cancelAction = onCancel;

        if (!cancelButton) {
          cancelButton = document.createElement("span");
          cancelButton.className = "copilot-progress__cancel";
          cancelButton.setAttribute("role", "button");
          cancelButton.setAttribute("tabindex", "0");
          cancelButton.setAttribute("aria-label", "Cancel generation");
          cancelButton.textContent = "×";
          cancelButton.addEventListener("click", handleCancelClick);
          cancelButton.addEventListener("keydown", handleCancelKeyDown);
          progressShell.appendChild(cancelButton);
        }
      }

      progressStartTime = Date.now();
      updateProgress();
      clearProgressInterval();
      progressInterval = window.setInterval(updateProgress, 200);
    } else {
      const { immediate = false } = options;

      clearProgressInterval();
      if (immediate) {
        resetButton();
        return;
      }

      if (progressFill && progressPercent) {
        progressFill.style.width = "100%";
        progressFill.setAttribute("aria-valuenow", "100");
        progressPercent.textContent = "100%";
        clearFinishTimeout();
        finishTimeout = window.setTimeout(resetButton, quickFinishDurationMs);
        return;
      }

      resetButton();
    }
  };
};

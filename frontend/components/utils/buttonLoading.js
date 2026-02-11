// Button loading state management
export const createButtonLoadingHandler = () => {
  let spinner = null;
  let originalSpan = null;
  let originalSvg = null;

  return (btn, isLoading) => {
    if (!btn) return;
    if (!originalSpan) originalSpan = btn.querySelector("span");
    if (!originalSvg) originalSvg = btn.querySelector("svg");

    if (isLoading) {
      if (originalSpan) originalSpan.style.display = "none";
      if (originalSvg) originalSvg.style.display = "none";
      if (!spinner) {
        spinner = document.createElement("span");
        spinner.className = "copilot-spinner";
        spinner.style.marginRight = "8px";
        spinner.innerHTML = `<span class="copilot-spinner__circle"></span>`;
        btn.insertBefore(spinner, btn.firstChild);
      }
      let genText = btn.querySelector(".copilot-generating-text");
      if (!genText) {
        genText = document.createElement("span");
        genText.className = "copilot-generating-text";
        genText.style.alignSelf = "center";
        genText.style.fontSize = "11px";
        genText.style.letterSpacing = ".2em";
        genText.style.textTransform = "uppercase";
        genText.textContent = "Generating...";
        btn.appendChild(genText);
      }
    } else {
      if (originalSpan) originalSpan.style.display = "";
      if (originalSvg) originalSvg.style.display = "";
      if (spinner && spinner.parentNode)
        spinner.parentNode.removeChild(spinner);
      spinner = null;
      let genText = btn.querySelector(".copilot-generating-text");
      if (genText && genText.parentNode)
        genText.parentNode.removeChild(genText);
    }
  };
};

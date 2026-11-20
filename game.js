"use strict";
const screenNumber = Number(document.body.dataset.screen);
const params = new URLSearchParams(location.search);
const team = params.get("team") || "";
const run = params.get("run") || "";
const validRun = /^[1-6]$/.test(team) && /^[a-z0-9-]{8,60}$/.test(run);
const storageKey = "aster:" + team + ":" + run;
const get = (id) => document.getElementById(id);
const progress = () => Number(sessionStorage.getItem(storageKey) || 0);
const page = (filename, choice) => {
  const query = new URLSearchParams({ team, run });
  if (choice) query.set("choice", choice);
  return filename + "?" + query;
};

function unlock(answer, focus) {
  get("answer-form").hidden = true;
  get("answer-display").textContent = answer;
  get("reveal").hidden = false;
  document.body.dataset.unlocked = "true";
  window.drawScene(screenNumber, true);
  if (focus) get("unlock-status").focus();
}

function startStage() {
  const expected = window.ASTER_ANSWERS[team][screenNumber - 1];
  if (screenNumber < 5) get("next").href = page("stage-" + (screenNumber + 1) + ".html");
  else {
    get("continue").href = page("ending.html", "continue");
    get("reset").href = page("ending.html", "reset");
  }
  if (progress() >= screenNumber) unlock(expected, false);
  get("answer-form").addEventListener("submit", (event) => {
    event.preventDefault();
    const input = get("answer");
    if (input.value.trim().toUpperCase() !== expected.trim().toUpperCase()) {
      input.setAttribute("aria-invalid", "true");
      get("feedback").textContent = "Entry rejected. Check your evidence and try again.";
      input.focus();
      input.select();
      return;
    }
    sessionStorage.setItem(storageKey, String(Math.max(progress(), screenNumber)));
    unlock(expected, true);
  });
  get("answer").addEventListener("input", () => {
    get("answer").removeAttribute("aria-invalid");
    get("feedback").textContent = "";
  });
}

function startEnding(choice) {
  get(choice + "-ending").hidden = false;
  if (choice === "continue") return;
  const messageKey = storageKey + ":message";
  const showReset = (saved) => {
    get("message-form").hidden = true;
    get("message-result").hidden = !saved;
    get("reset-story").hidden = false;
  };
  const previous = sessionStorage.getItem(messageKey);
  if (previous !== null) showReset(Boolean(previous));
  get("message-form").addEventListener("submit", (event) => {
    event.preventDefault();
    const message = event.submitter?.value === "skip" ? "" : get("message").value.trim();
    sessionStorage.setItem(messageKey, message);
    showReset(Boolean(message));
    get("reset-story").focus();
  });
}

function init() {
  const choice = params.get("choice");
  window.drawScene(screenNumber, false, choice);
  if (screenNumber === 0) {
    for (const button of document.querySelectorAll("[data-team]")) {
      button.addEventListener("click", () => {
        const runId = Date.now().toString(36) + "-" + Math.random().toString(36).slice(2);
        const query = new URLSearchParams({ team: button.dataset.team, run: runId });
        location.href = "stage-1.html?" + query;
      });
    }
    return;
  }
  if (!validRun || progress() < screenNumber - 1 ||
      (screenNumber === 6 && !["continue", "reset"].includes(choice))) {
    location.replace("index.html");
    return;
  }
  get("team").textContent = "Team " + team;
  if (screenNumber === 6) startEnding(choice);
  else startStage();
}
init();

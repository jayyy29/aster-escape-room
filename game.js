"use strict";

const screen = Number(document.body.dataset.screen);
const get = (id) => document.getElementById(id);
const pages = ["intro", "stage1", "stage2", "stage3", "stage4", "stage5", "ending"];
const hostedFiles = ["index.html", ...pages.slice(1, 6).map((_, i) => "stage-" + (i + 1) + ".html"), "ending.html"];
const siteUrls = pages.map((name) => window.ASTER_GOOGLE_SITES?.[name]);
const googleMode = siteUrls.every((url) => /^https:\/\//i.test(url));
const storageKey = "aster-mission-v2:" + new URL(".", location.href).pathname;

function readMission() {
  const raw = localStorage.getItem(storageKey);
  if (!raw) return null;
  let saved;
  try {
    saved = JSON.parse(raw);
  } catch {
    return null;
  }
  if (!saved || !Number.isInteger(saved.team) || saved.team < 1 || saved.team > 6 ||
      !Number.isInteger(saved.cleared) || saved.cleared < 0 || saved.cleared > 5) return null;
  return saved;
}

function setLink(link, number) {
  // The Google Sites sandbox permits navigation within this frame.
  // Station QR codes independently open the published Google Sites pages.
  link.href = hostedFiles[number];
  link.target = "_self";
}

function connect(id, number) {
  setLink(get(id), number);
}

function showGate(title, explanation, destination, label) {
  const gate = get("gate");
  get("mission-content").hidden = true;
  get("gate-title").textContent = title;
  get("gate-detail").textContent = explanation;
  if (destination !== null) {
    connect("gate-link", destination);
    get("gate-link").textContent = label;
    get("gate-link").hidden = false;
  }
  gate.hidden = false;
}

function saveMission(saved) {
  try {
    localStorage.setItem(storageKey, JSON.stringify(saved));
    return true;
  } catch {
    showGate("Progress could not be saved", "Allow this browser to save site data, then reopen the introduction.", 0, "Go to introduction");
    return false;
  }
}

function startIntro(mission) {
  if (mission) {
    const resumeScreen = mission.choice ? 6 : Math.min(mission.cleared + 1, 5);
    connect("resume", resumeScreen);
    get("resume").textContent = "Resume Team " + mission.team;
    get("resume").hidden = false;
    get("restart-note").hidden = false;
  }
  const confirmation = get("restart-dialog");
  let pendingTeam;
  function launch(team, destination) {
    if (saveMission({ team, cleared: 0 })) location.assign(destination);
  }
  for (const link of document.querySelectorAll("[data-team]")) {
    setLink(link, 1);
    link.addEventListener("click", (event) => {
      event.preventDefault();
      const team = Number(link.dataset.team);
      const active = readMission();
      if (active) {
        pendingTeam = { team, destination: link.href };
        get("restart-question").textContent =
          "Start over with Team " + team + "? This replaces Team " + active.team + "’s saved progress in this browser.";
        confirmation.showModal();
        return;
      }
      launch(team, link.href);
    });
  }
  get("restart-confirm").addEventListener("click", () => {
    const { team, destination } = pendingTeam;
    confirmation.close();
    launch(team, destination);
  });
}

function unlock(expected, focus) {
  get("answer-form").hidden = true;
  get("answer-display").textContent = expected;
  get("reveal").hidden = false;
  document.body.dataset.unlocked = "true";
  window.drawScene(screen, true);
  if (focus) get("unlock-status").focus();
}

function startStage(mission) {
  const expected = window.ASTER_ANSWERS[mission.team][screen - 1];
  if (screen < 5) {
    connect("next", screen + 1);
    get("next").hidden = googleMode;
    get("scan-next").hidden = !googleMode;
  } else {
    for (const choice of ["continue", "reset"]) {
      connect(choice, 6);
      get(choice).addEventListener("click", (event) => {
        const active = readMission();
        if (!active || active.team !== mission.team || active.cleared < 5) {
          event.preventDefault();
          location.reload();
          return;
        }
        if (!saveMission({ team: active.team, cleared: active.cleared, choice })) event.preventDefault();
      });
    }
  }
  if (mission.cleared >= screen) unlock(expected, false);
  get("answer-form").addEventListener("submit", (event) => {
    event.preventDefault();
    const active = readMission();
    if (!active || active.team !== mission.team || active.cleared < screen - 1) {
      location.reload();
      return;
    }
    const input = get("answer");
    if (input.value.trim().toUpperCase() !== expected.trim().toUpperCase()) {
      input.setAttribute("aria-invalid", "true");
      get("feedback").textContent = "Entry rejected. Check your evidence and try again.";
      input.focus();
      input.select();
      return;
    }
    if (saveMission({ ...active, cleared: Math.max(active.cleared, screen) })) unlock(expected, true);
  });
  get("answer").addEventListener("input", () => {
    get("answer").removeAttribute("aria-invalid");
    get("feedback").textContent = "";
  });
}

function startEnding(mission) {
  get(mission.choice + "-ending").hidden = false;
  if (mission.choice === "continue") return;
  const showReset = (saved) => {
    get("message-form").hidden = true;
    get("message-result").hidden = !saved;
    get("reset-story").hidden = false;
  };
  if (typeof mission.message === "string") showReset(Boolean(mission.message));
  get("message-form").addEventListener("submit", (event) => {
    event.preventDefault();
    const active = readMission();
    if (!active || active.team !== mission.team || active.choice !== "reset") {
      location.reload();
      return;
    }
    const message = event.submitter?.value === "skip" ? "" : get("message").value.trim();
    if (saveMission({ ...active, message })) {
      showReset(Boolean(message));
      get("reset-story").focus();
    }
  });
}

function init() {
  let mission;
  try {
    mission = readMission();
  } catch {
    showGate("Browser storage is unavailable", "Allow this browser to save site data, then reload this page.", null);
    return;
  }
  if (screen > 0 && !mission) {
    showGate("No mission found on this device", "Open the introduction to select your team and start the mission.", 0, "Go to introduction");
    return;
  }
  if (screen > 0 && (mission.cleared < screen - 1 ||
      (screen === 6 && !["continue", "reset"].includes(mission.choice)))) {
    const previous = Math.min(mission.cleared + 1, 5);
    const title = screen === 6 ? "Ending locked" : "Stage " + screen + " locked";
    showGate(title, "Complete the earlier part of your mission to unlock this page.", previous, "Resume at Stage " + previous);
    return;
  }
  window.drawScene(screen, false, mission?.choice);
  if (screen === 0) startIntro(mission);
  else {
    get("team").textContent = "Team " + mission.team;
    connect("back", screen - 1);
    get("back").hidden = false;
    if (screen === 6) startEnding(mission);
    else startStage(mission);
  }
  get("mission-content").hidden = false;
}

init();
// Recheck when a browser restores a previously visited screen from its cache.
window.addEventListener("pageshow", (event) => {
  if (event.persisted) location.reload();
});

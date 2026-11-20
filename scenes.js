"use strict";
window.drawScene = function drawScene(stage, unlocked, choice) {
  const canvas = document.querySelector("canvas");
  const ctx = canvas.getContext("2d");
  const w = canvas.width;
  const h = canvas.height;
  const violet = "#a789ff";
  const blue = "#6bdaff";
  const background = ctx.createRadialGradient(422, 210, 5, 422, 210, 500);
  background.addColorStop(0, stage === 6 && choice === "continue" ? "#374a84" : "#2c2156");
  background.addColorStop(1, "#090b1c");
  ctx.fillStyle = background;
  ctx.fillRect(0, 0, w, h);

  function line(points, color, weight = 1, glow = 0) {
    ctx.beginPath();
    ctx.strokeStyle = color;
    ctx.lineWidth = weight;
    ctx.shadowColor = color;
    ctx.shadowBlur = glow;
    points.forEach(([x, y], i) => i ? ctx.lineTo(x, y) : ctx.moveTo(x, y));
    ctx.stroke();
    ctx.shadowBlur = 0;
  }
  function box(x, y, width, height, color, fill = "#14142d", glow = 0) {
    ctx.fillStyle = fill;
    ctx.fillRect(x, y, width, height);
    line([[x, y], [x + width, y], [x + width, y + height], [x, y + height], [x, y]], color, 2, glow);
  }
  function label(value, x, y, color = blue, size = 13) {
    ctx.font = "600 " + size + "px monospace";
    ctx.fillStyle = color;
    ctx.fillText(value, x, y);
  }
  function corridor(open) {
    for (let i = -4; i <= 4; i++) {
      line([[420, 218], [420 + i * 170, 490]], "#453978");
      line([[420, 218], [420 + i * 170, 0]], "#352e61");
    }
    for (let i = 5; i >= 0; i--) {
      const d = Math.pow(.73, i);
      const left = 420 - 380 * d;
      const right = 420 + 380 * d;
      const top = 218 - 180 * d;
      const bottom = 218 + 240 * d;
      line([[left + 54 * d, bottom], [left, bottom - 52 * d], [left, top + 36 * d], [left + 54 * d, top], [right - 54 * d, top], [right, top + 36 * d], [right, bottom - 52 * d], [right - 54 * d, bottom]], i % 2 ? blue : violet, 2.5, 13);
    }
    box(363, 159, 114, 145, open ? blue : violet, open ? "#b9daff" : "#1b1640", 21);
    if (!open) line([[420, 160], [420, 303]], "#6855a1", 2);
  }
  for (let i = 0; i < w; i += 35) line([[i, 0], [i, h]], "#201e39");
  for (let i = 0; i < h; i += 35) line([[0, i], [w, i]], "#201e39");

  if (stage === 0 || stage === 5 || (stage === 6 && choice === "continue")) {
    corridor(unlocked || stage === 6);
    if (stage === 5 && unlocked) {
      for (let i = 0; i < 8; i++) line([[0, 65 + i * 47], [w, 65 + i * 47]], "#b5b4ff80", 2, 9);
    }
  } else if (stage === 1 || stage === 6) {
    line([[0, 384], [166, 127], [670, 127], [840, 384]], violet, 3, 14);
    box(120, 350, 600, 85, "#7859bf", "#191430");
    box(260, unlocked ? 365 : 361, 320, unlocked ? 70 : 42, violet, unlocked ? "#2d2857" : "#20183d");
    line([[395, 380], [445, 380]], blue, 3, 10);
    box(218, 170, 374, 152, "#aa90e8", "#282650", 12);
    line([[405, 171], [405, 321]], violet, 3);
    for (let y = 199; y < 309; y += 15) {
      line([[243, y], [382, y]], "#685b96");
      line([[429, y], [569, y]], "#685b96");
    }
  } else if (stage === 2) {
    for (let column = 0; column < 6; column++) {
      const x = 69 + column * 119;
      box(x, 101, 105, 290, "#6955a3", "#14172f", 5);
      for (let row = 0; row < 7; row++) {
        const y = 116 + row * 37;
        const active = unlocked && column === 3;
        box(x + 9, y, 87, 25, active ? blue : "#484572", "#1c1b3b", active ? 12 : 0);
        line([[x + 18, y + 12], [x + 40, y + 12]], row % 3 ? violet : blue, 2, 4);
      }
    }
  } else if (stage === 3) {
    for (let i = 0; i < 3; i++) {
      const x = 57 + 248 * i;
      const lit = i !== 2 || unlocked;
      box(x, 120, 224, 214, lit ? violet : "#4e466d", lit ? "#252249" : "#0d0e20", 11);
      if (lit) {
        box(x + 22, 150, 180, 156, "#6553a3", "#191938");
        line([[x + 25, 287], [x + 200, 287]], blue, 2, 9);
        box(x + 82, 215, 67, 40, violet, "#292153");
      }
    }
    line([[0, 363], [840, 363]], blue, 2, 10);
    line([[0, 378], [840, 378]], "#6754a6");
  } else {
    box(86, 109, 668, 282, violet, "#11132b", 15);
    line([[119, 255], [720, 255]], "#484071");
    for (let i = 0; i < 95; i++) {
      if (!unlocked && (i === 23 || i === 51 || i === 74)) i += 6;
      const x = 128 + i * 6.12;
      const a = (Math.sin(i * .26) ** 2 * 58 + 4) * (0.4 + 0.6 * Math.sin(i * 2.29) ** 2);
      line([[x, 255 - a], [x, 255 + a]], i % 3 ? violet : blue, 2.1, 8);
    }
    label(unlocked ? "SIGNAL RESTORED" : "SIGNAL INTERRUPTED", 121, 153);
  }

  line([[36, 66], [36, 38], [80, 38]], blue, 2);
  line([[760, 38], [804, 38], [804, 66]], blue, 2);
  line([[36, 433], [36, 461], [80, 461]], violet, 2);
  line([[760, 461], [804, 461], [804, 433]], violet, 2);
  for (let y = 0; y < 490; y += 5) line([[0, y], [840, y]], "#08091c30");
  if (stage === 3 && unlocked) label("GROUP 43", 625, 425, blue, 16);
  const caption = document.querySelector("figcaption");
  if (stage === 5 && unlocked) caption.textContent = "Simulation boundaries dissolving";
  if (stage === 6 && choice === "reset") caption.textContent = "Screen standby";
};

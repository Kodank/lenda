/* Lenda juice pack — restrained overlays / micro-SFX (no layout bloat) */
(function (global) {
  "use strict";

  var SFX_KEY = "lenda-sfx";
  var MILESTONES = [70, 80, 90, 95, 99];
  var BIG_TROPHIES = { balon: 1, worldcup: 1, ucl: 1, libertadores: 1, clubworldcup: 1 };

  var ctx = null;

  function reducedMotion() {
    try {
      return !!(window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches);
    } catch (e) {
      return false;
    }
  }

  function ensureJuice(s) {
    if (!s) return null;
    if (!s.juice) {
      s.juice = {
        milestones: {},
        firsts: {},
        goodStreak: 0,
        jackpotDone: 0,
        hypeMax: 0,
        seenCups: {},
        lastNewCup: null
      };
    }
    var j = s.juice;
    if (!j.milestones) j.milestones = {};
    if (!j.firsts) j.firsts = {};
    if (!j.seenCups) j.seenCups = {};
    if (j.goodStreak == null) j.goodStreak = 0;
    if (j.jackpotDone == null) j.jackpotDone = 0;
    if (j.hypeMax == null) j.hypeMax = 0;
    return j;
  }

  function soundOn() {
    try {
      return localStorage.getItem(SFX_KEY) === "1";
    } catch (e) {
      return false;
    }
  }

  function setSound(on) {
    try {
      localStorage.setItem(SFX_KEY, on ? "1" : "0");
    } catch (e) {}
    updateSoundToggleUi();
  }

  function toggleSound() {
    setSound(!soundOn());
    if (soundOn()) beep("ui");
  }

  function audioCtx() {
    if (!soundOn()) return null;
    try {
      var AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return null;
      if (!ctx) ctx = new AC();
      if (ctx.state === "suspended") ctx.resume();
      return ctx;
    } catch (e) {
      return null;
    }
  }

  function tone(freq, dur, type, gain, when) {
    var ac = audioCtx();
    if (!ac) return;
    var t0 = (when != null ? when : 0) + ac.currentTime;
    var o = ac.createOscillator();
    var g = ac.createGain();
    o.type = type || "sine";
    o.frequency.setValueAtTime(freq, t0);
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.exponentialRampToValueAtTime(Math.max(0.0002, gain || 0.04), t0 + 0.012);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + (dur || 0.08));
    o.connect(g);
    g.connect(ac.destination);
    o.start(t0);
    o.stop(t0 + (dur || 0.08) + 0.02);
  }

  function beep(kind) {
    if (!soundOn() || reducedMotion()) return;
    if (kind === "ui") {
      tone(620, 0.05, "triangle", 0.03);
    } else if (kind === "ovrUp") {
      tone(440, 0.06, "sine", 0.035);
      tone(660, 0.08, "sine", 0.028, 0.05);
    } else if (kind === "ovrDn") {
      tone(320, 0.07, "sine", 0.03);
      tone(240, 0.09, "sine", 0.025, 0.05);
    } else if (kind === "trophy") {
      tone(520, 0.07, "triangle", 0.04);
      tone(780, 0.1, "triangle", 0.03, 0.06);
    } else if (kind === "click") {
      tone(880, 0.03, "sine", 0.02);
    } else if (kind === "fanfare") {
      tone(392, 0.07, "triangle", 0.035);
      tone(523, 0.08, "triangle", 0.03, 0.07);
      tone(659, 0.1, "triangle", 0.028, 0.14);
    } else if (kind === "jackpot") {
      tone(440, 0.08, "sine", 0.04);
      tone(554, 0.08, "sine", 0.035, 0.08);
      tone(659, 0.12, "sine", 0.03, 0.16);
    } else if (kind === "milestone") {
      tone(494, 0.07, "triangle", 0.035);
      tone(740, 0.1, "triangle", 0.028, 0.08);
    } else {
      tone(500, 0.05, "sine", 0.025);
    }
  }

  function soundToggleHtml() {
    var on = soundOn();
    return '<button type="button" class="ghost juice-sfx-btn' + (on ? " on" : "") +
      '" id="juice-sfx-toggle" title="' + (on ? "Som ligado" : "Som desligado") +
      '" aria-pressed="' + (on ? "true" : "false") + '">' +
      (on ? "🔊" : "🔇") + "</button>";
  }

  function updateSoundToggleUi() {
    var btn = document.getElementById("juice-sfx-toggle");
    if (!btn) return;
    var on = soundOn();
    btn.classList.toggle("on", on);
    btn.setAttribute("aria-pressed", on ? "true" : "false");
    btn.title = on ? "Som ligado" : "Som desligado";
    btn.textContent = on ? "🔊" : "🔇";
  }

  function bindSoundToggle() {
    var btn = document.getElementById("juice-sfx-toggle");
    if (!btn || btn._juiceBound) return;
    btn._juiceBound = true;
    btn.onclick = function (e) {
      e.preventDefault();
      e.stopPropagation();
      toggleSound();
    };
  }

  function ensureLayer(id, cls) {
    var el = document.getElementById(id);
    if (!el) {
      el = document.createElement("div");
      el.id = id;
      if (cls) el.className = cls;
      document.body.appendChild(el);
    }
    return el;
  }

  function shake(ms) {
    if (reducedMotion()) return;
    var app = document.getElementById("app");
    if (!app) return;
    app.classList.remove("juice-shake");
    void app.offsetWidth;
    app.classList.add("juice-shake");
    setTimeout(function () {
      app.classList.remove("juice-shake");
    }, Math.min(200, ms || 160));
  }

  function burstParticles(opts) {
    if (reducedMotion()) return;
    opts = opts || {};
    var n = Math.min(opts.count || 8, 14);
    var color = opts.color || "#6dffa8";
    var color2 = opts.color2 || "#f5c542";
    var life = opts.life || 420;
    var layer = ensureLayer("juice-fx-layer", "juice-fx-layer");
    var canvas = document.createElement("canvas");
    canvas.className = "juice-canvas";
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    layer.appendChild(canvas);
    var c = canvas.getContext("2d");
    var cx = opts.x != null ? opts.x : canvas.width / 2;
    var cy = opts.y != null ? opts.y : canvas.height * 0.28;
    var parts = [];
    for (var i = 0; i < n; i++) {
      var a = (Math.PI * 2 * i) / n + (Math.random() - 0.5) * 0.4;
      var sp = 1.2 + Math.random() * 2.4;
      parts.push({
        x: cx,
        y: cy,
        vx: Math.cos(a) * sp,
        vy: Math.sin(a) * sp - 1.2,
        r: 1.2 + Math.random() * 1.8,
        col: Math.random() < 0.55 ? color : color2,
        a: 1
      });
    }
    var t0 = performance.now();
    function frame(now) {
      var t = now - t0;
      c.clearRect(0, 0, canvas.width, canvas.height);
      for (var i = 0; i < parts.length; i++) {
        var p = parts[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.06;
        p.a = Math.max(0, 1 - t / life);
        c.globalAlpha = p.a;
        c.fillStyle = p.col;
        c.beginPath();
        c.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        c.fill();
      }
      if (t < life) requestAnimationFrame(frame);
      else if (canvas.parentNode) canvas.parentNode.removeChild(canvas);
    }
    requestAnimationFrame(frame);
  }

  function tickOvrBadge(from, to, ms) {
    if (from == null || to == null || from === to) return;
    var badge = document.querySelector(".ovr-badge b");
    if (!badge) return;
    if (reducedMotion()) {
      badge.textContent = String(to);
      return;
    }
    ms = Math.min(400, ms || 360);
    var start = performance.now();
    var delta = to - from;
    var up = delta > 0;
    badge.classList.add(up ? "juice-ovr-up" : "juice-ovr-dn");
    function step(now) {
      var p = Math.min(1, (now - start) / ms);
      var ease = 1 - Math.pow(1 - p, 2.4);
      badge.textContent = String(Math.round(from + delta * ease));
      if (p < 1) requestAnimationFrame(step);
      else {
        badge.textContent = String(to);
        setTimeout(function () {
          badge.classList.remove("juice-ovr-up", "juice-ovr-dn");
        }, 120);
      }
    }
    requestAnimationFrame(step);
    var rect = badge.getBoundingClientRect();
    burstParticles({
      count: up ? 7 : 5,
      color: up ? "#6dffa8" : "#ff8b8b",
      color2: up ? "#3dd68c" : "#ef4444",
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2,
      life: 380
    });
    beep(up ? "ovrUp" : "ovrDn");
  }

  function trophyHit(ids) {
    ids = ids || [];
    if (!ids.length) return;
    var root = document.getElementById("trophy-pop-root") || document.body;
    var flash = document.createElement("div");
    flash.className = "juice-trophy-flash";
    root.appendChild(flash);
    setTimeout(function () {
      if (flash.parentNode) flash.parentNode.removeChild(flash);
    }, 280);
    burstParticles({
      count: Math.min(10, 5 + ids.length * 2),
      color: "#f5c542",
      color2: "#fff4c2",
      life: 450
    });
    beep("trophy");
    var big = false;
    for (var i = 0; i < ids.length; i++) {
      if (BIG_TROPHIES[ids[i]]) { big = true; break; }
    }
    if (big) shake(180);
  }

  function pillLandClick() {
    beep("click");
  }

  function riskNearMiss(ch) {
    if (!ch || !ch.fx || !ch.fx.risk) return false;
    var p = ch.fx.risk.p;
    if (p == null) p = 0.5;
    return p >= 0.45 && p <= 0.55;
  }

  function runNearMiss(btn, thenFn) {
    if (reducedMotion()) {
      thenFn();
      return;
    }
    var grid = document.querySelector(".choices-grid");
    if (grid) grid.classList.add("juice-tension");
    if (btn) btn.classList.add("juice-anticipate");
    var toast = ensureLayer("juice-toast-root", "juice-toast-root");
    var tip = document.createElement("div");
    tip.className = "juice-toast tension";
    tip.textContent = "Quase…";
    toast.appendChild(tip);
    setTimeout(function () {
      if (tip.parentNode) tip.parentNode.removeChild(tip);
      if (grid) grid.classList.remove("juice-tension");
      if (btn) btn.classList.remove("juice-anticipate");
      thenFn();
    }, 320);
  }

  function showToast(text, cls, ms) {
    if (!text) return;
    var root = ensureLayer("juice-toast-root", "juice-toast-root");
    var el = document.createElement("div");
    el.className = "juice-toast" + (cls ? " " + cls : "");
    el.textContent = text;
    root.appendChild(el);
    requestAnimationFrame(function () { el.classList.add("on"); });
    setTimeout(function () {
      el.classList.remove("on");
      el.classList.add("out");
      setTimeout(function () {
        if (el.parentNode) el.parentNode.removeChild(el);
      }, 200);
    }, ms || 2200);
  }

  function checkMilestones(s, prevOvr) {
    var j = ensureJuice(s);
    if (!j) return;
    var ovr = s.ovr || 0;
    var from = prevOvr != null ? prevOvr : ovr;
    for (var i = 0; i < MILESTONES.length; i++) {
      var m = MILESTONES[i];
      if (j.milestones[m]) continue;
      if (ovr >= m && from < m) {
        j.milestones[m] = 1;
        showToast("Marco · OVR " + m, "milestone", 2400);
        beep("milestone");
        if (m >= 99) shake(200);
        break;
      }
    }
  }

  function updateStreak(s, pills) {
    var j = ensureJuice(s);
    if (!j) return 0;
    var good = false;
    var bad = false;
    for (var i = 0; i < (pills || []).length; i++) {
      var k = pills[i].kind || "";
      if (k === "good" || k === "temp-good") good = true;
      if (k === "bad" || k === "temp-bad") bad = true;
    }
    if (good && !bad) j.goodStreak = (j.goodStreak || 0) + 1;
    else if (bad) j.goodStreak = 0;
    return j.goodStreak || 0;
  }

  function streakChipHtml(s) {
    var j = ensureJuice(s);
    if (!j || (j.goodStreak || 0) < 3) return "";
    return '<div class="juice-streak-chip" title="Sequência boa">🔥 Em chamas · ' + j.goodStreak + "</div>";
  }

  function noteNewCups(s, seasonIds) {
    var j = ensureJuice(s);
    if (!j) return;
    j.lastNewCup = null;
    var list = seasonIds || [];
    for (var i = 0; i < list.length; i++) {
      var id = list[i];
      if (!j.seenCups[id]) {
        j.seenCups[id] = 1;
        j.lastNewCup = id;
      } else {
        j.seenCups[id] = (j.seenCups[id] || 0) + 1;
      }
    }
    var all = (s.career && s.career.trophies) || [];
    for (var k = 0; k < all.length; k++) {
      if (!j.seenCups[all[k]]) j.seenCups[all[k]] = 1;
    }
  }

  function syncSeenCupsQuiet(s) {
    var j = ensureJuice(s);
    if (!j) return;
    var all = (s.career && s.career.trophies) || [];
    for (var i = 0; i < all.length; i++) {
      if (!j.seenCups[all[i]]) j.seenCups[all[i]] = 1;
    }
  }

  function decorateTrophyCase(s) {
    var j = ensureJuice(s);
    if (!j || !j.lastNewCup) return;
    var items = document.querySelectorAll(".trophy-case .case-item");
    if (!items || !items.length) return;
    var meta = typeof trophyOf === "function" ? trophyOf(j.lastNewCup) : null;
    var name = meta ? meta.name : "";
    for (var i = 0; i < items.length; i++) {
      var span = items[i].querySelector("span");
      var txt = span ? span.textContent : "";
      if (name && txt.indexOf(name) === 0) {
        items[i].classList.add("juice-case-new");
        break;
      }
    }
    setTimeout(function () {
      if (j) j.lastNewCup = null;
    }, 4000);
  }


  function maybeJackpot(s, season) {
    var j = ensureJuice(s);
    if (!j || j.jackpotDone) return false;
    if (!season) return false;
    var peak = s.peakOvr || s.ovr || 0;
    if (peak < 88) return false;
    var cups = ((season.trophies || []).length + (season.awards || []).length);
    if (cups < 1 && (season.delta || 0) < 3) return false;
    var roll = typeof rnd === "function" ? rnd(s) : Math.random();
    if (roll > 0.012) return false;
    j.jackpotDone = 1;
    showToast("✦ Momento lenda", "jackpot", 2800);
    beep("jackpot");
    burstParticles({ count: 12, color: "#f5c542", color2: "#6dffa8", life: 500 });
    shake(160);
    return true;
  }

  function seasonSurpriseHtml(season) {
    if (!season) return "";
    var line = season.themeTitle || "";
    if (!line) return "";
    var notable = (season.trophies && season.trophies.length) ||
      (season.awards && season.awards.length) ||
      season.derby ||
      (season.nt && season.nt.path) ||
      Math.abs(season.delta || 0) >= 3;
    if (!notable) return "";
    return '<div class="juice-season-surprise" role="status">' +
      '<span class="juice-surprise-lab">Temporada</span>' +
      '<span class="juice-surprise-line">' + (typeof esc === "function" ? esc(line) : line) + "</span></div>";
  }

  function checkFirsts(s, season) {
    var j = ensureJuice(s);
    if (!j || !season) return;
    var msgs = [];
    if (!j.firsts.goal) {
      var g = s.pos === "GOL" ? (season.cs || 0) : (season.goals || 0);
      if (g > 0) {
        j.firsts.goal = 1;
        msgs.push(s.pos === "GOL" ? "Primeira SG" : "Primeiro gol");
      }
    }
    if (!j.firsts.title) {
      if ((season.trophies || []).length) {
        j.firsts.title = 1;
        msgs.push("Primeiro título");
      }
    }
    if (!j.firsts.callup) {
      if (season.nt && season.nt.apps > 0 && !season.nt.youth) {
        j.firsts.callup = 1;
        msgs.push("Primeira convocação");
      }
    }
    if (msgs.length) {
      showToast(msgs[0], "fanfare", 2300);
      beep("fanfare");
    }
  }

  function clamp01(n) {
    return Math.max(0, Math.min(1, n));
  }

  function hypeScore(s) {
    if (!s) return 0;
    var titles = (s.career && s.career.trophies) || [];
    var tw = 0;
    for (var i = 0; i < titles.length; i++) {
      var meta = typeof trophyOf === "function" ? trophyOf(titles[i]) : { w: 2 };
      tw += (meta.w || 2);
    }
    var classics = 0;
    var seasons = s.seasons || [];
    for (var k = 0; k < seasons.length; k++) {
      if (seasons[k].derby && seasons[k].derby.won) classics++;
      if (seasons[k].nt && seasons[k].nt.path &&
        (seasons[k].nt.path.stage === "final" || seasons[k].nt.path.stage === "champion")) {
        classics += 2;
      }
    }
    var ovrPart = clamp01(((s.peakOvr || s.ovr || 50) - 50) / 49);
    var titlePart = clamp01(tw / 40);
    var classicPart = clamp01(classics / 8);
    return Math.round(clamp01(ovrPart * 0.45 + titlePart * 0.35 + classicPart * 0.2) * 100);
  }

  function hypeBarHtml(s) {
    var j = ensureJuice(s);
    var pct = hypeScore(s);
    if (j && pct > (j.hypeMax || 0)) j.hypeMax = pct;
    var full = pct >= 100;
    return '<div class="juice-hype-bar' + (full ? " full" : "") + '" title="Hype da carreira">' +
      '<div class="juice-hype-track"><i style="width:' + pct + '%"></i></div>' +
      '<span class="juice-hype-lab">' + (full ? "Hype cheio" : "Hype " + pct + "%") + "</span></div>";
  }

  function maybeCelebrateHype(s) {
    var j = ensureJuice(s);
    if (!j) return;
    var pct = hypeScore(s);
    if (pct >= 100 && !j.hypeCelebrated) {
      j.hypeCelebrated = 1;
      showToast("Hype no máximo", "hype", 2200);
      beep("fanfare");
      burstParticles({ count: 10, color: "#f5c542", color2: "#6dffa8", life: 420 });
    }
  }

  function onAfterChoice(s) {
    if (!s || !s._lastOutcome) return;
    updateStreak(s, s._lastOutcome.pills || []);
    if (document.querySelectorAll(".fx-pill.landed").length) pillLandClick();
  }

  function onReportEnter(s, reports, prevOvr) {
    if (!s) return;
    ensureJuice(s);
    var last = reports && reports.length ? reports[reports.length - 1] : null;
    if (last) {
      var ids = (last.trophies || []).concat(last.awards || []);
      noteNewCups(s, ids);
      checkFirsts(s, last);
      maybeJackpot(s, last);
      if (last.divisionChange && last.divisionChange.label) {
        var dcls = last.divisionChange.kind === "promo" ? "fanfare" : "tension";
        showToast(last.divisionChange.label, dcls, 2600);
        if (last.divisionChange.kind === "promo") beep("fanfare");
      }
    } else {
      syncSeenCupsQuiet(s);
    }
    checkMilestones(s, prevOvr);
    maybeCelebrateHype(s);
    requestAnimationFrame(function () {
      if (prevOvr != null && s.ovr != null && prevOvr !== s.ovr) {
        tickOvrBadge(prevOvr, s.ovr, 360);
      }
      decorateTrophyCase(s);
    });
  }

  function onTrophyShow(ids) {
    trophyHit(ids || []);
  }

  global.JUICE = {
    soundOn: soundOn,
    setSound: setSound,
    toggleSound: toggleSound,
    beep: beep,
    soundToggleHtml: soundToggleHtml,
    bindSoundToggle: bindSoundToggle,
    ensureJuice: ensureJuice,
    riskNearMiss: riskNearMiss,
    runNearMiss: runNearMiss,
    onAfterChoice: onAfterChoice,
    onReportEnter: onReportEnter,
    onTrophyShow: onTrophyShow,
    streakChipHtml: streakChipHtml,
    hypeBarHtml: hypeBarHtml,
    seasonSurpriseHtml: seasonSurpriseHtml,
    shake: shake,
    tickOvrBadge: tickOvrBadge,
    showToast: showToast
  };
})(typeof window !== "undefined" ? window : this);

/* Lenda DEV sandbox — session unlock; no-op when locked */
(function (global) {
  var SS = "DEV_SANDBOX";
  var FK = "lenda_dev_flags_v1";
  /* Unlock: SHA-256(salt|password) via Web Crypto — no plaintext password in source. */
  var PW_SALT = "lenda.sandbox.v1";
  var PW_HASH = "de0b2d66684740c7a808a4f7adbfcdba75362f855dfae240a2234d34c687d286";
  var LOCK_KEY = "lenda_dev_lock_v1";
  var MAX_FAIL = 5;
  var LOCK_MS = 60000;
  var failN = 0;
  var lockUntil = 0;

  var tapN = 0;
  var tapAt = 0;
  var holdT = null;
  var panelOpen = false;
  var toastT = null;

  var DEV = {
    unlocked: false,
    flags: { ignoreInjury: false, alwaysTransfers: false, godGrowth: false, forceRescind: false, forceSubstances: false, nextDestiny: null },
    on: function () { return !!DEV.unlocked; }
  };

  function load() {
    try {
      DEV.unlocked = sessionStorage.getItem(SS) === "true";
      var raw = sessionStorage.getItem(FK);
      if (raw) {
        var f = JSON.parse(raw);
        if (f) {
          DEV.flags.ignoreInjury = !!f.ignoreInjury;
          DEV.flags.alwaysTransfers = !!f.alwaysTransfers;
          DEV.flags.godGrowth = !!f.godGrowth;
          DEV.flags.nextDestiny = f.nextDestiny && DESTINY[f.nextDestiny] ? f.nextDestiny : null;
        }
      }
    } catch (e) {
      DEV.unlocked = false;
    }
  }

  function persist() {
    try {
      if (DEV.unlocked) sessionStorage.setItem(SS, "true");
      else sessionStorage.removeItem(SS);
      sessionStorage.setItem(FK, JSON.stringify(DEV.flags));
    } catch (e) {}
    global.DEV_SANDBOX = DEV.unlocked;
  }

  function toast(msg, bad) {
    var el = document.getElementById("dev-toast");
    if (!el) {
      el = document.createElement("div");
      el.id = "dev-toast";
      document.body.appendChild(el);
    }
    el.textContent = msg;
    el.className = "dev-toast on" + (bad ? " bad" : "");
    if (toastT) clearTimeout(toastT);
    toastT = setTimeout(function () { el.classList.remove("on"); }, 1700);
  }

  function needCareer(allowRetired) {
    if (!S || !S.clubId) {
      toast("Precisa de carreira ativa", true);
      return false;
    }
    if (!allowRetired && S.retired) {
      toast("Carreira encerrada", true);
      return false;
    }
    return true;
  }

  function refresh() {
    if (S && S.clubId) save();
    render();
  }

  function setOvrPot(ovr, pot) {
    if (!needCareer(true)) return;
    ovr = clamp(Math.round(+ovr), 40, OVR_CAP);
    pot = clamp(Math.round(+pot), 70, OVR_CAP);
    var d = ovr - S.ovr;
    if (d) applyDeltaToAttrs(S, d);
    S.ovr = clamp(ovr, 40, OVR_CAP);
    S.pot = Math.max(pot, S.ovr);
    /* DEV: OVR livre; pot ainda respeita teto do destino se existir. */
    if (typeof clampPotToDestiny === "function") S.pot = clampPotToDestiny(S, S.pot);
    if (typeof clampOvrToDestiny === "function") S.ovr = clampOvrToDestiny(S, S.ovr);
    S.peakOvr = Math.max(S.peakOvr || 0, S.ovr);
    S.role = roleOf(S, clubOf(S.clubId));
    applyMarketValue(S);
    refresh();
    toast("OVR " + S.ovr + " / Pot " + S.pot);
  }

  function setDestinyId(id) {
    if (!needCareer(true)) return;
    if (!DESTINY[id]) {
      toast("Destino invalido", true);
      return;
    }
    var d = applyDestiny(S, id);
    S.role = roleOf(S, clubOf(S.clubId));
    applyMarketValue(S);
    refresh();
    toast("Destino: " + d.label + " (teto " + d.ovrSoftCap + ")");
  }

  function setAge(age) {
    if (!needCareer(true)) return;
    age = clamp(Math.round(+age), START_AGE, 40);
    var dy = age - S.age;
    S.age = age;
    S.year = (S.year || START_YEAR) + dy;
    refresh();
    toast("Idade " + S.age);
  }

  function setVitals(energy, form, conf, disc) {
    if (!needCareer(true)) return;
    S.energy = clamp(Math.round(+energy), 0, 100);
    S.form = clamp(Math.round(+form), 0, 100);
    S.confidence = clamp(Math.round(+conf), 0, 100);
    S.traits = S.traits || { loyalty: 50, ambition: 50, discipline: 50, resilience: 50 };
    S.traits.discipline = clamp(Math.round(+disc), 0, 100);
    refresh();
    toast("Vitals OK");
  }

  function leagueTrophy() {
    return leagueOf(clubOf(S.clubId).leagueId).trophy || "brasileirao";
  }

  function cupTrophy() {
    var club = clubOf(S.clubId);
    var lg = leagueOf(club.leagueId);
    return lg.cupTrophy || (typeof NATION_CUP !== "undefined" && NATION_CUP[club.nation]) || "copa";
  }

  function contTrophy() {
    var cont = leagueOf(clubOf(S.clubId).leagueId).continental;
    if (cont === "lib") return "libertadores";
    if (cont === "ucl") return "ucl";
    if (cont === "acl") return "acl";
    if (cont === "caf") return "caf";
    if (cont === "concacaf") return "concacaf";
    /* Never default Asia/Africa/null → UCL */
    return cont || null;
  }

  function forceTrophies(opts) {
    if (!needCareer(true)) return;
    var ids = [];
    if (opts.league) ids.push(leagueTrophy());
    if (opts.cup) ids.push(cupTrophy());
    if (opts.continental) { var _ct = contTrophy(); if (_ct) ids.push(_ct); else toast("Sem continental nesta liga", true); }
    if (opts.clubWorld) ids.push("clubworldcup");
    if (opts.world) ids.push("worldcup");
    if (opts.copaAm) ids.push("copaamerica");
    if (opts.euro) ids.push("euro");
    if (!ids.length) {
      toast("Nada selecionado", true);
      return;
    }
    for (var i = 0; i < ids.length; i++) addTrophy(S, ids[i]);
    var last = S.seasons && S.seasons.length ? S.seasons[S.seasons.length - 1] : null;
    if (last) last.trophies = (last.trophies || []).concat(ids);
    refresh();
    toast("Titulos +" + ids.length);
  }

  function giveAwards(opts) {
    if (!needCareer(true)) return;
    S.awards = S.awards || [];
    var n = 0;
    if (opts.balon) {
      S.awards.push("balon");
      n++;
    }
    if (opts.bota) {
      if (S.pos === "GOL" && !opts.force) toast("Chuteira: marque Forcar", true);
      else {
        S.awards.push("bota");
        n++;
      }
    }
    if (opts.luva) {
      if (S.pos !== "GOL" && !opts.force) toast("Luva: marque Forcar", true);
      else {
        S.awards.push("luva");
        n++;
      }
    }
    if (opts.mvp) {
      S.awards.push("mvp");
      n++;
    }
    if (!n) {
      toast("Nada aplicado", true);
      return;
    }
    refresh();
    toast("Premios +" + n);
  }

  function jumpClub(id) {
    if (!needCareer()) return;
    var c = clubOf(id);
    if (!c || c.id !== id) {
      toast("Clube invalido", true);
      return;
    }
    moveTo(S, c);
    refresh();
    toast("-> " + c.name);
  }

  function sortedClubs() {
    var list = (typeof CLUBS !== "undefined" ? CLUBS : []).slice();
    list.sort(function (a, b) {
      return String(a.name).localeCompare(String(b.name), "pt");
    });
    return list;
  }

  function clubPickRowsHtml(attr) {
    attr = attr || "data-base-club";
    return sortedClubs()
      .map(function (c) {
        var nat = typeof nationOf === "function" && c.nation ? nationOf(c.nation) : null;
        if (nat && nat.id !== c.nation) nat = null;
        var hay = (c.name + " " + (nat ? nat.name : "") + " " + (c.city || "")).toLowerCase();
        var crest =
          typeof imgCrest === "function"
            ? imgCrest(c.crest, "dev-club-crest", c.name)
            : '<img class="dev-club-crest" src="' + c.crest + '" alt="">';
        var nameHtml =
          typeof clubNameHtml === "function"
            ? clubNameHtml(c.name, "dev-club-name")
            : "<b>" + esc(c.name) + "</b>";
        return (
          '<button type="button" class="dev-club-row" ' +
          attr +
          '="' +
          c.id +
          '" data-club-q="' +
          esc(hay) +
          '">' +
          crest +
          '<span class="dev-club-meta">' +
          nameHtml +
          '<small class="dev-club-nat">' +
          (nat && nat.flag ? '<img class="mini-flag" src="' + nat.flag + '" alt="">' : "") +
          esc(nat ? nat.name : c.nation) +
          "</small></span></button>"
        );
      })
      .join("");
  }

  function bindClubSearch(inputId, listSel) {
    var q = document.getElementById(inputId);
    var list = document.querySelector(listSel);
    if (!q || !list) return;
    q.oninput = function () {
      var s = q.value.toLowerCase().trim();
      Array.prototype.forEach.call(list.querySelectorAll(".dev-club-row"), function (row) {
        var hay = row.getAttribute("data-club-q") || "";
        row.style.display = !s || hay.indexOf(s) >= 0 ? "" : "none";
      });
    };
  }

  /* Prefer academy-start when mid-setup; otherwise inject as current club. */
  function startAcademyAt(clubId) {
    var c = clubOf(clubId);
    if (!c || c.id !== clubId) {
      toast("Clube invalido", true);
      return;
    }
    var midSetup = !S || !S.clubId;
    if (midSetup) {
      if (!S) {
        if (!UI || !UI.draft) {
          toast("Crie o jogador primeiro", true);
          return;
        }
        S = newCareer(UI.draft);
      }
      signAcademy(S, clubId);
      UI.offers = null;
      UI.event = null;
      UI._prevOvr = S.ovr;
      UI.reports = typeof simSeason === "function" ? [simSeason(S)] : [];
      UI.screen = "report";
      save();
      render();
      if (typeof startTrophyQueue === "function") startTrophyQueue(trophiesFromReports(UI.reports));
      toast("Base em " + c.name + " · temporada 16");
      return;
    }
    moveTo(S, c);
    refresh();
    toast("-> " + c.name);
  }

  function basePickHtml() {
    return (
      '<div class="dev-sec"><div class="dev-h">Iniciar na Base em…</div>' +
      '<p class="dev-hint">Qualquer clube do banco. Se ainda nao assinou, inicia a Base; se ja tem carreira, troca o clube atual.</p>' +
      '<input type="search" id="dev-base-q" placeholder="Buscar clube, pais ou cidade…" autocomplete="off">' +
      '<div class="dev-club-list" id="dev-base-list">' +
      clubPickRowsHtml("data-base-club") +
      "</div></div>"
    );
  }

  function forceNT(apps, goals) {
    if (!needCareer(true)) return;
    apps = Math.max(0, Math.round(+apps || 0));
    goals = Math.max(0, Math.round(+goals || 0));
    S.caps = (S.caps || 0) + apps;
    S.ntGoals = (S.ntGoals || 0) + goals;
    S.ntNoStreak = 0;
    if (S.age <= 20) S.youthCaps = (S.youthCaps || 0) + Math.min(apps, 8);
    refresh();
    toast("Selecao +" + apps + " J / +" + goals + " G");
  }


  function forceSubstances() {
    if (!needCareer()) return;
    if (typeof buildSubstancesEvent !== "function") {
      toast("Substancias indisponivel", true);
      return;
    }
    /* Limpa cooldown/uso para o force funcionar mesmo em carreiras que já viram o evento */
    S.usedEvents = (S.usedEvents || []).filter(function (id) { return id !== "substancias"; });
    S.substancesTaken = false;
    S.lastSubstancesYear = null;
    UI.event = buildSubstancesEvent(S);
    UI.screen = "decision";
    save();
    render();
    toast("Substancias forcadas");
  }

  function forceRescission() {
    if (!needCareer()) return;
    if (!S.clubId) {
      toast("Ja esta sem clube", true);
      return;
    }
    if (typeof buildRescissionEvent !== "function") {
      toast("Rescisao indisponivel", true);
      return;
    }
    UI.event = buildRescissionEvent(S);
    UI.screen = "decision";
    save();
    render();
    toast("Rescisao forcada");
  }

  function finishSeason() {

    if (!needCareer()) return;
    UI.reports = advance(S);
    UI.screen = S.retired ? "legacy" : "report";
    save();
    render();
    if (typeof startTrophyQueue === "function") {
      startTrophyQueue(trophiesFromReports(UI.reports || []));
    }
    toast("Temporada encerrada");
  }

  function plusYear() {
    if (!needCareer()) return;
    UI.reports = [simSeason(S)];
    if (shouldRetire(S)) S.retired = true;
    UI.screen = S.retired ? "legacy" : "report";
    save();
    render();
    if (typeof startTrophyQueue === "function") {
      startTrophyQueue(trophiesFromReports(UI.reports));
    }
    toast("+1 ano");
  }

  function jumpAge(target) {
    if (!needCareer()) return;
    target = +target;
    if (target === 99) {
      S.retireForce = true;
      S.retired = true;
      UI.screen = "legacy";
      save();
      render();
      toast("Aposentadoria");
      return;
    }
    var g = 0;
    while (S.age < target && !S.retired && S.age < 40 && g < 30) {
      simSeason(S);
      g++;
      if (shouldRetire(S)) {
        S.retired = true;
        break;
      }
    }
    if (S.retired) UI.screen = "legacy";
    else {
      UI.event = pickEvent(S);
      UI.screen = "decision";
    }
    save();
    render();
    toast("Idade " + S.age);
  }

  function maxApex() {
    if (!needCareer(true)) return;
    if (S.age < 24 || S.age > 29) {
      var dy = 26 - S.age;
      S.age = 26;
      S.year = (S.year || START_YEAR) + dy;
    }
    setOvrPot(96, 99);
    S.energy = 92;
    S.form = 90;
    S.confidence = 88;
    S.traits = S.traits || {};
    S.traits.discipline = 85;
    S.role = roleOf(S, clubOf(S.clubId));
    applyMarketValue(S);
    refresh();
    toast("Apice maximo");
  }

  function triggerBreakthrough() {
    if (!needCareer()) return;
    var ev = null;
    for (var i = 0; i < EVENTS.length; i++) {
      if (EVENTS[i].id === "breakthrough") {
        ev = EVENTS[i];
        break;
      }
    }
    if (!ev) {
      toast("Evento nao encontrado", true);
      return;
    }
    UI.event = ev;
    UI.screen = "decision";
    save();
    render();
    toast("Janela de ouro");
  }

  function loadLock() {
    try {
      var n = parseInt(sessionStorage.getItem(LOCK_KEY) || "0", 10);
      if (n && n > Date.now()) lockUntil = n;
      else sessionStorage.removeItem(LOCK_KEY);
    } catch (e) {}
  }

  function setLock(until) {
    lockUntil = until || 0;
    try {
      if (lockUntil) sessionStorage.setItem(LOCK_KEY, String(lockUntil));
      else sessionStorage.removeItem(LOCK_KEY);
    } catch (e) {}
  }

  function sha256Hex(str) {
    if (!global.crypto || !crypto.subtle || !crypto.subtle.digest) {
      return Promise.reject(new Error("subtle"));
    }
    var data = new TextEncoder().encode(str);
    return crypto.subtle.digest("SHA-256", data).then(function (buf) {
      var a = new Uint8Array(buf);
      var hex = "";
      for (var i = 0; i < a.length; i++) {
        var h = a[i].toString(16);
        hex += h.length < 2 ? "0" + h : h;
      }
      return hex;
    });
  }

  function clearPwField() {
    var inp = document.getElementById("dev-pw");
    if (inp) {
      inp.value = "";
      try { inp.blur(); } catch (e) {}
    }
  }


  function tryUnlock(pw) {
    loadLock();
    if (Date.now() < lockUntil) {
      var left = Math.ceil((lockUntil - Date.now()) / 1000);
      toast("Aguarde " + left + "s", true);
      clearPwField();
      return false;
    }
    var typed = String(pw == null ? "" : pw);
    clearPwField();
    if (!typed) {
      toast("Negado", true);
      return false;
    }
    sha256Hex(PW_SALT + "|" + typed).then(function (hex) {
      typed = "";
      if (hex === PW_HASH) {
        failN = 0;
        setLock(0);
        DEV.unlocked = true;
        persist();
        closeModal();
        toast("OK");
        panelOpen = true;
        render();
        return;
      }
      failN++;
      if (failN >= MAX_FAIL) {
        failN = 0;
        setLock(Date.now() + LOCK_MS);
        closeModal();
        toast("Bloqueado", true);
      } else {
        toast("Negado", true);
        var inp = document.getElementById("dev-pw");
        if (inp) {
          inp.classList.add("dev-shake");
          setTimeout(function () { inp.classList.remove("dev-shake"); }, 400);
          setTimeout(function () { try { inp.focus(); } catch (e) {} }, 50);
        }
      }
    }).catch(function () {
      typed = "";
      toast("Negado", true);
    });
    return false;
  }

  function openModal() {
    closeModal();
    var bd = document.createElement("div");
    bd.id = "dev-gate";
    bd.className = "dev-gate";
    bd.innerHTML =
      '<div class="dev-gate-card" role="dialog">' +
      '<div class="dev-gate-label">...</div>' +
      '<input id="dev-pw" type="password" autocomplete="off" spellcheck="false" />' +
      '<div class="dev-gate-actions">' +
      '<button type="button" class="btn alt" id="dev-gate-cancel">Cancelar</button>' +
      '<button type="button" class="btn" id="dev-gate-ok">OK</button>' +
      "</div></div>";
    document.body.appendChild(bd);
    var inp = document.getElementById("dev-pw");
    document.getElementById("dev-gate-ok").onclick = function () {
      tryUnlock(inp.value);
    };
    document.getElementById("dev-gate-cancel").onclick = closeModal;
    bd.addEventListener("click", function (e) {
      if (e.target === bd) closeModal();
    });
    inp.addEventListener("keydown", function (e) {
      if (e.key === "Enter") tryUnlock(inp.value);
      if (e.key === "Escape") closeModal();
    });
    setTimeout(function () {
      inp.focus();
    }, 40);
  }

  function closeModal() {
    var bd = document.getElementById("dev-gate");
    if (bd && bd.parentNode) bd.parentNode.removeChild(bd);
  }

  function onSecretTap() {
    var now = Date.now();
    if (now - tapAt > 2200) tapN = 0;
    tapAt = now;
    tapN++;
    if (tapN >= 5) {
      tapN = 0;
      if (DEV.unlocked) {
        panelOpen = !panelOpen;
        mountChrome();
        toast(panelOpen ? "Painel" : "Fechado");
      } else openModal();
    }
  }

  function bindSecrets(root) {
    if (!root) return;
    var nodes = root.querySelectorAll(".home h1, .brand");
    Array.prototype.forEach.call(nodes, function (el) {
      if (el._devBound) return;
      el._devBound = 1;
      el.classList.add("dev-secret-target");
      el.addEventListener("click", function () {
        onSecretTap();
      });
      el.addEventListener("pointerdown", function (e) {
        if (e.button && e.button !== 0) return;
        holdT = setTimeout(function () {
          holdT = null;
          tapN = 0;
          if (DEV.unlocked) {
            panelOpen = true;
            mountChrome();
          } else openModal();
        }, 900);
      });
      function clearH() {
        if (holdT) {
          clearTimeout(holdT);
          holdT = null;
        }
      }
      el.addEventListener("pointerup", clearH);
      el.addEventListener("pointerleave", clearH);
      el.addEventListener("pointercancel", clearH);
    });
  }

  function clubOptions() {
    var list = (typeof CLUBS !== "undefined" ? CLUBS : []).slice();
    list.sort(function (a, b) {
      return String(a.name).localeCompare(String(b.name), "pt");
    });
    var cur = S && S.clubId;
    return list
      .map(function (c) {
        return (
          '<option value="' +
          c.id +
          '"' +
          (c.id === cur ? " selected" : "") +
          ">" +
          esc(c.name) +
          "</option>"
        );
      })
      .join("");
  }

  function destinyPickHtml(forNext) {
    var cur = S && S.destiny && DESTINY[S.destiny] ? DESTINY[S.destiny] : null;
    var next = DEV.flags.nextDestiny && DESTINY[DEV.flags.nextDestiny] ? DESTINY[DEV.flags.nextDestiny] : null;
    var opts = DESTINY_IDS.map(function (id) {
      var d = DESTINY[id];
      var sel = forNext ? next && next.id === id : cur && cur.id === id;
      return '<option value="' + id + '"' + (sel ? " selected" : "") + ">" + d.label + " · teto " + d.ovrSoftCap + " (" + d.weight + "%)</option>";
    }).join("");
    var head = forNext ? "Destino (proxima carreira)" : "Destino oculto";
    var hint = cur
      ? "Atual: " + cur.label + " · potMax " + cur.potMax + " · stage≤" + cur.maxStage
      : next
        ? "Forcar na proxima: " + next.label
        : "Oculto na UI normal — so sandbox ve/forca.";
    return (
      '<div class="dev-sec"><div class="dev-h">' +
      head +
      '</div><p class="dev-hint">' +
      hint +
      '</p><div class="dev-row">' +
      '<select id="dev-destiny">' +
      '<option value="">(rolar aleatorio)</option>' +
      opts +
      '</select>' +
      '<button type="button" class="btn sm" data-dev="destiny">Aplicar</button></div></div>'
    );
  }

  function panelHtml() {

    if (!S || !S.clubId) {
      return (
        basePickHtml() +
        destinyPickHtml(true) +
        '<div class="dev-sec"><p class="dev-hint">Crie o jogador (ou avance ate a Base) e escolha um clube acima — ou continue uma carreira para editar o estado.</p>' +
        '<div class="dev-btns">' +
        '<button type="button" class="btn sm" data-dev="new">Nova carreira</button>' +
        '<button type="button" class="btn sm alt" data-dev="reload">Recarregar</button></div></div>'
      );
    }
    var disc = (S.traits && S.traits.discipline) || 50;
    return (
      '<div class="dev-sec"><div class="dev-h">OVR / Potencial</div><div class="dev-row">' +
      '<label>OVR <input type="number" id="dev-ovr" min="40" max="99" value="' +
      S.ovr +
      '"></label>' +
      '<label>Pot <input type="number" id="dev-pot" min="70" max="99" value="' +
      S.pot +
      '"></label>' +
      '<button type="button" class="btn sm" data-dev="ovr">Aplicar</button></div></div>' +
      destinyPickHtml(false) +
      '<div class="dev-sec"><div class="dev-h">Idade</div><div class="dev-row">' +
      '<input type="number" id="dev-age" min="16" max="40" value="' +
      S.age +
      '">' +
      '<button type="button" class="btn sm" data-dev="age">Aplicar</button></div></div>' +
      '<div class="dev-sec"><div class="dev-h">Vitals</div><div class="dev-grid">' +
      '<label>Energia <input type="range" id="dev-energy" min="0" max="100" value="' +
      S.energy +
      '"><b id="dev-energy-v">' +
      S.energy +
      "</b></label>" +
      '<label>Forma <input type="range" id="dev-form" min="0" max="100" value="' +
      S.form +
      '"><b id="dev-form-v">' +
      S.form +
      "</b></label>" +
      '<label>Confianca <input type="range" id="dev-conf" min="0" max="100" value="' +
      S.confidence +
      '"><b id="dev-conf-v">' +
      S.confidence +
      "</b></label>" +
      '<label>Disciplina <input type="range" id="dev-disc" min="0" max="100" value="' +
      disc +
      '"><b id="dev-disc-v">' +
      disc +
      "</b></label>" +
      '</div><button type="button" class="btn sm" data-dev="vitals">Aplicar vitals</button></div>' +
      '<div class="dev-sec"><div class="dev-h">Titulos (forcar)</div><div class="dev-checks">' +
      '<label><input type="checkbox" id="dev-t-lg"> Liga</label>' +
      '<label><input type="checkbox" id="dev-t-cup"> Copa</label>' +
      '<label><input type="checkbox" id="dev-t-cont"> Continental</label>' +
      '<label><input type="checkbox" id="dev-t-cwc"> Mundial clubes</label>' +
      '<label><input type="checkbox" id="dev-t-wc"> Copa do Mundo</label>' +
      '<label><input type="checkbox" id="dev-t-ca"> Copa America</label>' +
      '<label><input type="checkbox" id="dev-t-eu"> Euro</label>' +
      '</div><button type="button" class="btn sm" data-dev="trophies">Aplicar titulos</button></div>' +
      '<div class="dev-sec"><div class="dev-h">Premios individuais</div><div class="dev-checks">' +
      '<label><input type="checkbox" id="dev-a-balon"> Bola de Ouro</label>' +
      '<label><input type="checkbox" id="dev-a-bota"> Chuteira</label>' +
      '<label><input type="checkbox" id="dev-a-luva"> Luva</label>' +
      '<label><input type="checkbox" id="dev-a-mvp"> MVP</label>' +
      '<label><input type="checkbox" id="dev-a-force"> Forcar (GK/linha)</label>' +
      '</div><button type="button" class="btn sm" data-dev="awards">Dar premios</button></div>' +
      basePickHtml() +
      '<div class="dev-sec"><div class="dev-h">Pular clube</div>' +
      '<input type="search" id="dev-club-q" placeholder="Buscar clube..." autocomplete="off">' +
      '<select id="dev-club" size="7">' +
      clubOptions() +
      "</select>" +
      '<button type="button" class="btn sm" data-dev="club">Transferir agora</button></div>' +
      '<div class="dev-sec"><div class="dev-h">Selecao</div><div class="dev-row">' +
      '<label>Jogos <input type="number" id="dev-nt-apps" min="0" max="80" value="5"></label>' +
      '<label>Gols <input type="number" id="dev-nt-goals" min="0" max="80" value="2"></label>' +
      '<button type="button" class="btn sm" data-dev="nt">Somar</button></div></div>' +
      '<div class="dev-sec"><div class="dev-h">Avancar</div><div class="dev-btns">' +
      '<button type="button" class="btn sm" data-dev="finish">Terminar temporada</button>' +
      '<button type="button" class="btn sm alt" data-dev="y1">+1 ano</button>' +
      '<button type="button" class="btn sm alt" data-dev="a30">-> 30 anos</button>' +
      '<button type="button" class="btn sm alt" data-dev="a35">-> 35 anos</button>' +
      '<button type="button" class="btn sm danger" data-dev="retire">Aposentar</button></div></div>' +
      '<div class="dev-sec"><div class="dev-h">Presets</div><div class="dev-btns">' +
      '<button type="button" class="btn sm" data-dev="apex">Apice max.</button>' +
      '<button type="button" class="btn sm" data-dev="break">Breakthrough raro</button>' +
      '<button type="button" class="btn sm danger" data-dev="rescind">Forcar rescisao</button>' +
      '<button type="button" class="btn sm danger" data-dev="substances">Forcar substancias</button></div></div>' +
      '<div class="dev-sec"><div class="dev-h">Toggles</div><div class="dev-checks">' +
      '<label><input type="checkbox" id="dev-f-inj"' +
      (DEV.flags.ignoreInjury ? " checked" : "") +
      "> Ignorar lesao</label>" +
      '<label><input type="checkbox" id="dev-f-tr"' +
      (DEV.flags.alwaysTransfers ? " checked" : "") +
      "> Sempre ofertas</label>" +
      '<label><input type="checkbox" id="dev-f-god"' +
      (DEV.flags.godGrowth ? " checked" : "") +
      "> God growth</label></div></div>" +
      '<div class="dev-sec"><div class="dev-h">Atalhos</div><div class="dev-btns">' +
      '<button type="button" class="btn sm alt" data-dev="reload">Recarregar</button>' +
      '<button type="button" class="btn sm" data-dev="new">Nova carreira</button>' +
      '<button type="button" class="btn sm danger" data-dev="lock">Desligar sandbox</button></div></div>'
    );
  }

  function mountChrome() {
    var badge = document.getElementById("dev-badge");
    var panel = document.getElementById("dev-panel");
    if (!DEV.unlocked) {
      if (badge && badge.parentNode) badge.parentNode.removeChild(badge);
      if (panel && panel.parentNode) panel.parentNode.removeChild(panel);
      return;
    }
    if (!badge) {
      badge = document.createElement("button");
      badge.id = "dev-badge";
      badge.type = "button";
      badge.className = "dev-badge";
      badge.textContent = "DEV";
      document.body.appendChild(badge);
      badge.onclick = function () {
        panelOpen = !panelOpen;
        mountChrome();
      };
    }
    if (panelOpen) {
      if (!panel) {
        panel = document.createElement("div");
        panel.id = "dev-panel";
        panel.className = "dev-panel";
        document.body.appendChild(panel);
      }
      panel.innerHTML =
        '<div class="dev-panel-head"><b>DEV · Sandbox</b>' +
        '<button type="button" class="dev-x" id="dev-close" aria-label="Fechar">x</button></div>' +
        '<div class="dev-panel-body">' +
        panelHtml() +
        "</div>";
      wirePanel(panel);
    } else if (panel && panel.parentNode) {
      panel.parentNode.removeChild(panel);
    }
  }

  function wirePanel(panel) {
    var close = document.getElementById("dev-close");
    if (close)
      close.onclick = function () {
        panelOpen = false;
        mountChrome();
      };

    function bindRange(id, vid) {
      var r = document.getElementById(id);
      var v = document.getElementById(vid);
      if (r && v)
        r.oninput = function () {
          v.textContent = r.value;
        };
    }
    bindRange("dev-energy", "dev-energy-v");
    bindRange("dev-form", "dev-form-v");
    bindRange("dev-conf", "dev-conf-v");
    bindRange("dev-disc", "dev-disc-v");

    var q = document.getElementById("dev-club-q");
    var sel = document.getElementById("dev-club");
    if (q && sel) {
      q.oninput = function () {
        var s = q.value.toLowerCase().trim();
        Array.prototype.forEach.call(sel.options, function (opt) {
          opt.hidden = !!(s && opt.text.toLowerCase().indexOf(s) < 0);
        });
      };
    }

    bindClubSearch("dev-base-q", "#dev-base-list");
    Array.prototype.forEach.call(panel.querySelectorAll("[data-base-club]"), function (b) {
      b.onclick = function () {
        startAcademyAt(b.getAttribute("data-base-club"));
      };
    });

    function flag(id, key, label) {
      var el = document.getElementById(id);
      if (!el) return;
      el.onchange = function () {
        DEV.flags[key] = !!el.checked;
        persist();
        toast(label + (el.checked ? " ON" : " OFF"));
      };
    }
    flag("dev-f-inj", "ignoreInjury", "Ignorar lesao");
    flag("dev-f-tr", "alwaysTransfers", "Sempre ofertas");
    flag("dev-f-god", "godGrowth", "God growth");

    Array.prototype.forEach.call(panel.querySelectorAll("[data-dev]"), function (b) {
      b.onclick = function () {
        var act = b.getAttribute("data-dev");
        if (act === "ovr") {
          setOvrPot(
            (document.getElementById("dev-ovr") || {}).value,
            (document.getElementById("dev-pot") || {}).value
          );
        } else if (act === "destiny") {
          var dEl = document.getElementById("dev-destiny");
          var id = dEl ? dEl.value : "";
          if (!id) {
            DEV.flags.nextDestiny = null;
            persist();
            toast("Proxima carreira: roll aleatorio");
          } else if (S && S.clubId) {
            DEV.flags.nextDestiny = id;
            persist();
            setDestinyId(id);
          } else {
            DEV.flags.nextDestiny = id;
            persist();
            toast("Proxima carreira: " + (DESTINY[id] ? DESTINY[id].label : id));
          }
        } else if (act === "age") {
          setAge((document.getElementById("dev-age") || {}).value);
        } else if (act === "vitals") {
          setVitals(
            (document.getElementById("dev-energy") || {}).value,
            (document.getElementById("dev-form") || {}).value,
            (document.getElementById("dev-conf") || {}).value,
            (document.getElementById("dev-disc") || {}).value
          );
        } else if (act === "trophies") {
          forceTrophies({
            league: !!(document.getElementById("dev-t-lg") || {}).checked,
            cup: !!(document.getElementById("dev-t-cup") || {}).checked,
            continental: !!(document.getElementById("dev-t-cont") || {}).checked,
            clubWorld: !!(document.getElementById("dev-t-cwc") || {}).checked,
            world: !!(document.getElementById("dev-t-wc") || {}).checked,
            copaAm: !!(document.getElementById("dev-t-ca") || {}).checked,
            euro: !!(document.getElementById("dev-t-eu") || {}).checked
          });
        } else if (act === "awards") {
          giveAwards({
            balon: !!(document.getElementById("dev-a-balon") || {}).checked,
            bota: !!(document.getElementById("dev-a-bota") || {}).checked,
            luva: !!(document.getElementById("dev-a-luva") || {}).checked,
            mvp: !!(document.getElementById("dev-a-mvp") || {}).checked,
            force: !!(document.getElementById("dev-a-force") || {}).checked
          });
        } else if (act === "club") {
          var sEl = document.getElementById("dev-club");
          if (sEl) jumpClub(sEl.value);
        } else if (act === "nt") {
          forceNT(
            (document.getElementById("dev-nt-apps") || {}).value,
            (document.getElementById("dev-nt-goals") || {}).value
          );
        } else if (act === "finish") finishSeason();
        else if (act === "y1") plusYear();
        else if (act === "a30") jumpAge(30);
        else if (act === "a35") jumpAge(35);
        else if (act === "retire") jumpAge(99);
        else if (act === "apex") maxApex();
        else if (act === "break") triggerBreakthrough();
        else if (act === "rescind") forceRescission();
        else if (act === "substances") forceSubstances();
        else if (act === "reload") location.reload();
        else if (act === "new") {
          if (typeof go === "function") go("new");
          else location.reload();
        } else if (act === "lock") {
          DEV.unlocked = false;
          panelOpen = false;
          persist();
          mountChrome();
          toast("Sandbox OFF");
        }
      };
    });
  }

  function afterRender() {
    bindSecrets(document.getElementById("app"));
    mountChrome();
  }

  DEV.startAcademyAt = startAcademyAt;

  load();
  loadLock();
  persist();
  global.DEV = DEV;
  global.devAfterRender = afterRender;
})(typeof window !== "undefined" ? window : this);

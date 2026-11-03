/* The demo flow. State lives in memory only. Nothing here calls a server or sends anything.
   Motion is cosmetic: every state change also happens with no animation, so the flow still works
   when animation is reduced or the tab is hidden. */
(function () {
  "use strict";

  var SLIDE = 900;     // sheet slides into the wall
  var IMPACT = 640;    // the moment it hits, long enough to read on video
  var BUMP = 10;       // how far the wall gives, large enough to survive compression
  var EXIT = 480;      // sheet passes behind the wall
  var COLLAPSE = 300;  // the finished strip closes up on the plate
  var STAGGER = 120;   // gap between source lines appearing

  var $ = function (id) { return document.getElementById(id); };
  var motionOff = window.matchMedia("(prefers-reduced-motion: reduce)");
  var moving = function () { return !motionOff.matches && !document.hidden; };

  var showAll = false, tasks, openId, touched, toast, shownCount = null, pending = null, timer = null;

  function start() {
    tasks = JSON.parse(JSON.stringify(window.REAL.tasks));
    tasks.forEach(function (t) { t.done = false; t.blankValue = ""; });
    openId = null; touched = false; toast = null;
  }

  var left = function () { return tasks.filter(function (t) { return !t.done; }); };
  var current = function () { return tasks.find(function (t) { return t.id === openId; }) || null; };
  var hasBlank = function (t) { return (t.body || []).some(function (b) { return b && b.blank; }); };
  var blankOpen = function (t) { return hasBlank(t) && !t.blankValue.trim(); };

  function phase() {
    if (!touched) return "rest";
    if (openId) return "review";
    return left().length ? "offer" : "clear";
  }

  function el(tag, attrs) {
    var node = document.createElement(tag);
    Object.keys(attrs || {}).forEach(function (k) {
      if (k === "class") node.className = attrs[k];
      else if (k === "text") node.textContent = attrs[k];
      else if (k.slice(0, 2) === "on") node.addEventListener(k.slice(2), attrs[k]);
      else node.setAttribute(k, attrs[k]);
    });
    for (var i = 2; i < arguments.length; i++) if (arguments[i]) node.appendChild(arguments[i]);
    return node;
  }

  /* Timed steps. flush() finishes any step in progress, so clicks never stack up. */
  function later(ms, fn) {
    flush();
    if (!moving()) { fn(); return; }
    pending = fn;
    timer = setTimeout(function () { pending = null; fn(); }, ms);
  }

  function flush() {
    if (!pending) return;
    clearTimeout(timer);
    var fn = pending;
    pending = null;
    fn();
  }

  /* Plate */
  function slip(t, offered) {
    var forms = { sheet: "sheet-form", card: "card" };
    var node = el("button", {
      class: "slip " + forms[t.form],
      type: "button",
      "data-id": t.id,
      onclick: function () { pick(t.id); }
    },
      el("span", { class: "t", text: t.title }),
      el("span", { class: "st" },
        el("span", { class: "s", text: t.status }),
        el("span", { class: "m", text: t.meta })
      )
    );
    if (!offered) {
      node.style.setProperty("--tilt", t.r + "deg");
      node.style.setProperty("--x", t.x);
      node.style.setProperty("--y", t.y);
      node.style.setProperty("--tilt-strip", t.rs + "deg");
    }
    return node;
  }

  function renderPlate() {
    var open = left();
    var p = phase();
    var n = open.length;
    $("count").textContent = p === "rest"
      ? n + (n === 1 ? " thing is" : " things are") + " waiting on you."
      : n + " left";
    if (shownCount !== null && n !== shownCount) flashCount();
    shownCount = n;

    var pile = $("pile");
    pile.textContent = "";
    var cap = showAll ? n : (p === "rest" ? 8 : 6);
    open.slice(0, cap).forEach(function (t, i) {
      var s = slip(t);
      if (p === "rest" && i === 0) s.appendChild(el("span", { class: "cta", text: "See the work" }));
      if (t.id === openId) s.setAttribute("aria-current", "true");
      pile.appendChild(el("li", null, s));
    });
    if (n > cap || showAll) {
      pile.appendChild(el("li", { class: "more-li" }, el("button", {
        class: "more-btn", type: "button",
        text: showAll ? "Show fewer" : "+ " + (n - cap) + " more on your plate",
        onclick: function () { showAll = !showAll; renderPlate(); }
      })));
    }
  }

  function flashCount() {
    if (!moving()) return;
    $("count").animate([
      { backgroundColor: "#FFC21A", color: "#0C1F1D" },
      { backgroundColor: "#FFC21A", color: "#0C1F1D", offset: .6 },
      { backgroundColor: "transparent", color: "#F7FAF8" }
    ], { duration: 600 });
  }

  /* The sheet */
  function editable(text, label, onChange) {
    return el("p", {
      class: "ed",
      contenteditable: "plaintext-only",
      role: "textbox",
      "aria-label": label,
      spellcheck: "false",
      text: text,
      oninput: function (e) { onChange(e.target.innerText); }
    });
  }

  function blankBlock(t, b, i) {
    var field = el("input", {
      class: "blank-field",
      id: "blank",
      type: "text",
      placeholder: b.blank,
      "aria-label": "Your swap partner's name",
      autocomplete: "off",
      spellcheck: "false",
      oninput: function (e) {
        t.blankValue = e.target.value;
        fitBlank(e.target, b.blank);
        syncButton(t);
      },
      onkeydown: function (e) {
        if (e.key !== "Enter") return;
        e.preventDefault(); // Enter moves to the button. It must not press it, so approving stays a choice.
        if (!blankOpen(t)) $("wall-btn").focus({ preventScroll: true });
      }
    });
    field.value = t.blankValue;
    fitBlank(field, b.blank);

    var edit = function (key, name) {
      return el("span", {
        class: "ed",
        contenteditable: "plaintext-only",
        role: "textbox",
        "aria-label": name,
        spellcheck: "false",
        text: b[key],
        oninput: function (e) { t.body[i][key] = e.target.innerText; }
      });
    };

    return el("p", null, edit("before", "Text before the blank"), field, edit("after", "Text after the blank"));
  }

  function fitBlank(field, placeholder) {
    if (window.CSS && CSS.supports("field-sizing", "content")) return;
    field.style.width = Math.max(field.value.length, placeholder.length) + 1 + "ch";
  }

  function sheetFor(t) {
    var sheet = el("article", { class: "sheet", id: "sheet", "aria-label": "Finished work" });
    sheet.appendChild(el("p", { class: "run", text: "Conscience's " + t.made + ". Prepared in Neal's account." }));

    (t.fields || []).forEach(function (f) {
      var input = el("input", {
        type: "text",
        autocomplete: "off",
        spellcheck: "false",
        oninput: function (e) { f.value = e.target.value; }
      });
      input.value = f.value;
      sheet.appendChild(el("label", { class: "field" }, el("span", { text: f.label }), input));
    });

    if (t.heading) sheet.appendChild(el("h3", { text: t.heading }));

    var letter = el("div", { class: "letter" });

    (t.body || []).forEach(function (b, i) {
      if (typeof b === "string") {
        letter.appendChild(editable(b, "Paragraph " + (i + 1) + " of the draft", function (v) { t.body[i] = v; }));
      } else if (b.blank) {
        letter.appendChild(blankBlock(t, b, i));
      } else {
        letter.appendChild(el("div", { class: b.label.length <= 3 ? "row num" : (b.text.length > 80 ? "row stack" : "row") },
          el("strong", { text: b.label }),
          editable(b.text, b.label, function (v) { b.text = v; })
        ));
      }
    });

    if (t.link) {
      letter.appendChild(el("p", { class: "fake-link", text: t.link.text }));
      letter.appendChild(el("p", { class: "note", text: t.link.note }));
      letter.appendChild(el("p", { class: "left-title", text: "What's left for you" }));
      var list = el("ul", { class: "left-list" });
      t.left.forEach(function (item) { list.appendChild(el("li", { text: item })); });
      letter.appendChild(list);
    }

    if (t.plain) sheet.appendChild(el("p", { class: "plainly", text: t.plain }));
    else sheet.appendChild(letter);

    return sheet;
  }

  function readFor(t) {
    var col = el("div", { class: "read" });
    col.appendChild(el("h2", null,
      el("span", { class: "sign", "aria-hidden": "true", text: "2" }),
      document.createTextNode("What it read")
    ));
    if (!t.read.length) {
      col.appendChild(el("p", { class: "none", text: "Nothing to read for this one." }));
      return col;
    }
    var list = el("ul");
    t.read.forEach(function (r) {
      list.appendChild(el("li", null,
        el("span", { class: "src", text: r.source + ":" }),
        el("span", { class: "fact", text: r.fact })
      ));
    });
    if (t.missing) {
      list.appendChild(el("li", { class: "missing" },
        el("span", { class: "src", text: "Couldn't find:" }),
        el("span", { class: "fact", text: t.missing })
      ));
    }
    col.appendChild(list);
    return col;
  }

  /* Work lane */
  function renderWork() {
    var body = $("work-body");
    var p = phase();
    var t = current();
    body.textContent = "";

    if (p === "rest") {
      body.appendChild(el("div", { class: "lane" },
        el("h2", null,
          el("span", { class: "sign", "aria-hidden": "true", text: "2" }),
          document.createTextNode("Conscience does the work")
        ),
        el("p", { text: "Pick anything on your plate. You'll see what Conscience read and the work it finished." }),
        el("div", { class: "peek", "aria-hidden": "true" }, el("p", { text: "Neal's account" }))
      ));
    } else if (p === "review") {
      body.appendChild(el("div", { class: "opened" },
        readFor(t),
        el("div", { class: "desk" }, sheetFor(t))
      ));
    } else if (p === "offer") {
      var next = slip(left()[0], true);
      next.appendChild(el("span", { class: "cta", text: "See the work" }));
      next.id = "next";
      body.appendChild(el("div", { class: "offer" }, el("h2", { text: "Next on your plate" }), next));
    } else {
      body.appendChild(el("div", { class: "clear" },
        el("p", { text: "Conscience has nothing left to prepare. Sending is yours." }),
        el("button", { class: "solid-btn", id: "again", type: "button", text: "Start over", onclick: reset })
      ));
    }

    var box = $("toast");
    box.textContent = "";
    if (toast) {
      box.appendChild(el("span", { text: toast.text }));
      box.appendChild(el("button", { type: "button", text: "Undo", onclick: undo }));
    }
  }

  /* Wall */
  function wallRest() {
    $("wall-line").textContent = "The last step is yours.";
    $("wall-note").hidden = true;
    $("wall-btn").hidden = true;
    $("wall-skip").hidden = true;
  }

  function wallClear() {
    wallRest();
    $("wall-line").textContent = "Nothing left to approve.";
  }

  function wallTurn(t) {
    $("wall-line").textContent = "Your turn.";
    $("wall-note").hidden = false;
    $("wall-btn").hidden = false;
    $("wall-skip").hidden = false;
    syncButton(t);
  }

  function syncButton(t) {
    var btn = $("wall-btn");
    if (blankOpen(t)) {
      btn.textContent = "Fill in the blank first";
      btn.setAttribute("aria-disabled", "true");
      $("wall-note").textContent = t.wall;
    } else {
      btn.textContent = t.action;
      btn.removeAttribute("aria-disabled");
      $("wall-note").textContent = t.wallFilled || t.wall;
    }
  }

  function focusFor(t) {
    var target = blankOpen(t) ? $("blank") : $("wall-btn");
    if (target) target.focus({ preventScroll: window.innerWidth >= 900 });
  }

  function render() {
    document.body.dataset.phase = phase();
    renderPlate();
    renderWork();
  }

  /* The stop: the sheet hits the wall, the wall gives BUMP px and settles. */
  function pressIntoWall() {
    var sheet = $("sheet");
    var wall = $("wall");
    if (!sheet || window.innerWidth < 900) return;
    var from = -Math.round(sheet.offsetWidth * 0.82);
    var hit = IMPACT / SLIDE;
    var slide = sheet.animate([
      { transform: "translateX(" + from + "px)", easing: "cubic-bezier(.5,0,.9,.55)" },
      { transform: "translateX(" + BUMP + "px)", offset: hit, easing: "ease-out" },
      { transform: "translateX(0)" }
    ], { duration: SLIDE });
    var bump = wall.animate([
      { transform: "translateX(0)" },
      { transform: "translateX(0)", offset: hit - 0.01, easing: "linear" },
      { transform: "translateX(" + BUMP + "px)", offset: hit, easing: "ease-out" },
      { transform: "translateX(0)" }
    ], { duration: SLIDE });
    // A paused page stalls animations, so end them on a timer and the sheet never stays mid-slide.
    setTimeout(function () { slide.finish(); bump.finish(); }, SLIDE + 60);
  }

  /* Sources appear one at a time, so the eye can follow them. */
  function revealSources() {
    document.querySelectorAll(".read li").forEach(function (item, i) {
      item.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 240, delay: i * STAGGER, fill: "backwards" });
    });
  }

  /* The finished strip closes up as its sheet passes behind the wall. */
  function collapseStrip(id) {
    var strip = document.querySelector('.pile .slip[data-id="' + id + '"]');
    if (!strip) return;
    var item = strip.parentNode;
    var gap = parseFloat(getComputedStyle(item.parentNode).rowGap) || 0;
    item.animate([
      { height: item.offsetHeight + "px", marginBottom: "0px", opacity: 1 },
      { height: "0px", marginBottom: -gap + "px", opacity: 0 }
    ], { duration: COLLAPSE, delay: EXIT - COLLAPSE, fill: "both" });
  }

  function nudgeBlank() {
    var field = $("blank");
    if (!field) return;
    field.classList.add("nudge");
    setTimeout(function () { field.classList.remove("nudge"); }, 400);
  }

  /* Actions */
  function pick(id) {
    flush();
    var wasOpen = !!openId;
    toast = null;
    openId = id;
    touched = true;
    render();
    var t = current();
    if (!moving()) { wallTurn(t); focusFor(t); return; }
    if (wasOpen) wallTurn(t);
    else wallRest();
    pressIntoWall();
    revealSources();
    if (blankOpen(t)) focusFor(t);
    later(IMPACT, function () {
      wallTurn(t);
      focusFor(t);
    });
  }

  function act() {
    flush();
    var t = current();
    if (!t) return;
    if (blankOpen(t)) { focusFor(t); nudgeBlank(); return; }

    var finish = function () {
      t.done = true;
      openId = null;
      toast = { text: t.toast, id: t.id };
      if (left().length) wallRest();
      else wallClear();
      render();
      var next = $("next") || $("again");
      if (next) next.focus({ preventScroll: window.innerWidth >= 900 });
    };

    var sheet = $("sheet");
    if (moving() && sheet && window.innerWidth >= 900) {
      var dist = window.innerWidth - sheet.getBoundingClientRect().left + 40;
      sheet.animate([
        { transform: "translateX(0)", easing: "cubic-bezier(.55,0,.85,.4)" },
        { transform: "translateX(" + dist + "px)" }
      ], { duration: EXIT, fill: "forwards" });
      collapseStrip(t.id);
      later(EXIT, finish);
    } else {
      finish();
    }
  }

  /* Say no: the review closes and the task stays on the plate, with any edits kept. */
  function notThisOne() {
    flush();
    var id = openId;
    if (!id) return;
    openId = null;
    touched = false;
    toast = null;
    wallRest();
    render();
    var slipNode = document.querySelector('.pile .slip[data-id="' + id + '"]');
    if (slipNode) slipNode.focus({ preventScroll: true });
  }

  function undo() {
    flush();
    if (!toast) return;
    var t = tasks.find(function (x) { return x.id === toast.id; });
    t.done = false;
    pick(t.id);
  }

  function reset() {
    flush();
    start();
    wallRest();
    render();
    var first = document.querySelector(".slip");
    if (first) first.focus({ preventScroll: true });
  }

  $("wall-btn").addEventListener("click", act);
  $("wall-skip").addEventListener("click", notThisOne);
  $("reset").addEventListener("click", reset);
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") notThisOne();
  });

  start();
  render();
})();

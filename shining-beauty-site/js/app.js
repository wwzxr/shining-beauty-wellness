/* Shining Beauty & Wellness — etkileşim katmanı */
(function () {
  "use strict";

  const $ = (s, c) => (c || document).querySelector(s);
  const $$ = (s, c) => Array.from((c || document).querySelectorAll(s));
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ── yıl ── */
  const year = $("#year");
  if (year) year.textContent = new Date().getFullYear();

  /* ── başlık katılaşması ── */
  const head = $("#siteHead");
  const onScroll = () => head.classList.toggle("solid", window.scrollY > 40);
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  /* ── mobil menü ── */
  const burger = $("#navBurger"), nav = $("#siteNav");
  if (burger && nav) {
    const close = () => { nav.classList.remove("open"); burger.setAttribute("aria-expanded", "false"); document.body.classList.remove("nav-open"); document.body.style.overflow = ""; };
    burger.addEventListener("click", () => {
      const open = nav.classList.toggle("open");
      burger.setAttribute("aria-expanded", String(open));
      document.body.classList.toggle("nav-open", open);
      document.body.style.overflow = open ? "hidden" : "";
    });
    $$("a", nav).forEach((a) => a.addEventListener("click", close));
    window.addEventListener("keydown", (e) => e.key === "Escape" && close());
  }

  /* ── scroll reveal ── */
  const rvSel = [
    ".sec-head", ".svc", ".ritual-img", ".ritual-copy .sec-title", ".ritual-steps",
    ".about-copy > p", ".about-grid", ".about-img", ".gal-item", ".rev",
    ".faq-head", ".faq-list", ".book-copy", ".book-form", ".hero-copy > *", ".hero-frame",
  ];
  const targets = [];
  rvSel.forEach((sel) => $$(sel).forEach((el) => targets.push(el)));
  if (!reduce && "IntersectionObserver" in window) {
    targets.forEach((el) => el.classList.add("rv"));
    $$(".svc").forEach((el, i) => { if (i % 2) el.classList.add("rv-d1"); });
    $$(".gal-item").forEach((el, i) => {
      const d = ["", "rv-d1", "rv-d2", "rv-d3"][i % 4];
      if (d) el.classList.add(d);
    });
    const io = new IntersectionObserver(
      (es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }),
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 }
    );
    targets.forEach((el) => io.observe(el));
    // güvenlik ağı: observer çalışmazsa her şey görünür olsun
    setTimeout(() => targets.forEach((el) => el.classList.add("in")), 3500);
    window.addEventListener("scroll", () => targets.forEach((el) => {
      if (el.getBoundingClientRect().top < window.innerHeight - 40) el.classList.add("in");
    }), { passive: true, once: false });
  } else {
    targets.forEach((el) => el.classList.add("in"));
  }

  /* ── hizmet imleç önizlemesi (masaüstü) ── */
  const canHover =
    (window.__peekForce === true ||
      (("ontouchstart" in window ? false : true) && window.matchMedia("(any-hover: hover)").matches)) &&
    window.innerWidth > 900;
  if (canHover && !reduce) {
    const peek = document.createElement("div");
    peek.className = "svc-peek";
    const pimg = document.createElement("img");
    pimg.alt = "";
    peek.appendChild(pimg);
    document.body.appendChild(peek);
    let raf = null, tx = 0, ty = 0;
    const track = (e) => {
      tx = e.clientX; ty = e.clientY;
      if (!raf) raf = requestAnimationFrame(() => { peek.style.translate = tx + "px " + ty + "px"; raf = null; });
    };
    $$(".svc").forEach((row) => {
      row.addEventListener("mouseenter", () => {
        const src = row.dataset.img;
        if (src) { pimg.src = src; peek.classList.add("on"); }
      });
      row.addEventListener("mouseleave", () => peek.classList.remove("on"));
      row.addEventListener("mousemove", track);
    });
  }

  /* ── hizmet → randevu: hizmet seç ── */
  const svcMatch = (want) => {
    const sel = $("#bf-service");
    if (!sel || !want) return;
    const w = want.toLowerCase();
    const opts = $$("option", sel);
    const opt =
      opts.find((o) => w.includes("head") && /head/i.test(o.textContent)) ||
      opts.find((o) => w.includes("masaj") && /masaj/i.test(o.textContent)) ||
      opts.find((o) => w.includes("cilt") && /cilt/i.test(o.textContent)) ||
      opts.find((o) => w.includes("tırnak") && /tırnak/i.test(o.textContent)) ||
      opts.find((o) => w.includes("wellness") && /wellness/i.test(o.textContent)) ||
      opts.find((o) => w.includes("lazer") && /lazer/i.test(o.textContent));
    if (opt) {
      sel.value = opt.value;
      sel.dispatchEvent(new Event("change", { bubbles: true }));
    }
  };
  $$(".svc-go, a.btn[data-service]").forEach((a) => {
    a.addEventListener("click", () => svcMatch(a.dataset.service || ""));
  });

  /* ── WhatsApp randevu formu ── */
  const form = $("#bookForm");
  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const err = $("#formErr");
      const name = $("#bf-name").value.trim();
      const phone = $("#bf-phone").value.trim();
      const consent = $("#bf-consent").checked;
      if (!name || !phone || !consent) { if (err) err.hidden = false; return; }
      if (err) err.hidden = true;
      const service = $("#bf-service").value;
      const when = $("#bf-when").value.trim();
      const note = $("#bf-note").value.trim();
      let msg = "Merhaba Shining Beauty & Wellness 👋\n";
      msg += "Randevu talebim var.\n\n";
      msg += "Ad: " + name + "\nTelefon: " + phone + "\nHizmet: " + service;
      if (when) msg += "\nTarih/Saat: " + when;
      if (note) msg += "\nNot: " + note;
      msg += "\n\nKaynak: web sitesi";
      window.open("https://wa.me/905050719501?text=" + encodeURIComponent(msg), "_blank", "noopener");
    });
  }

  /* ── galeri lightbox ── */
  const lb = $("#lightbox");
  if (lb) {
    const lbImg = $("#lbImg"), lbCap = $("#lbCap"), lbPost = $("#lbPost");
    const close = () => { lb.hidden = true; document.body.style.overflow = ""; };
    $$(".gal-item").forEach((b) => {
      b.addEventListener("click", () => {
        lbImg.src = b.dataset.full;
        lbImg.alt = b.dataset.cap || "";
        lbCap.textContent = b.dataset.cap || "";
        lbPost.href = b.dataset.post || "https://www.instagram.com/shining.beauty.wellness/";
        lb.hidden = false;
        document.body.style.overflow = "hidden";
      });
    });
    $("#lbClose").addEventListener("click", close);
    lb.addEventListener("click", (e) => e.target === lb && close());
    window.addEventListener("keydown", (e) => e.key === "Escape" && !lb.hidden && close());
  }

  /* ── çerez bandı ── */
  const CK = "sbw-consent";
  const banner = $("#cookieBanner");
  let stored = null;
  try { stored = localStorage.getItem(CK); } catch (_) {}
  if (!stored && banner) setTimeout(() => { banner.hidden = false; }, 1400);
  if (banner) {
    $$("[data-cookie]", banner).forEach((b) => {
      b.addEventListener("click", () => {
        try { localStorage.setItem(CK, b.dataset.cookie); } catch (_) {}
        banner.hidden = true;
      });
    });
  }
  const cookieOpen = $("#cookieOpen");
  if (cookieOpen) cookieOpen.addEventListener("click", (e) => { e.preventDefault(); banner.hidden = false; });
})();

(function () {
  var WA = "6285746964006";
  function waUrl(t) { return "https://wa.me/" + WA + "?text=" + encodeURIComponent(t); }

  // salin nomor
  var btn = document.getElementById("copy-wa");
  var num = document.getElementById("wa-num");
  btn.addEventListener("click", function () {
    function selectIt() {
      var r = document.createRange(); r.selectNodeContents(num);
      var s = window.getSelection(); s.removeAllRanges(); s.addRange(r);
      btn.textContent = "Pilih lalu salin";
    }
    try {
      navigator.clipboard.writeText("+6285746964006").then(function () {
        btn.textContent = "Tersalin";
        setTimeout(function () { btn.textContent = "Salin"; }, 1800);
      }, selectIt);
    } catch (e) { selectIt(); }
  });

  // tombol produk mengisi pilihan di formulir
  document.querySelectorAll("[data-product]").forEach(function (a) {
    a.addEventListener("click", function () {
      var sel = document.getElementById("f-produk");
      sel.value = a.getAttribute("data-product");
    });
  });

  // formulir: susun pesan WhatsApp
  var form = document.getElementById("rfq");
  var status = document.getElementById("rfq-status");
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    if (!form.checkValidity()) {
      form.reportValidity();
      status.textContent = "Lengkapi nama serta perusahaan dan negara dulu.";
      return;
    }
    var d = new FormData(form);
    var text = "Halo Nusa Bara Ekspor, saya " + d.get("nama") + " dari " + d.get("asal") +
      ". Saya ingin menanyakan " + d.get("produk") + ", jumlah: " + d.get("jumlah") + "." +
      (d.get("pesan") ? " Catatan: " + d.get("pesan") : "");
    status.innerHTML = "";
    var a = document.createElement("a");
    a.href = waUrl(text); a.target = "_blank"; a.rel = "noopener";
    a.textContent = "Buka WhatsApp dan kirim pesan";
    status.appendChild(document.createTextNode("Pesan sudah siap. "));
    status.appendChild(a);
  });
})();

// animasi saat scroll dan menu aktif
(function () {
  var reduce = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;
  var header = document.querySelector(".site-header");
  var links = document.querySelectorAll(".nav a");
  var ticking = false;
  function onScroll() {
    ticking = false;
    header.classList.toggle("scrolled", window.scrollY > 8);
    var cur = "atas";
    ["produk", "kontak"].forEach(function (id) {
      var el = document.getElementById(id);
      if (el && el.getBoundingClientRect().top <= 140) cur = id;
    });
    if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4) cur = "kontak";
    links.forEach(function (a) { a.classList.toggle("active", a.getAttribute("href") === "#" + cur); });
  }
  window.addEventListener("scroll", function () {
    if (!ticking) { ticking = true; requestAnimationFrame(onScroll); }
  }, { passive: true });
  onScroll();

  if (reduce || !("IntersectionObserver" in window)) return;

  // [selector, jeda antar elemen dalam ms]
  var groups = [
    [".hero .eyebrow", 0], [".hero h1", 0], [".hero .lead", 0], [".hero .cta-row", 0], [".stage", 0],
    [".specstrip > div", 90],
    [".band .eyebrow", 0], [".band .h2", 0], [".band .lead", 0], [".note", 0],
    [".vm article", 120], [".card", 110], [".steps li", 110], [".why > div", 100],
    [".chips-row .chip", 60], [".cta-inner > div", 120], [".info > div", 80],
    ["form.box", 0], [".foot > div", 100]
  ];
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (en) {
      if (!en.isIntersecting) return;
      var el = en.target;
      io.unobserve(el);
      el.classList.add("in");
      var d = parseInt(el.style.getPropertyValue("--d") || "0", 10);
      setTimeout(function () {
        el.classList.remove("reveal", "in");
        el.style.removeProperty("--d");
      }, 1000 + d);
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -6% 0px" });
  var heroOrder = 0;
  groups.forEach(function (g) {
    document.querySelectorAll(g[0]).forEach(function (el, i) {
      if (el.classList.contains("reveal")) return;
      var delay = g[1] * i;
      if (g[0].indexOf(".hero") === 0 || g[0] === ".stage") { delay = heroOrder * 110; heroOrder++; }
      el.style.setProperty("--d", delay + "ms");
      el.classList.add("reveal");
      io.observe(el);
    });
  });
})();

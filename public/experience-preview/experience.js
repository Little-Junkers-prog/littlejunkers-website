(function () {
  "use strict";
  const sizes = {
    11: { name: "The Little Junker", tons: "1 ton" },
    16: { name: "The Mighty Middler", tons: "1.5 tons" },
    21: { name: "The Big Junker", tons: "2 tons" }
  };
  const state = {
    size: null, days: 3, location: "", date: "",
    prices: null, priceStatus: "loading", area: null, areaStatus: "idle"
  };
  const $ = (id) => document.getElementById(id);
  const byAll = (query) => Array.from(document.querySelectorAll(query));
  const currency = (value) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(value);
  let areaTimer = null;
  let areaSequence = 0;

  function fmtDate(value) {
    if (!value) return "Choose a date";
    const parts = value.split("-").map(Number);
    if (parts.length !== 3) return value;
    return new Date(Date.UTC(parts[0], parts[1] - 1, parts[2])).toLocaleDateString("en-US", {
      month: "short", day: "numeric", year: "numeric", timeZone: "UTC"
    });
  }

  function getAreaFee() {
    return state.area && state.area.status === "served" ? state.area.zone.deliveryFee : null;
  }

  function areaMessage() {
    if (!state.location) return "Enter a city or ZIP to check the delivery fee.";
    if (state.areaStatus === "loading") return "Checking " + state.location + "…";
    if (state.areaStatus === "error") return "Could not check the delivery fee. Call or text us.";
    if (!state.area) return "Enter a city or ZIP to check the delivery fee.";
    if (state.area.status === "unknown") return "We couldn't confirm this area. Call or text us.";
    if (state.area.status === "split") return "We deliver in " + state.area.label + ", but delivery fees vary by ZIP. We'll confirm the fee with your address.";
    const fee = getAreaFee();
    return "We deliver to " + state.area.label + ". Delivery: " + (fee === 0 ? "free" : currency(fee)) + (state.area.zips.length > 1 ? ". We'll confirm the address before booking." : ".");
  }

  function update() {
    byAll("[data-select-size]").forEach((button) => {
      const selected = Number(button.dataset.selectSize) === state.size;
      button.setAttribute("aria-pressed", selected ? "true" : "false");
      button.classList.toggle("is-selected", selected);
      if (button.classList.contains("size-select")) {
        button.firstChild.textContent = (selected ? "Selected " : "Choose ") + button.dataset.selectSize + "-yard ";
      }
    });
    byAll("[data-card]").forEach((card) => card.classList.toggle("is-selected", Number(card.dataset.card) === state.size));
    const knownPrices = state.prices ? Object.values(state.prices).filter((x) => typeof x === "number" && Number.isFinite(x)) : [];
    const minBase = knownPrices.length ? Math.min.apply(null, knownPrices) : null;
    const base = state.size && state.prices ? state.prices[state.size] : minBase;
    const fee = getAreaFee();
    const estimate = base !== null && typeof base === "number" ? base + (fee ?? 0) : null;

    byAll("[data-base-price]").forEach((element) => {
      const yard = Number(element.getAttribute("data-base-price"));
      element.textContent = state.prices && state.prices[yard] ? currency(state.prices[yard]) : state.priceStatus === "loading" ? "Checking…" : "Unavailable";
    });
    $("summary-size").textContent = state.size ? state.size + "-yard · " + sizes[state.size].name : "Choose a size";
    $("summary-zip").textContent = state.area && state.area.status === "served" ? state.area.label : state.location || "City or ZIP needed";
    $("builder-zip-status").textContent = areaMessage();
    $("summary-date").textContent = fmtDate(state.date);
    $("summary-days").textContent = String(state.days);
    $("summary-base").textContent = base !== null && typeof base === "number" ? currency(base) : "Unavailable";
    $("summary-extras").textContent = state.days === 3 ? "None" : (state.days - 3) + " days · price not yet included";
    $("summary-delivery").textContent = fee !== null ? currency(fee) : "Not yet included";
    $("summary-estimate").textContent = estimate === null ? "Price unavailable" : (state.size ? currency(estimate) : "From " + currency(estimate));
    $("summary-estimate-note").textContent = estimate === null
      ? "Call or text us for current pricing."
      : "Three-day base" + (fee !== null ? " plus delivery." : "; delivery not yet included.") +
        (state.days > 3 ? " Extra-day charges for " + (state.days - 3) + " more days are not yet included." : "") +
        " Your confirmed price and delivery date come before payment.";

    $("days-count").textContent = String(state.days);
    $("days-slider").value = String(state.days);
    $("days-detail").textContent = state.days === 3 ? "3 days included" : "3 included · " + (state.days - 3) + " added";
    $("days-less").disabled = state.days <= 3;
    $("days-more").disabled = state.days >= 30;
    $("mobile-selection").textContent = state.size ? state.size + "-yard · " + state.days + " days" : "See your estimate";
    refreshCompare();
  }

  async function loadPrices() {
    try {
      const response = await fetch("/api/price-estimate");
      if (!response.ok) throw new Error("Pricing unavailable");
      const payload = await response.json();
      if (!payload.success || !payload.prices) throw new Error("Pricing unavailable");
      for (const yard of [11, 16, 21]) {
        if (!(Number(payload.prices[yard]) > 0)) throw new Error("Invalid pricing");
      }
      state.prices = payload.prices;
      state.priceStatus = "ready";
    } catch {
      state.prices = null;
      state.priceStatus = "unavailable";
    }
    update();
  }

  function applyLocation(value, immediate) {
    const query = String(value).trim().slice(0, 60);
    state.location = query;
    state.area = null;
    state.areaStatus = "idle";
    $("builder-zip").value = value.slice(0, 60);
    const version = ++areaSequence;
    if (areaTimer) window.clearTimeout(areaTimer);
    if (query.length < 2 || (/^[0-9]+$/.test(query) && query.length !== 5)) {
      update();
      return;
    }
    state.areaStatus = "loading";
    update();
    areaTimer = window.setTimeout(async () => {
      try {
        const response = await fetch("/api/service-area?q=" + encodeURIComponent(query));
        if (!response.ok) throw new Error("Lookup unavailable");
        const area = await response.json();
        if (version !== areaSequence) return;
        state.area = area;
        state.areaStatus = "done";
      } catch {
        if (version !== areaSequence) return;
        state.area = null;
        state.areaStatus = "error";
      }
      update();
      if (immediate) $("zip-message").textContent = areaMessage();
    }, immediate ? 0 : 450);
  }

  function selectSize(value) {
    const size = Number(value);
    if (![11, 16, 21].includes(size)) return;
    state.size = size;
    update();
  }

  function setDays(value) {
    const count = Number(value);
    if (!Number.isFinite(count)) return;
    state.days = Math.max(3, Math.min(30, Math.round(count)));
    update();
  }

  byAll("[data-select-size]").forEach((button) => {
    button.addEventListener("click", () => {
      selectSize(button.dataset.selectSize);
      if (button.classList.contains("size-select")) $("builder").scrollIntoView({ behavior: "smooth" });
    });
  });
  $("days-less").addEventListener("click", () => setDays(state.days - 1));
  $("days-more").addEventListener("click", () => setDays(state.days + 1));
  $("days-slider").addEventListener("input", (event) => setDays(event.target.value));
  $("builder-zip").addEventListener("input", (event) => applyLocation(event.target.value, false));
  $("hero-zip-form").addEventListener("submit", (event) => {
    event.preventDefault();
    const query = $("hero-zip").value.trim();
    if (query.length < 2) {
      $("zip-message").textContent = "Enter a city or five-digit ZIP.";
      $("hero-zip").focus();
      return;
    }
    applyLocation(query, true);
    $("zip-message").textContent = "Checking your delivery area…";
    $("sizes").scrollIntoView({ behavior: "smooth" });
  });
  $("delivery-date").addEventListener("change", (event) => {
    state.date = event.target.value;
    update();
  });

  const now = new Date();
  now.setHours(12, 0, 0, 0);
  now.setDate(now.getDate() + 1);
  $("delivery-date").min = now.getFullYear() + "-" + String(now.getMonth() + 1).padStart(2, "0") + "-" + String(now.getDate()).padStart(2, "0");

  function refreshCompare() {
    const selectedSize = Number($("compare-size").value);
    const selectedDays = Number($("compare-days").value);
    $("compare-result-size").textContent = String(selectedSize);
    $("compare-included").textContent = sizes[selectedSize].tons;
    const header = document.querySelector(".comparison-row.owned h3");
    if (header && header.lastChild) header.lastChild.textContent = "-yard " + sizes[selectedSize].name;
    $("compare-result-price").textContent = state.prices && state.prices[selectedSize] ? currency(state.prices[selectedSize]) : "Unavailable";
    $("compare-disclaimer").textContent = selectedDays === 3
      ? "Three-day starting price shown. Delivery fees are calculated using your city or ZIP."
      : "Three-day starting price shown. Additional-day charges for " + (selectedDays - 3) + " days aren't included yet.";
  }
  $("compare-size").addEventListener("change", refreshCompare);
  $("compare-days").addEventListener("change", refreshCompare);
  $("compare-to-builder").addEventListener("click", () => {
    selectSize($("compare-size").value);
    setDays($("compare-days").value);
    $("builder").scrollIntoView({ behavior: "smooth" });
  });

  function openDialog(id) {
    const node = $(id);
    if (node && typeof node.showModal === "function") node.showModal();
  }
  byAll("[data-close-dialog]").forEach((button) => button.addEventListener("click", () => $(button.dataset.closeDialog).close()));
  byAll("dialog").forEach((node) => node.addEventListener("click", (event) => { if (event.target === node) node.close(); }));
  $("quote-more").addEventListener("click", () => openDialog("quote-modal"));
  $("preview-checkout").addEventListener("click", () => {
    const missing = [];
    if (!state.location) missing.push("a city or ZIP");
    if (!state.size) missing.push("a dumpster size");
    if (!state.date) missing.push("a delivery date");
    if (missing.length) {
      $("builder-validation").textContent = "Please enter " + missing.join(", ") + ".";
      if (!state.location) $("builder-zip").focus();
      return;
    }
    if (state.area && state.area.status === "unknown") {
      $("builder-validation").textContent = "We couldn't confirm that delivery area. Call or text us for help.";
      return;
    }
    $("builder-validation").textContent = "";
    const description = state.size + "-yard " + sizes[state.size].name + " · " + state.days + " days · " + fmtDate(state.date) + " · " + state.location;
    $("modal-rental-details").textContent = description;
    $("review-rental-details").textContent = description;
    showCheckoutPanel("details");
    openDialog("checkout-modal");
  });
  function showCheckoutPanel(which) {
    const review = which === "review";
    $("checkout-details").hidden = review;
    $("checkout-review").hidden = !review;
    $("detail-progress").classList.toggle("active", !review);
    $("review-progress").classList.toggle("active", review);
  }
  $("go-review").addEventListener("click", () => showCheckoutPanel("review"));
  $("back-details").addEventListener("click", () => showCheckoutPanel("details"));
  update();
  loadPrices();
})();

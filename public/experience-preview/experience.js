
(function () {
  'use strict';
  const sizes = {
    11: { name: 'The Little Junker', base: 325, tons: '1 ton' },
    16: { name: 'The Mighty Middler', base: 375, tons: '1.5 tons' },
    21: { name: 'The Big Junker', base: 425, tons: '2 tons' }
  };
  const state = { zip: '', size: null, days: 3, date: '' };
  const $ = (id) => document.getElementById(id);
  const byAll = (query) => Array.from(document.querySelectorAll(query));
  const format = (n) => '$' + Number(n).toLocaleString('en-US');
  function fmtDate(date) {
    if (!date) return 'Not selected';
    const parts = date.split('-').map(Number);
    if (parts.length !== 3) return 'Not selected';
    return new Date(parts[0], parts[1] - 1, parts[2]).toLocaleDateString('en-US', { month:'short', day:'numeric', year:'numeric'});
  }
  function update() {
    byAll('[data-select-size]').forEach(function (b) {
      const yes = Number(b.dataset.selectSize) === state.size;
      b.setAttribute('aria-pressed', yes ? 'true' : 'false');
      b.classList.toggle('is-selected', yes);
      if (b.classList.contains('size-select')) {
        b.firstChild.textContent = yes ? 'Selected ' + state.size + '-yard ' : 'Choose ' + b.dataset.selectSize + '-yard ';
      }
    });
    byAll('[data-card]').forEach(function (card) { card.classList.toggle('is-selected', Number(card.dataset.card) === state.size); });
    $('days-count').textContent = String(state.days);
    $('days-slider').value = String(state.days);
    $('days-detail').textContent = '3 included · ' + (state.days-3) + ' added';
    $('days-less').disabled = state.days <= 3;
    $('days-more').disabled = state.days >= 30;
    $('summary-size').textContent = state.size ? state.size + '-yard · ' + sizes[state.size].name : 'Choose a size';
    $('summary-zip').textContent = state.zip || 'Not entered';
    $('summary-date').textContent = fmtDate(state.date);
    $('summary-days').textContent = String(state.days);
    $('summary-base').textContent = state.size ? format(sizes[state.size].base) + ' *' : 'Choose a size';
    $('summary-extras').textContent = (state.days-3) + ' extra · rate not yet approved';
    $('mobile-selection').textContent = state.size ? state.size + '-yard · ' + state.days + ' days' : 'Find your dumpster';
    $('builder-zip-status').textContent = state.zip ? 'ZIP ' + state.zip + ' saved for this concept. Live zone validation is not connected.' : 'Enter a ZIP above or use one from the homepage.';
  }
  function selectSize(val) {
    state.size = Number(val);
    update();
  }
  byAll('[data-select-size]').forEach(function (button) {
    button.addEventListener('click', function () {
      selectSize(button.dataset.selectSize);
      if (button.classList.contains('size-select')) document.getElementById('builder').scrollIntoView({behavior:'smooth'});
    });
  });
  function setDays(val) {
    const n = Number(val);
    if (!Number.isFinite(n)) return;
    state.days = Math.min(30, Math.max(3, Math.round(n)));
    update();
  }
  $('days-less').addEventListener('click', function () { setDays(state.days-1); });
  $('days-more').addEventListener('click', function () { setDays(state.days+1); });
  $('days-slider').addEventListener('input', function (event) { setDays(event.target.value); });
  const now = new Date();
  now.setHours(12, 0, 0, 0);
  now.setDate(now.getDate() + 1);
  const year = String(now.getFullYear());
  const month = String(now.getMonth()+1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  $('delivery-date').min = year + '-' + month + '-' + day;
  $('delivery-date').addEventListener('change', function (event) { state.date = event.target.value; update(); });
  $('builder-zip').addEventListener('input', function (event) {
    const raw = String(event.target.value).replace(/[^0-9]/g, '').slice(0,5);
    event.target.value = raw;
    state.zip = raw.length === 5 ? raw : '';
    update();
  });
  $('hero-zip-form').addEventListener('submit', function (event) {
    event.preventDefault();
    const raw = String($('hero-zip').value).replace(/[^0-9]/g, '').slice(0,5);
    if (!/^[0-9]{5}$/.test(raw)) {
      $('zip-message').textContent = 'Enter a five-digit ZIP to continue.';
      $('hero-zip').focus(); return;
    }
    state.zip = raw;
    $('builder-zip').value = raw;
    $('zip-message').textContent = 'ZIP ' + raw + ' saved for the preview — service availability still needs verification.';
    update();
    $('sizes').scrollIntoView({behavior:'smooth'});
  });
  $('compare-size').addEventListener('change', refreshCompare);
  $('compare-days').addEventListener('change', refreshCompare);
  function refreshCompare() {
    const s = Number($('compare-size').value);
    const n = Number($('compare-days').value);
    $('compare-result-size').textContent = String(s);
    $('compare-included').textContent = sizes[s].tons;
    $('compare-result-price').textContent = format(sizes[s].base);
    const rowTitle = document.querySelector('.comparison-row.owned h3');
    if (rowTitle && rowTitle.lastChild) rowTitle.lastChild.textContent = '-yard ' + sizes[s].name;
    $('compare-disclaimer').textContent = n === 3
      ? 'This is the current 3-day base snapshot, not a final delivered quote. Competitor observations remain unverified.'
      : 'For ' + n + ' days, the approved additional-day rate is still pending. We will not show a made-up quote or comparison total.';
  }
  $('compare-to-builder').addEventListener('click', function () {
    selectSize($('compare-size').value);
    setDays($('compare-days').value);
    $('builder').scrollIntoView({behavior:'smooth'});
  });
  function openDialog(id) {
    const el = $(id);
    if (el && typeof el.showModal === 'function') el.showModal();
  }
  byAll('[data-close-dialog]').forEach(function (button) {
    button.addEventListener('click', function () { $(button.dataset.closeDialog).close(); });
  });
  byAll('dialog').forEach(function (dialog) {
    dialog.addEventListener('click', function (event) { if (event.target === dialog) dialog.close(); });
  });
  $('quote-more').addEventListener('click', function () { openDialog('quote-modal'); });
  $('preview-checkout').addEventListener('click', function () {
    const issues=[];
    if(!state.zip)issues.push('a five-digit service ZIP');
    if(!state.size)issues.push('a dumpster size');
    if(!state.date)issues.push('a desired delivery date');
    if(issues.length) {
      $('builder-validation').textContent = 'Before the preview, add ' + issues.join(', ') + '.';
      if(!state.zip)$('builder-zip').focus();
      return;
    }
    $('builder-validation').textContent = '';
    const desc = state.size + '-yard ' + sizes[state.size].name + ' · ' + state.days + ' days · ' + fmtDate(state.date) + ' · ZIP ' + state.zip;
    $('modal-rental-details').textContent = desc;
    $('review-rental-details').textContent = desc;
    showCheckoutPanel('details');
    openDialog('checkout-modal');
  });
  function showCheckoutPanel(which) {
    const review = which === 'review';
    $('checkout-details').hidden = review;
    $('checkout-review').hidden = !review;
    $('detail-progress').classList.toggle('active', !review);
    $('review-progress').classList.toggle('active', review);
  }
  $('go-review').addEventListener('click', function () { showCheckoutPanel('review'); });
  $('back-details').addEventListener('click', function () { showCheckoutPanel('details'); });
  refreshCompare();
  update();
})();

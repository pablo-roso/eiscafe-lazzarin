/* ============================================================
   Eiscafé Lazzarin — Seitenlogik
   Zwei Häuser mit verschiedenen Zeiten, und die Rathausgasse
   wechselt zwischen Sommer- und Winterzeit. Beides rechnet die
   Seite selbst aus, damit niemand rechnen muss.
   ============================================================ */
(function () {
  'use strict';

  var toggle = document.getElementById('navToggle');
  var nav = document.getElementById('mainNav');
  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      var open = nav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      toggle.setAttribute('aria-label', open ? 'Menü schließen' : 'Menü öffnen');
    });
    nav.addEventListener('click', function (e) {
      if (e.target.tagName !== 'A') return;
      nav.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
    });
  }

  var now = new Date();
  var day = now.getDay();
  var month = now.getMonth() + 1;            // 1 = Januar
  var dec = now.getHours() + now.getMinutes() / 60;
  var summer = month >= 4 && month <= 10;    // April bis Oktober

  // Münsterplatz: ganzjährig gleich, samstags eine halbe Stunde länger.
  var MUENSTER = { 1: [9, 20.5], 2: [9, 20.5], 3: [9, 20.5], 4: [9, 20.5], 5: [9, 20.5], 6: [9, 21], 0: [9, 20.5] };
  // Rathausgasse: Mo–Sa ab 8, So ab 9; Ende je nach Saison.
  var rgClose = summer ? 21 : 20;
  var RATHAUS = {};
  [1, 2, 3, 4, 5, 6].forEach(function (d) { RATHAUS[d] = [8, rgClose]; });
  RATHAUS[0] = [9, rgClose];

  function fmt(v) {
    var h = Math.floor(v), m = Math.round((v - h) * 60);
    return h + ':' + (m < 10 ? '0' + m : m);
  }

  function openNow(table) {
    var slot = table[day];
    return !!(slot && dec >= slot[0] && dec < slot[1]);
  }

  var mOpen = openNow(MUENSTER);
  var rOpen = openNow(RATHAUS);

  var label;
  if (mOpen && rOpen) {
    label = 'Beide Häuser geöffnet — Rathausgasse bis ' + fmt(RATHAUS[day][1]) + ' Uhr';
  } else if (mOpen) {
    label = 'Münsterplatz geöffnet — bis ' + fmt(MUENSTER[day][1]) + ' Uhr';
  } else if (rOpen) {
    label = 'Rathausgasse geöffnet — bis ' + fmt(RATHAUS[day][1]) + ' Uhr';
  } else {
    var first = Math.min(MUENSTER[day][0], RATHAUS[day][0]);
    label = dec < first
      ? 'Noch geschlossen — heute ab ' + fmt(RATHAUS[day][0]) + ' Uhr in der Rathausgasse'
      : 'Für heute geschlossen — morgen wieder ab ' + fmt(8) + ' Uhr';
  }

  var badge = document.getElementById('statusBadge');
  var text = document.getElementById('statusText');
  if (badge && text) {
    badge.hidden = false;
    badge.classList.add(mOpen || rOpen ? 'is-open' : 'is-closed');
    text.textContent = label;
  }

  var headerStatus = document.getElementById('headerStatus');
  if (headerStatus) {
    headerStatus.hidden = false;
    headerStatus.textContent = mOpen || rOpen ? 'jetzt geöffnet' : 'gerade geschlossen';
    if (mOpen || rOpen) headerStatus.classList.add('is-open');
  }

  /* Saisonzeiten der Rathausgasse überall eintragen, damit nirgends
     eine Zeit steht, die gerade nicht gilt. */
  var seasonLabel = summer ? 'April – Oktober' : 'November – März';
  var tag = document.getElementById('seasonTag');
  if (tag) tag.textContent = seasonLabel;

  var note = document.getElementById('seasonNote');
  if (note) {
    note.textContent = 'Die Rathausgasse hat eine Sommer- und eine Winterzeit. Gerade gilt: '
      + seasonLabel + ', also bis ' + fmt(rgClose) + ' Uhr.';
  }

  var rgCloseCell = document.getElementById('rgClose');
  if (rgCloseCell) rgCloseCell.textContent = fmt(rgClose) + ' Uhr (' + seasonLabel + ')';

  document.querySelectorAll('#hoursRathaus .rg-week').forEach(function (el) {
    el.textContent = '8:00 – ' + fmt(rgClose);
  });
  document.querySelectorAll('#hoursRathaus .rg-sun').forEach(function (el) {
    el.textContent = '9:00 – ' + fmt(rgClose);
  });

  ['hoursMuenster', 'hoursRathaus'].forEach(function (id) {
    var list = document.getElementById(id);
    if (!list) return;
    var row = list.querySelector('[data-day="' + day + '"]');
    if (row) row.classList.add('is-today');
  });

  var year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();
})();

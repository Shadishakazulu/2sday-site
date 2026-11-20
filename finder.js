// "Sign in to your store": finds a store in /stores.json by name and sends staff and clients to that store's own address.
// A store that isn't open yet ("live": false) is shown as opening soon, so nobody lands on an address that doesn't work.
(() => {
  const form = document.getElementById('finder'); const q = document.getElementById('storeq'); const out = document.getElementById('finderOut');
  const yr = document.getElementById('yr'); if (yr) yr.textContent = new Date().getFullYear();
  if (!form) return;
  let stores = null;
  const norm = (s) => String(s || '').toLowerCase().normalize('NFKD').replace(/[̀-ͯ]/g, '').replace(/&/g, ' and ').replace(/[^a-z0-9]+/g, ' ').replace(/\b(the|jewelers?|jewelry|jewellers?|inc|llc|co)\b/g, ' ').trim();
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  async function load() {
    if (stores) return stores;
    try { const r = await fetch('/stores.json', { cache: 'no-cache' }); stores = (await r.json()).stores || []; } catch { stores = []; }
    return stores;
  }
  function find(list, text) {
    const t = norm(text); if (!t) return [];
    return list.filter((s) => [s.name, s.slug, ...(s.aliases || [])].some((n) => { const k = norm(n); return k && (k === t || k.startsWith(t) || t.startsWith(k) || k.includes(t)); }));
  }
  function show(hits, text) {
    if (!text.trim()) { out.innerHTML = ''; return; }
    if (!hits.length) { out.innerHTML = `<p class="none">We couldn't find "${esc(text)}". Check the spelling, or ask your manager for your store's 2SDAY AM address.</p>`; return; }
    out.innerHTML = hits.slice(0, 5).map((s) => {
      const team = `https://${s.slug}.2sday.am`; const vault = s.vault || `${team}/vault`;
      const where = s.place ? ` <span class="place">${esc(s.place)}</span>` : '';
      return s.live
        ? `<div class="hit"><b>${esc(s.name)}</b>${where}<a class="go" href="${esc(team)}">Team sign-in →</a><a class="go" href="${esc(vault)}">Client Vault →</a></div>`
        : `<div class="hit"><b>${esc(s.name)}</b>${where}<span class="soon">Opening soon on 2SDAY AM</span></div>`;
    }).join('');
    try { if (hits.length === 1) localStorage.setItem('2sday-store', hits[0].slug); } catch { /* private window: nothing remembered */ }
  }
  form.addEventListener('submit', async (e) => { e.preventDefault(); show(find(await load(), q.value), q.value); });
  let t = 0;
  q.addEventListener('input', () => { clearTimeout(t); t = setTimeout(async () => { if (q.value.trim().length >= 3) show(find(await load(), q.value), q.value); else out.innerHTML = ''; }, 200); });
  (async () => {   // a returning visitor sees their store straight away
    let slug = null; try { slug = localStorage.getItem('2sday-store'); } catch { /* none */ }
    if (!slug) return;
    const s = (await load()).find((x) => x.slug === slug); if (s) { q.value = s.name; show([s], s.name); }
  })();
})();

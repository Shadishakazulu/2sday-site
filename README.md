# 2sday.am — the 2SDAY AM company site

Static site (no build step): `index.html`, `site.css`, `finder.js`, `stores.json`, `assets/`, plus `thanks.html`, `privacy.html`, `404.html`.

## Deploy (Netlify)
1. New GitHub repo (e.g. `2sday-site`) → push this code.
2. Netlify → Add new site → Import from GitHub → this repo. Build command: none. Publish directory: `.`
3. Domain management → add `2sday.am` (and `www.2sday.am`, redirected to the bare domain by `netlify.toml`).
4. At your domain registrar, point 2sday.am at Netlify (Netlify shows the exact DNS records), or move the domain's DNS to Netlify DNS — needed later for store subdomains.
5. Forms → enable form detection, then redeploy; demo requests appear under Forms → demo. Add an email notification there.

## Stores (`stores.json`)
Each store: `slug` (its subdomain: `herzog` → herzog.2sday.am), `name`, `place`, `aliases`, `live`.
While `live` is false the finder shows "Opening soon" instead of links. Set it to true only once the store's own address works.
Optional `vault` overrides the Vault address (e.g. `https://vault.herzogjewelers.com`).

## Store addresses (later, per store)
- Team: add `herzog.2sday.am` as a custom domain on that store's production staff site.
- Vault: `herzog.2sday.am/vault` is served by a Netlify proxy rule on the staff site to the store's Vault site
  (the Vault app must be set up to run under `/vault`) — or give the Vault its own domain.

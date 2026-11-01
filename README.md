# Shining Beauty & Wellness

Static, single-page website. The website files are kept in `shining-beauty-site/`; no build step or package installation is required.

## Run locally

From the repository root, run:

```powershell
python -m http.server 8000 --directory shining-beauty-site
```

Then open <http://localhost:8000>.

## Deploy to Netlify

Connect this repository to Netlify and deploy the default branch. The root `netlify.toml` publishes `shining-beauty-site/` directly, so no build command is needed. The site expects to be served from the domain root.

The appointment form prepares a WhatsApp message; submitting it opens WhatsApp for the visitor to review and send. Fonts are loaded from Google Fonts.

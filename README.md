# Green Forks Connect: Promotional Site (LMC 3403 Unit 3)

Static single-page site. No build step.

## Run locally
Open `index.html` in a browser, or run `python -m http.server 8000` in this folder and visit http://localhost:8000.

## Edit content
- Copy and sections: `index.html` (each section is commented).
- Colors and fonts: CSS variables at the top of `styles.css`.
- QR code: `assets/qr-proposal.svg` encodes the proposal Drive link.
- Poster reference: `assets/poster.jpg`.

## Deploy to GitHub Pages
1. Push this repo to GitHub (branch `main`).
2. In the repo, go to Settings > Pages.
3. Under "Build and deployment", choose "Deploy from a branch", select `main` and `/ (root)`, then Save.
4. The site will be live at `https://<username>.github.io/<repo-name>/` after a minute or two.

All file paths are relative and `.nojekyll` is included, so it works from a project subpath with no changes.

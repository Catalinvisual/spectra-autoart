# GitHub Pages Configuration

This repository is configured for GitHub Pages deployment.

## Deployment

The site is automatically deployed to GitHub Pages when changes are pushed to the `main` branch.

## Manual Deployment

To deploy manually:
1. Build the client: `cd client && npm run build`
2. Copy dist files to root: `cp -r client/dist/* .`
3. Push to GitHub: `git add . && git commit -m "Deploy to GitHub Pages" && git push origin main`

## GitHub Pages URL

The site will be available at: `https://catalinvisual.github.io/spectra-autoart/`

## Configuration Files

- `.github/workflows/deploy-pages.yml` - GitHub Actions workflow for automatic deployment
- `index.html` - Main entry point (redirects to client/dist/index.html)
- `site.webmanifest` - Web app manifest
- `favicon.ico` - Site favicon
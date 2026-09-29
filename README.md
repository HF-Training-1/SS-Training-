# SS Training — Masterpiece Starter

A premium, mobile-first foundation for a barbering education platform.

## Run locally
Because the project uses ES modules and JSON imports, serve the project root with a local web server rather than opening index.html directly.

Example:
python -m http.server 8080 --directory .
Then open http://localhost:8080/public/

## GitHub Pages
For GitHub Pages, either publish `/public` through a build step or move/copy the public assets to the repository root. The production build should eventually be generated from a proper app build system.

## Next build target
Connect Appwrite for auth/database/storage, then build the three portals against the same API/data model.

# Puppet Talk v0.1

A static, mobile-friendly spoken-story-to-comic prototype. No build step or account required.

## Run

From this directory: `python3 -m http.server 8000` then visit `http://localhost:8000` in Chrome or Edge. Or deploy these three web files to Cloudflare Pages, Netlify, or GitHub Pages. Microphone access generally requires HTTPS (localhost is also allowed).

## Features

- Live speech transcription (Web Speech API), typed fallback
- 10/15/20-second or manual panel creation
- Five art styles passed to the AI prompt
- Character descriptions included in each AI prompt
- Demo illustrations that work without an API token
- Optional Hugging Face image-generation API (experimental, subject to model access/CORS)
- Reorder, regenerate, delete panels
- Export a standalone HTML comic; open it and Print → Save as PDF

## Important limitations

Demo mode generates attractive scene cards, not AI interpretations of spoken scenes. AI mode sends transcript/character descriptions to Hugging Face; it requires an access token and a compatible image-generation endpoint, and may fail due to CORS, model availability or billing. This is not a production-ready AI pipeline. Scene extraction is currently a prompt-based text-to-image approach, not a separate Gemini step. Browser speech recognition may transmit audio to a browser provider. No user accounts or server-side data storage are used; panels are lost on refresh unless exported. Do not embed a permanent API token in deployed frontend code. For reliable public AI generation, use a secure serverless proxy with authentication and rate limits.

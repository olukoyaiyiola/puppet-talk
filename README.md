# Puppet Talk 🎙️📖

**Tell a story. Watch it unfold.**

Puppet Talk is an early-stage storytelling experiment that explores a simple idea: **what if the stories we tell children could become comics as we speak?**

Designed with parents, guardians, siblings, aunts, uncles and young storytellers in mind, Puppet Talk aims to turn shared storytelling into a visual, imaginative experience.

🌐 **Try the prototype:** https://puppet-talk.vercel.app/

## How it works

1. Give your story a title and choose an illustration style.
2. Start speaking (in a supported browser) or type your story.
3. Create panels manually or choose a 10-, 15-, or 20-second interval while narrating.
4. Add character names and descriptions to guide future illustrations.
5. Reorder, regenerate or remove panels.
6. Export your comic as a printable HTML document, which you can save as a PDF from your browser.

## What works in v0.1

- Responsive interface for mobile and desktop
- Browser speech recognition with a text-entry fallback
- Manual and timed panel creation
- Five selectable art styles
- Character description cards
- Demo-mode illustrated scene cards without API credentials
- Panel management and HTML export
- Experimental Hugging Face image-generation option

## Important: prototype limitations

**The default demo illustrations are decorative scene cards, not AI interpretations of your actual story.** The vision is real-time illustrated storytelling; the current version demonstrates the interaction and workflow rather than delivering that full experience.

The optional Hugging Face mode is experimental. It requires your own API token and suitable model access, and may fail because of CORS restrictions, API availability, rate limits or costs. Art styles and character descriptions are passed as prompt guidance, but character consistency is not guaranteed.

Speech recognition availability depends on your browser, device and permissions; some browsers process audio through an external service. The application currently has no accounts or backend persistence, and stories are lost when the page is refreshed unless exported.

**Do not place API keys in public code or share them with others.** A production version should use a secure backend for image-generation requests.

## Run locally

This is a static HTML/CSS/JavaScript project with no installation or build step.

```bash
git clone https://github.com/olukoyaiyiola/puppet-talk.git
cd puppet-talk
python3 -m http.server 8000
```

Open http://localhost:8000 in Chrome or Edge. Microphone access usually requires HTTPS or localhost.

## Project files

- `index.html` — application structure
- `styles.css` — visual design and responsive layout
- `script.js` — transcription, panel creation, character cards and export

## Where it could go next

- AI-generated scenes grounded in the actual spoken narrative
- More reliable, consistent characters across panels
- Editable speech bubbles and comic layouts
- Secure server-side image generation
- Story saving, sharing and child-friendly safeguards

## Feedback welcome

This is an experiment in making storytelling more playful and collaborative. Try the prototype and share what worked, what didn't, and what you would love to see.

**Live:** https://puppet-talk.vercel.app/  
**Source:** https://github.com/olukoyaiyiola/puppet-talk

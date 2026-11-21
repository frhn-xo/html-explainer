# html-explainer

A skill that builds minimal explanation pages and working documents as single HTML files: a sticky
"On this page" sidebar, an always-dark look taken from `DESIGN.md`, swimlane diagrams in panels you
can resize, zoom and drag, blue link pills (underlined ones open the code in VS Code), playable
swimlanes you step through with Reset / Back / Next / Play, and, only when they are needed, a problem
section and a task section.

## Contents

```
skills/html-explainer/
├── SKILL.md              # entry point: keep it minimal, which sections a request gets, workflow, checks
├── references/
│   ├── page.md           # file name, location, sidebar, links, task and Linked pages sections, master and explainer pages
│   ├── writing.md        # the problem section, defining terms, explaining what someone meant
│   ├── DESIGN.md         # the design every page follows (kept always dark, links as blue pills)
│   ├── diagrams.md       # how a swimlane looks, colours, fitting one screen, render check
│   └── playable.md       # playable swimlanes: markup, steps, captions
└── assets/
    ├── template.html     # starter page every new page is copied from
    ├── player.js         # engine for playable diagrams, pasted into a page
    └── player.css        # styles for playable diagrams
```

## Install

Copy or link `skills/html-explainer` into your agent's skills folder.

## The design

Every page follows `skills/html-explainer/references/DESIGN.md`, a design analysis of Clay.com's
website, kept always dark. `assets/template.html` already carries its colours, type and spacing, so a
page looks right even when the agent never opens DESIGN.md; the agent reads it only for a colour or a
piece the template doesn't have.

## Requirements

- Node.js, for the render check: every diagram is rendered with `npx -y @mermaid-js/mermaid-cli@11`
  before a page is called done.
- VS Code, for the file links (they open as `vscode://file/…`).
- The pages load Mermaid 11 from `cdn.jsdelivr.net`, so viewing them needs an internet connection.

## License

MIT, see `LICENSE`.

---
name: html-explainer
description: Builds and edits the user's HTML explanation pages and working documents — master pages, explainer pages, swimlane diagrams and playable swimlanes (step-through with Reset/Back/Next/Play buttons). Use whenever the user says "explain it using HTML", asks for an explanation page, a working document, a swimlane, a playable diagram or any Mermaid diagram, pastes an item from an existing page, or asks to edit one of these pages or mark a task done in it, in any repository.
compatibility: The render check needs Node.js (npx runs @mermaid-js/mermaid-cli); file links open in VS Code; pages load Mermaid 11 from cdn.jsdelivr.net, so viewing them needs network access.
metadata:
  version: "2.2.0"
---

# HTML explainer pages

The user reads these pages in a browser and Cmd+clicks from them straight into VS Code. They understand
a flow from a swimlane much faster than from paragraphs, and they want each page to answer what they
asked and nothing more.

## Files in this skill

- `assets/template.html`: the starting point of every page. Copy it, never write a page from scratch.
- `references/DESIGN.md`: the design every page follows, always in its dark form, with every link a
  blue pill (`references/page.md`, "The look"). Read it when a page needs a colour or a piece the template
  doesn't have.
- `references/page.md`: file name and location, the sidebar, file links, the task section, the Linked
  pages section, master and explainer pages. Read it when creating a page or changing its structure.
- `references/writing.md`: the problem section and any prose. Read it before writing text.
- `references/diagrams.md`: how a swimlane looks and how to check it. Read it before drawing or
  editing any diagram.
- `references/playable.md`, `assets/player.js`, `assets/player.css`: playable swimlanes. Read them when
  the user says "playable", or when editing a page that has a `div.player`.

## The look

Every page follows `references/DESIGN.md`, kept always dark, with every link a blue pill so it stands
out as clickable: underlined for a file, ↗ for another page, neither for a section of the same page
(`references/page.md`, "The look: DESIGN.md, always dark" and "Three kinds of link"). The template already does
this. Every diagram sits in a panel the reader can resize, zoom and drag (`references/diagrams.md`,
"The diagram block").

## Keep the page minimal

A page holds only what the user asked for. Every extra section, table or note is something they have
to read past to find the answer.

- **Sections:** only the ones the request needs. One swimlane with a short paragraph around it is a
  section. Never add a section the user didn't ask for: no summaries, no inventories, no "reasons"
  section, no registers of past decisions.
- **Tables:** only when the user asks for one. Write paragraphs and swimlanes instead.
- **Under a diagram:** nothing. No file list, no notes, no "not drawn" line. If a sentence is needed to
  read the diagram, it goes in the paragraph before it.

## Which sections a request gets

Fit the page to the question:

- **"What is the issue", debugging, fixing a bug:** the **problem section** first
  (`references/writing.md`), holding a swimlane of the bug (on a master page, a playable one,
  `references/playable.md`). Then any further swimlanes the explanation needs.
- **Implementing a feature or fixing a bug, once tasks have been discussed:** a **task section** right
  below the problem section (`references/page.md`, "The task section"). While the user is still
  working out the problem, there are no tasks yet, so there is no task section.
- **"How does this work", "what is this project about":** no problem section, no task section. A
  swimlane of the flow, with short paragraphs where they help.
- **"How would I build something like this":** one section: the usual swimlane for it, what extra
  features could be added, and how to proceed.

- **Any page linked with other pages** (a master and its explainers, or pages the user asks to link):
  a **Linked pages** section at the very bottom (`references/page.md`, "The Linked pages section").

Anything else: answer the question in the fewest sections that answer it.

## Diagrams: swimlanes only

There are two kinds of diagram, and only two:

1. **Swimlane:** a flowchart with one box per actor or system, steps inside the box that does them,
   arrows crossing boxes when the work moves (`references/diagrams.md`).
2. **Playable swimlane:** the same swimlane with Reset / Back / Next / Play buttons, one arrow per press,
   and a caption under it (`references/playable.md`). "Playable", "playable swimlane", "playable
   diagram" and "playable before/after" all mean this. "Swimlane" on its own means a plain one.

Any other request for a diagram ("a Mermaid diagram", "draw the flow", "a diagram of this") gets a
swimlane.

## Workflow

1. **Is this an explainer of a master page?** Grep the ticket's folder for a distinctive
   phrase from the request, even when the user pastes only an item's text and never names the master.
   If it matches, the new page is that master's explainer: use the master's filename prefix and link
   both ways in the same change (`references/page.md`).
2. **Create the file** (`references/page.md`, "The file"), copied from `assets/template.html`. Fill the
   `{{…}}` placeholders, and change the `localStorage` key `toc-open-CHANGE-ME` to one unique to the page.
3. **Decide the sections** from "Which sections a request gets", and write only those.
4. **Draw the swimlanes** (`references/diagrams.md`). Before rendering, list every loop, branch,
   failure path and early return in the covered code, and check each one is drawn.
5. **Link every file reference** with `#L<line>`. Check each path exists and each target line really
   says what the text claims.
6. **Run the checks below,** then report in chat with the page's link (below). If anything the code
   does is left out of a diagram, say so in that reply.

## Checks before saying it is done

- The page has only the sections the request needed: no problem section unless it explains a problem,
  no task section unless tasks were discussed, no table unless one was asked for, nothing under a
  diagram.
- Where the page explains what a person said or wants, its first sentence says what they want, in
  words the user would use (`references/writing.md`, "Explaining what someone meant").
- The page keeps the template's look: always dark, every colour from `references/DESIGN.md`, every
  link a blue pill with its one mark, no `prefers-color-scheme` light theme added back (`references/page.md`, "The look").
- Legends name meanings, not colours ("where it goes wrong", never "ochre = …"); the page has no list
  of its own colours (`references/page.md`).
- Every diagram is a swimlane: the page has no `sequenceDiagram`, `stateDiagram`, `classDiagram` or
  other diagram type.
- Render every diagram with mermaid-cli and look at the PNG (`references/diagrams.md`, "Render to
  check"). The page must load with no Mermaid syntax errors.
- Every box that sends, writes, calls or reads says to or from where in its text, and its arrow ends
  on the box for that system. Every call to another system is an arrow out, plus an arrow back when
  the next step uses the answer.
- Swimlane lanes: grep the source for `[" "]` and `ghost`; there must be none. In the PNG, no lane box
  is wider or taller than its own steps need.
- A playable swimlane: step it from the start to the end and back in a browser.
- Every sidebar `href` and `data-href` resolves to an `id` on the page, and every file link's path
  exists relative to the page.
- An explainer page: the master links to it wherever it discusses the topic, and the explainer's lead
  links back.
- Linked pages: each page lists the other in its Linked pages section, the section is the page's last,
  and every link in it opens an existing file.
- After changing a task's status: one grep lists every task's checkbox class and label side by side, and all
  done tasks look the same (`references/page.md`).
- A browser tab opened by automation is usually in the background (`document.visibilityState ===
  "hidden"`), so scroll events don't fire there. Test the scroll-spy by calling `markActive()` after
  each `scrollIntoView()`, and don't conclude it is broken.

## Mentioning a page in chat

Whenever a chat reply mentions an HTML page, give two lines the user can paste straight into the
browser's address bar, each one alone on its own line:

file:///Users/<you>/<repository>/<TICKET>_<topic>/<topic>.html

/Users/<you>/<repository>/<TICKET>_<topic>/<topic>.html

The first line is the full `file:///` URL, the second is the absolute path on disk. Nothing else goes on
either line: no prose, no backticks, no markdown link, no bullet, no `>` blockquote. Put a short label on
the line above if needed ("Paste this into your browser:"). Add a section's `#id` to the URL when you
mean one section, after checking the `id` exists. Code files in chat keep the usual relative links.

**Why:** a relative link opens the HTML source in VS Code, and a `file:///` link opens the rendered page
in the browser. A URL buried in a sentence or wrapped in markdown has to be picked out by hand.

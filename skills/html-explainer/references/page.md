# The page: file, layout, links, tasks

## The file

- **Name:** a short topic, e.g. `checkout-retry.html`. An explainer page starts with its master's name
  (`checkout-retry_timeout.html` for the `checkout-retry.html` master).
- **Edit, don't rewrite:** these working pages usually have no version history, so a careless
  overwrite cannot be undone. Prefer exact-string edits to rewriting a whole page.
- **Location: one folder per ticket,** at the root of the repository the user is working in, named
  `<TICKET>_<short-topic>/`, e.g. `SHOP-142_checkout-retry/`. Every working file
  for that ticket (the master page, its explainers, notes, exports) goes inside it.
  - Decide first whether the request belongs to a ticket: the user names one, or it is about the
    ticket of the branch being worked on. If so, check the folder exists,
    create it if not, and put the page inside.
  - Not part of a ticket (a quick check of something unrelated): the page goes flat at the root, with
    no folder (`payment-webhook.html`). If it is unclear, ask before creating anything.
  - A page in a ticket folder sits one level down, so its code links start with `../` (`../src/…`,
    `../../other-repo/…`), and a link to another ticket's page is
    `../<other folder>/<page>.html`. Mermaid `click` links inside `<pre class="mermaid">`
    need the same `../`.
  - "Grep the folder" anywhere in this skill means the ticket's folder.
  Never a nested `docs/` folder, a scratchpad or a temp directory: the user opens the page next to the
  code they are changing.
- **Format: HTML only,** built from `assets/template.html`, including a bare request for one diagram.
  Never a `.md` or `.mmd` file, and never a `.md` twin beside the `.html`.
- **Existing `.md` documents are left alone:** never deleted, recreated or converted, unless the user
  asks, and only within the scope they name.

## What a page holds

In this order, and only the parts the request needs (`SKILL.md`, "Which sections a request gets"):

1. `h1`: a 2-4 word name.
2. `.lead`: ticket · screen or area · one-line scope. An explainer's lead also links back to its master.
3. The problem section (`div.problem#problem`), only on a page that explains a problem
   (`references/writing.md`).
4. The task section (`#tasks`), only once tasks have been discussed (below).
5. The sections the user asked for: swimlanes, with short paragraphs where they help.
6. The Linked pages section (`#linked-pages`), always last, only when the page is linked with other
   pages (below).

## The look: DESIGN.md, always dark

Every page follows `references/DESIGN.md`: its colours, type (Inter, with large medium-weight
headings), rounded corners, spacing and components. `assets/template.html` already does; a page adds
nothing outside it. When a page needs a colour or a piece the template doesn't have, take it from
DESIGN.md, and use its tokens, never a new hex value.

Three exceptions to DESIGN.md:

- **Always dark.** DESIGN.md is cream throughout; these pages always use its dark surfaces
  (`surface-dark` for the page, `surface-dark-elevated` for cards and the diagram panel, white text).
  No light theme and no `prefers-color-scheme` switch. The saturated brand cards keep their colour and
  their dark ink text (the problem section is lavender).
- **Every link is a blue pill,** although DESIGN.md styles links like body text: blue text
  (`--link`, `#4493f8`) in a dark pill; inside a coloured box, the box's light chip and dark ink instead
  ("Three kinds of link"). This covers prose links, file links, player captions, and the
  file line inside a diagram box (blue and underlined there, without the pill). A reader must see at a glance what can be clicked. One mark says where a link goes (below,
  "Three kinds of link").
- **The page never lists its own colours:** no palette section, no footer of token names and hex
  values. The page is about the code, not about its styling.

## The layout: a sticky left sidebar

`assets/template.html` already does all of this. Keep it working when you edit.

- Two columns: a 264px sticky `<aside class="toc">` titled "On this page", with Expand all / Collapse
  all buttons, and the content on the right. Below 1024px wide it falls back to one column.
- An entry with children is
  `<details data-group="ID"><summary data-href="#ID"><span>Title</span></summary><ol>…</ol></details>`;
  a leaf entry is a plain `<a href="#ID">`. The entries mirror the page's sections, nothing more.
- Scroll-spy highlights the section being read. Which groups are open is remembered in `localStorage`
  under a key unique to the page (all `file://` pages share one origin, so a shared key leaks state).
- The page's own sections collapse too (`<details class="sec l2" open id="ID"><summary><h2>…`, and `l3`
  with `h3` for sub-sections).

## File links

Every file reference on the page is a clickable link. The visible text stays what you would otherwise
write; the target is the path relative to the page, plus `#L<first line>`:

```html
<a href="../src/checkout/retry.py#L42"><code>retry.py:42</code></a>
```

- A range such as `:57-62` anchors to its first line (`#L57`); a whole file uses `#L1`.
- The template's script rewrites these to `vscode://file/<absolute path>:<line>`, so they open at the
  line in VS Code.
- Check that each path exists, and add links while writing, not afterwards.

## Three kinds of link

Every link looks the same: blue text in a dark pill (inside a coloured box, see below). Exactly one mark says where it goes, and the
template picks it from the link's address, so a page never styles a link by hand:

| Where the link goes | Its `href` | The mark |
|---|---|---|
| A section of this page | `#id` | none |
| A file, opened in VS Code | `path#L12` (rewritten to `vscode://…`) | underlined |
| Another page: a master, an explainer, any `.html` page or web address | `….html`, `https://…` | ↗ at the end |

So: an underline means another file, an arrow means another page, neither means this page.

- **Blue, `#4493f8`,** for every kind on the dark page: the colour does not change with where the link
  goes; only the mark does.
- **Inside a coloured box** (the lavender problem section, any brand-coloured card), a link is not blue:
  it takes the same light chip as code in that box, with the box's dark ink text, and keeps its mark
  (`--link-chip`, `--link-text`). The dark cells inside the problem section keep blue links.
- **A file name in a link takes the link's font,** not a monospace code chip, even when it is wrapped in
  `<code>`.
- **Code that is not a link** is a grey chip with white monospace text (`--chip`), the only thing that
  looks different.
- **No separate "other page" label** next to a page link: the ↗ inside its own pill says it.
- A VS Code link to an `.html` code file is a file link (second row), never a page link.
- A link to a section of the same page is always a bare `#id`, never `this-page.html#id`.
- The sidebar keeps its own look, plus the ↗ on any link to another page.

## The Linked pages section

When a page is linked with other pages (its master, its explainers, or pages the user asked to link:
"link this page to that one", "create a linked page from this page"), the last section of the page lists
them all, so the user always knows where to find them: at the bottom.

```html
<details class="sec l2" open id="linked-pages"><summary><h2>Linked pages</h2></summary>
<ul>
  <li><a href="checkout-retry_timeout.html">Retry on timeout</a>: why a timed-out payment is retried once.</li>
</ul>
</details>
```

- One entry per page: the link text is that page's `h1`, then one line saying what the user will find
  there.
- A link goes both ways. When the user asks to link page A to page B, add B to A's section and A to B's
  section in the same change, creating the section on a page that has none.
- The sidebar gets one leaf, `<a href="#linked-pages">Linked pages</a>`, as its last entry. It points at
  the section, never straight at another page: the sidebar script reads every sidebar `href` as a
  selector on this page.
- A page with no linked pages has no such section.
- Check that every link in the section opens an existing file, relative to the page.

## The task section

On a master page for a feature or a bug fix, once the tasks have been discussed, a task section sits
right below the problem section, so the user sees at a glance what is open and what is done. While the
user is still working out the problem, there is no task section.

One block per task: an empty checkbox and the task number beside the title, the checkbox ticked
once it is done.

```html
<div class="step" id="task-1"><span class="check"></span><span class="num">1</span><div>
  <p class="step-title">Retry the payment once on a timeout <span class="st open">Open</span></p>
  <p>What the task changes, with file links.</p>
</div></div>
```

### Changing a task's status

When a task changes status, update every place that shows it in the same edit:

1. The checkbox: `<div class="step" id="task-1">` → `<div class="step done" id="task-1">`. The number
   stays as it is, so the user always sees which task it is and whether it is done.
2. The label: `<span class="st open">Open</span>` → `<span class="st done">Done, committed in <hash> (<date>)</span>`.
3. The body: future-tense steps become a past-tense "Done <date>" record, if the other done tasks read
   that way.
4. Any sidebar entry or other page that states the task's status.

Then list every task's `step` class and label in one grep, and check that all done tasks look the same and
that each "committed" claim matches `git log`.

## A master page and its explainer pages link to each other

A ticket can have one master page and separate explainer pages for single questions. They link to each
other, so the user can move between them without going back to the file tree.

- **Find out first whether the page is an explainer at all.** The user often pastes an item's text
  without naming the master. Grep the ticket's folder for a distinctive phrase from the
  request; if it matches a master, the new page is its explainer.
- **Master → explainer:** an entry in the master's Linked pages section (above), and a link
  (`Explainer: <a href="….html">Title</a>`) wherever the master discusses that topic, in
  particular under the task it explains.
- **Explainer → master:** the `.lead` links back to the master section the question came from, and the
  explainer's Linked pages section lists the master.
- Write both directions in the same change as creating the explainer.

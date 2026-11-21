# Swimlane diagrams

The user reads these diagrams in a browser, on a dark background, and trusts each one as complete.
There are two kinds: a **swimlane**, and a **playable swimlane** (`references/playable.md`). Every
diagram on a page is one of the two; any request for "a diagram" or "a Mermaid diagram" gets a
swimlane.

## Contents

- The diagram block
- How a swimlane looks
- Never silently leave anything out
- Fit one screen
- Colours
- Render to check

## The diagram block

In this order, and nothing else:

1. `h4.dia-title` naming the diagram. A before/after pair is named `Today: …` / `After: …`.
2. `div.legend` with colour dots (`.sw-ochre`, `.sw-coral`, `.sw-mint`, `.sw-pink`, `.sw-lavender`),
   only when the diagram uses colours. Each entry is a dot followed by what that colour means in this
   diagram, never the colour's name: `<span><span class="sw-ochre"></span> where it goes wrong</span>`,
   not "ochre = where it goes wrong". The dot already shows the colour; naming it is noise.
3. `div.dia` holding only a `pre.mermaid` with the HTML-escaped source.

**The panel:** the template's script turns every `div.dia` into a window onto the diagram. It starts
just tall enough to show the whole diagram at the column's width, never taller than 70% of the window.
Drag the bar on its bottom edge to make it taller or shorter. The buttons at its top right are −, the
zoom level (click it for 100%), + and Fit; Cmd/Ctrl + scroll or a trackpad pinch zooms around the
pointer. Hold and drag inside it to move the diagram; double-click fits it again. A plain click on a
box still opens its file. No hint text inside the panel.

Nothing goes under the diagram: no file list, no notes, no "not drawn" line. The diagram carries the
explanation; a sentence the reader needs goes in the paragraph before it.

**Links inside the diagram:** every box that stands for a file opens that file and line in VS Code when
clicked, with Mermaid's own `click NODE href "path/to/file.py#L12" "Open file.py:12"`. A box that stands
for an external system can open its documentation (`click NODE href "https://…" _blank`). The template
turns file links into `vscode://` links and colours the box's first bold line blue and underlined, like
the page's own file links. Check that each target line really says what the box claims.

## How a swimlane looks

Mermaid has no swimlane type. A swimlane here is a `flowchart` drawn as **boxes inside boxes**: each
lane is a box sized to the steps it holds, never a row or column stretched to the full width or height.

- **One box per actor or system, nested the way the systems nest:** a "payments service" box holds a
  "webhook handler" box and a "database" box. Each box is only as big as its contents.
- **Never stretch lanes to a common edge.** No invisible start/end nodes (`H1[" "]`), no `ghost` class,
  no lining up every lane's left and right edge: full-width rows with a few boxes scattered across them
  waste the space and hide the shape of the flow.
- **`flowchart LR` at the top, `direction TB` inside each box,** so the boxes sit side by side in time
  order and the steps stack inside them.
- **Arrows between boxes go box to box when they can** (`API ==>|"step 3"| DB`). A box with an arrow to
  or from one of its inner nodes loses its own `direction` and is laid out with the whole diagram;
  box-to-box arrows keep it compact. Use a node-to-node arrow only where the exact step matters (a
  branch label, a loop).
- **Every step box is a numbered business step in plain words** ("3. Find which shop owns this
  order"), never a function name as the headline. The file and line sit underneath in small type, as
  the clickable link, so long file names don't wrap mid-word:
  `<span style='font-size:16px;font-weight:600'>3. Find the shop</span><br/><b style='font-size:12px;font-weight:normal'>orders.py:120</b>`.
- **Yes/no questions are hexagons** (`{{"…"}}`), never diamonds, which render huge. Branches carry
  `yes` / `no` labels.
- **A box that sends, writes, calls or reads names the other side in its own text,** and the arrow for
  that step ends on a box standing for that other side: "Send the receipt **to the email service**",
  with the arrow landing inside the email service's box. If the receiving system has no box yet, add
  one. Never let the arrow out of a "send" box run to the next step in the same lane: a reader takes an
  arrow's head as where the thing went. When an arrow only means "then the next step runs", its label
  says so ("next").
- **Every call to another system is an arrow out and, when the next step uses the answer, an arrow
  back.** That covers sends, reads, lookups, "start a job" (the job number comes back) and "ask whether
  it finished". A question box whose answer comes from another system shows where the answer came
  from. Before rendering, list every call the covered code makes to another system (client calls, HTTP,
  SDK calls) and check each one is drawn.
- **Keep a loop inside one box.** When a loop's arrows run through two boxes, Mermaid reverses one of
  them and the steps come out upside down. Put the loop's steps in the box that runs them, and draw the
  tables and buckets they touch in another box, with dotted `reads` / `writes` arrows.
- **More than three boxes in a chain: group them by a real boundary** ("Mail servers", "Our cloud
  account"), each group `direction TB`, and draw the arrow between the groups. Draw a group as an
  outline only (`style G fill:none,stroke:#6a6a6a`), never dashed.
- **Never let arrows run both ways between two groups.** Mermaid turns one of them round and the flow
  reads right to left. Split the system that appears twice instead. A back-and-forth between two boxes
  inside one group is fine.
- **About six steps and five lanes per diagram.** Split a long flow at its phase boundaries into
  several swimlanes ("Steps 1–6: …", "Steps 7–11: …"), keep shared lanes in the same order, and start
  the later diagram with a plain box "From step 6: …".
- **A lane the flow never enters still gets a box** saying why it's idle ("no refund request reaches
  here"). An empty lane looks like a drawing error.
- **Before/after = two swimlanes with the same lanes in the same order.** Mark the changed boxes with
  a pink outline (`classDef changed stroke:#ff4d8b,stroke-width:3px`) and say so in the legend.
- **Don't use the ELK layout** (`layout: elk`). It ignores the direction inside lanes and wraps the
  arrows round the outside.

## Never silently leave anything out

The user trusts a diagram as complete. Every loop, branch, failure path, skipped case and step the
covered code has is drawn.

- Never decide on your own that something is "too detailed" and drop it quietly.
- Draw loops as labelled back-arrows with a "none left" exit; never fold a loop into one box ("each
  attachment downloaded").
- Failure paths are dotted arrows to a "Stop: …" box that says what is left behind.
- If something has to be left out (the user asked for a simpler picture, or it is plumbing), say what
  in the chat reply. Not on the page.

## Fit one screen

Every diagram fits **one screen**: no wider than the screen, no taller, and **height greater than half
the width**. The page scales a diagram to its column, so a wide, flat diagram shrinks every label until
it cannot be read; a thin, tall one wastes the width. Zooming in the panel is the escape hatch, not a
licence to draw wide.

- The failure to avoid is **fan-out**: one node with six children is six nodes wide whatever the
  direction. Fold it into stacked boxes, with members stacked inside using invisible links
  (`A ~~~ B ~~~ C`).
- Too tall: split one long chain into two side-by-side columns.
- Prefer one multi-line node to several side-by-side nodes; extra `<br/>` lines buy height cheaply.

## Colours

Every colour comes from `references/DESIGN.md`, on the dark page (`references/page.md`, "The look").
The template sets Mermaid's own colours to match: lanes `#0a1a1a` on the `#1a2a2a` panel, step boxes
`#1a2a2a` with white text, grey lines.

- **A lane that stands out gets a saturated DESIGN.md brand colour,** filled solid, with `color:#0a0a0a`
  so its title stays readable: `style STYLES fill:#e8b94a,stroke:#e8b94a,color:#0a0a0a`. The step boxes
  inside stay dark, so their white text still reads.
- **A colour means one thing on every page,** and the legend says what:

  | Brand colour | Hex | Means |
  |---|---|---|
  | ochre | `#e8b94a` | where it goes wrong (a lane or a box) |
  | coral | `#ff6b5a` | the step that goes wrong (a player arrow) |
  | mint | `#a4d4c5` | what happens, found, works (a player arrow, a lane) |
  | pink | `#ff4d8b` | new or changed (a lane fill, or a box outline) |
  | lavender | `#b8a4ed` | a second try (a player arrow); the problem section |

- **Step boxes are never filled with a brand colour:** their text is white. Mark a single box with an
  outline in the colour instead (`classDef changed stroke:#ff4d8b,stroke-width:3px`).
- If unsure, no fill beats a guess: plain lanes read fine.

## Render to check

Render every diagram before saying it is done, with the same colours as the page. Save its source to
a `.mmd` file in a scratch directory, with this `config.json` beside it:

```json
{ "theme": "base", "themeVariables": {
  "fontFamily": "Inter, -apple-system, BlinkMacSystemFont, sans-serif", "fontSize": "16px",
  "background": "#1a2a2a", "primaryColor": "#1a2a2a", "primaryTextColor": "#ffffff", "primaryBorderColor": "#a0a0a0",
  "nodeBorder": "#a0a0a0", "lineColor": "#a0a0a0", "secondaryColor": "#0a1a1a", "tertiaryColor": "#0a1a1a",
  "clusterBkg": "#0a1a1a", "clusterBorder": "#3a3a3a", "titleColor": "#ffffff", "edgeLabelBackground": "#0a1a1a" } }
```

then:

```bash
npx -y @mermaid-js/mermaid-cli@11 -i d.mmd -o d.png -c config.json -b '#1a2a2a' -w 2400
```

Look at the PNG: check the shape against "Fit one screen", that no lane is bigger than its steps need,
that no arrow or label crosses a box, and fix any syntax error mermaid-cli reports.

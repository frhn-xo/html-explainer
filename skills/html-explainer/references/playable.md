# Playable swimlanes

A **playable swimlane** is a swimlane the user steps through with buttons: it starts with only the
boxes, and each press of **Next** draws one more arrow, with a caption under the diagram explaining
that step. Every swimlane rule in `references/diagrams.md` still applies.

## The words the user uses

- **playable**, **playable swimlane**, **playable diagram**: one swimlane with the player's buttons.
- **playable before/after**: two playable swimlanes playing the same events, `Today: …` then
  `After: …`, each with its own legend.
- **swimlane** on its own: a plain swimlane, no buttons.
- **step**: one press of Next: one arrow appears, with its number and label.
- **caption**: the sentence under the diagram explaining the current step, with file links.
- **fade**: older arrows dim (0.4); a previous try's or event's arrows dim further (0.12) once the next
  one starts.

## The master page's bug player

A master page that explains a bug has one playable swimlane, right after the problem box. It plays
**the bug only**: what the person did, what each system did in turn, the step where it goes wrong
(`bad`), and what the person sees at the end. No fix steps, no "after" player, unless the user asks for
one. A second path, a retry or an edge case gets its own swimlane in its own section, never extra steps
bolted onto the bug player.

## How it is built

The player draws the arrows itself, so **the Mermaid source has no arrows**: only the boxes, laid out
with invisible links (`a ~~~ b`, best between lane boxes rather than steps), plus the usual
`click … href` lines and `classDef`s. Each step names the two box ids it joins.

1. **Styles:** paste `assets/player.css` into the page's `<style>`.
2. **Render hook:** the player waits for Mermaid. The template's module script already sets
   `window.mermaidRendered` and fires `mermaid-rendered` after `mermaid.run(...)`.
3. **Markup, per player**, after the diagram's `h4.dia-title` and `div.legend`:

   ```html
   <div class="player" id="player-a">
     <div class="player-bar">
       <button type="button" data-play="reset">⟲ Reset</button>
       <button type="button" data-play="back">◀ Back</button>
       <button type="button" data-play="next" class="primary">Next ▶</button>
       <button type="button" data-play="auto">▶ Play</button>
       <span class="player-step">Step 0 / 0</span>
     </div>
     <div class="dia"><pre class="mermaid">…</pre></div>
     <div class="player-caption"></div>
   </div>
   ```

4. **Script:** paste `assets/player.js` into a classic `<script>` after the template's `toVSCode()`
   script, and fill its page-data part:
   - `COLORS`: one colour per kind of arrow. Keys `1`, `2` are the try or event number (`t`), `bad`
     (coral `#ff6b5a`) is where it goes wrong, `fix` (pink `#ff4d8b`) is new code at work; try `1` is
     mint `#a4d4c5` and try `2` lavender `#b8a4ed`, all from `references/DESIGN.md`.
   - One array of steps per player. A step is
     `{ t: 1, from: 'boxId', to: 'boxId', label: 'arrow label', cap: 'caption HTML', bend: 70, bad: true, fix: true, miss: true }`.
     `t`, `from`, `to`, `label` and `cap` are required. `bend` curves the arrow (negative the other
     way) so it does not cross a box. `bad` and `fix` choose the colour; `miss` draws a dashed arrow
     ending in ✕ (something looked for and not found).
   - Caption links: `code(path, line, text)` returns a file link, the same as the page's other file
     links.
   - One `makePlayer({...})` per player: `id` (unique, used for arrowhead ids), `root`, `steps`,
     `tWord` (`'try'` or `'event'`, shown in "Step 3 / 9 · try 1"), and `intro` (the caption at step 0).
5. **Keys:** → and ← drive the player last clicked if it is on screen, else the first one on screen.
   The sentence before a player says so: "Press **Next** (or →); ← steps back."

## Writing the steps

- One step is one thing that happens: one call, one write, one decision. Never two arrows in one step.
- A step's `to` is the box that receives what moves: a send ends on the receiver, and the answer is its
  own step back.
- Every caption opens with a bold sentence saying what happened, then links the file and line that
  does it.
- The step where it goes wrong, and the steps that show the damage, are `bad`. The legend gives each
  colour a dot and its meaning, without the colour's name: "● what happens · ● where it goes wrong".
- The last caption states what the person sees at the end, on the example.
- A playable before/after plays exactly the same events in both players.

## Check

Open the page in a browser and step each player from 0 to the end and back: every arrow joins the right
boxes, and no arrow or label sits on a box. Render the bare diagram with mermaid-cli as usual.

# Writing the prose on a page

"Explain it" never means more diagrams or longer paragraphs. It means plain English, every term defined
before it is used, and an answer the user can act on.

Prose frames the swimlanes: a sentence or a short paragraph before a diagram, where the diagram needs
one. Never a paragraph that repeats what the diagram already shows.

## The problem section: "The problem, in plain words"

Only on a page that explains a problem: the user is debugging, fixing a bug, or asks "what is the issue".
A page that explains how something works, or how to build something, has no problem section.

The box (`div.problem#problem`) is titled **"The problem, in plain words."** and follows this shape, in
this order:

1. **The screen, the person, the action, real values.** One sentence a person could act out.
2. **What changes.** Name any service with a plain gloss the first time ("Stripe (a payment service)").
3. **Two cells with an arrow:** today's outcome → the outcome in question, on the same example. Use the
   template's `.cells` / `.cell.ok` / `.cell.bad` markup.
4. **The condition,** as a short numbered list. Each item says what it *does*, plus what goes wrong
   without it, on the example ("so order `#1042` would never be paid").
5. **"The question is: …"** in bold, as one yes/no question.
6. **What we already know, and what we don't,** when there are unknowns. One bullet per unknown, each
   ending in its consequence on the example.
7. **"Why the code can't answer it:"** (or whatever blocks the answer), in one sentence, when it applies.
8. **"So what:"** both branches. If yes, what we skip or do. If no, what we must do, or what breaks.

Right after the box comes the swimlane of the bug: playable on a master page
(`references/playable.md`, "The master page's bug player"), plain otherwise.

### Rules that go with it

- **Never use an abstract noun with nothing behind it:** "state", "config", "setup", "wiring". Replace
  each one with the concrete things it stands for ("is the business account verified, and is live mode
  on"). A reader who does not already know the answer gets nothing from "the code tells us where, but
  not its state".
- **Never end a sentence on a fact without its consequence.** "Both were set up by hand." needs "…so the
  code can't tell us, and someone has to look in the dashboard." The user's test is "so what?".
- **Name a technical thing by its official term,** taken from the vendor's own documentation, and never
  invent a substitute or let one term stretch over two things ("update by query" is
  `_update_by_query`, never "rewrite"; "reindex" is `_reindex` only). Define the term in plain words in
  the sentence where it first appears, with a link to the documentation page that names it. The
  official term names the mechanism; it never replaces the plain statement of the goal, and it never
  becomes the subject of a section's first sentence when that sentence should say what someone wants
  or what happens on screen.
- **The opening locates the reader on screen first:** which page, which row, which field, what the
  person did. The mechanism comes after.
- **The test for every paragraph:** it names a person, a screen or a real value, and after reading it
  the user can answer "so what?".

### The model to copy

> On the **checkout screen**, a customer clicks **Pay** for order `#1042`. After the payment rework,
> that payment goes through **Stripe** (a payment service) instead of the old in-house gateway:
> `Today: the gateway charges the card → order paid` → `After the rework: Stripe charges it → paid, or
> declined?`
> Stripe declines every real charge from us until **two one-time setups** have been done: 1. **Verify
> the business account.** Until then, Stripe accepts test cards only. 2. **Switch the shop's key to
> live mode.** Without it, the shop keeps sending test charges, so order `#1042` would never be paid.
> **The question is: are those two setups already done?** There is a hint they partly are: refunds
> already go through Stripe, in the same account. We just don't know how much: was the whole account
> verified, or only refunds switched on? If only refunds, the charge for `#1042` is still declined.
> **Why the code can't answer it:** both setups are clicks in Stripe's dashboard, not lines in our
> repository. **So what:** if both are done, we skip those steps; if not, we do them before switching,
> or the first customer payment is declined.

The kind of version it replaces, which names no person, screen or value the reader can act on: *"The problem: the code tells us where the gateway is configured, but not its state.
Both setups were done by hand in the dashboard."*

## Explaining what someone meant

The shape of a page follows the question it answers; there is no one template for every question,
only judgement. When the question is **what a person said, meant
or wants** (a reviewer's comment, a chat message, a manager's request), write it the way the user would
say it:

- **Their goal first, in plain words:** "He just wants every old document updated to the latest
  mapping. That's it." Then, when they matter, what they don't care about and what happens if nothing
  is done. Mechanism and official terms come after, if the reader needs them.
- **Their last ask in a thread is the goal;** the earlier lines are their reasoning.
- **Never explain their point by translating and defending their wording** clause by clause, and never
  build the opening from negatives ("changes no data", "not a migration"): that turns the explanation
  into a rebuttal and still never says what they want.
- **When the user already said it clearly, use their words,** with any technical correction underneath,
  and only when it matters.
- **A taste check:** could the user repeat the first sentence to their manager in one breath?

## Define every term before its first use

Before writing, list every term on the page that is not everyday English: service names, internal
nouns, protocol words. Define each one in plain English in the sentence where it first appears, or the
one before: what happens without it, then what it is. An everyday analogy (posting a parcel, a tracking
number) earns its place. Never use a term first and define it three sections later.

## A page that compares two approaches

Only when the user asks to compare approaches. For each aspect the user cares about, draw one swimlane
for approach A and one for approach B, with the same boxes in the same order, so the difference shows
when you look from one to the other. Under each pair, a few short pros and cons. A recommendation goes
last, after both have been compared fairly, and only if the user wants one.

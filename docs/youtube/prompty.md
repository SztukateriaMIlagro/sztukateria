# Prompty YouTube — Signs & Meanings (thesignsandmeanings.com)

Kanał anglojęzyczny. Prompty są po angielsku, bo po angielsku powstaje treść (mniej dryfu przy tłumaczeniu).
Odnoszą się do repo strony `signs-meanings`: artykuły to pliki JSON w `src/content/{typ}/en/`, zasady treści
w `docs/content-guide.md`, kolory i fonty marki w `src/styles`.

Zmiany względem promptów z filmu:

- **„Tylko prawdziwe fakty” → zasady z `docs/content-guide.md`.** To nisza symboliki, nie nauki: mówimy „traditionally
  read as”, bez przepowiedni, bez porad medycznych/finansowych, bez wymyślonych tradycji i statystyk. Twarde fakty
  (daty pełni, pochodzenie nazw księżyców, kalendarz chiński) idą do `facts.md` ze źródłem.
- **Scenariusz z artykułu**: prompt wskazuje konkretny plik JSON, więc film mówi to samo co strona (i do niej prowadzi),
  ale językiem mówionym, nie kopią tekstu.
- **Styl marki zamiast podręcznika biologii**: rycina z dawnego atlasu nieba — jasne linie na granatowym niebie
  (#0e1029), złoty akcent (#e2b866) dodawany przez animację. Liczby składa animacja fontem strony (Cormorant Garamond,
  złoty gradient jak na pinach), nigdy obraz.
- **Biblioteka obrazów robiona raz** (zegar, telefon, paragon, tablica rejestracyjna, fazy księżyca, zwierzęta…).
  Short o liczbie nie potrzebuje wtedy nowych obrazów — koszt to prawie tylko lektor.
- **Przezroczyste tło od razu z GPT Image 2.5**, obraz-wzorzec stylu jako referencja, szkice w „medium”.
- **Głos testowany A/B** zamiast z góry „deep male” — widownia tej niszy to w większości kobiety; wybieramy po odsłuchu.
- **Napisy wypalone w shortach, CTA do artykułu, punkty kontrolne w długim filmie, 30 fps w long-formie.**
- **Ten sam pionowy plik idzie też na Pinterest (video Pin z klikalnym linkiem), TikTok i Reels.** W shortach YouTube
  linki w opisie nie są klikalne, więc short prowadzi do długiego filmu („related video”), a dopiero ten do strony.

---

## STEP 0 — once: channel settings (`CHANNEL.md`)

```
Create CHANNEL.md in this folder with the settings every video will use. No images or code yet.

- Brand: Signs & Meanings — https://thesignsandmeanings.com
- Source of truth for content: the site repo at [PATH TO signs-meanings]. Articles are JSON files in
  src/content/{type}/en/. The rules in docs/content-guide.md apply to every script, word for word: the voice, the
  hard rules (no medical/legal/financial advice, no invented facts, no fake people, no predictions or guarantees,
  each video genuinely about its own number/sign) and the digit symbolism table.
- Voice of the narration: warm, grounded, plain — a thoughtful friend who knows the symbolism, not a guru and not a
  sceptic. Second person. Short sentences. No hype ("this message found you", "the universe chose you",
  "don't skip this"), no fear, no urgency.
- Narration pace: about 2.5 words per second (30 s ≈ 75 words, 10 min ≈ 1,500 words).
- Style line (used word for word in every image prompt):
  "antique celestial engraving, like a plate from an 18th-century star atlas: fine ivory-white ink linework,
  delicate hatching and stippling for shading, crisp contours, monochrome, no colour fill"
- Animation look: night-sky background #0e1029 fading to #2a2457 at the top corner, a slow field of faint stars;
  accent gold #e2b866 (light, motion, numbers) and violet #8c7fe0 (rare second accent); text #fbf8f2.
  Images are tinted by the animation, never coloured in the image itself.
- Typography (same as the site): numbers and titles in Cormorant Garamond with a soft gold gradient,
  labels in Inter, small caps with wide letter spacing.
- Ending: last 2–3 s show "Full meaning → thesignsandmeanings.com" with the exact page path, and the moon logo.
- Voice ID: [filled in at STEP 3]
```

---

## STEP 0b — once: reusable image library

```
Read CHANNEL.md. Build a reusable image library in Higgsfield so that most future videos need no new images.

1. Style anchor first: make "a crescent moon with a small four-pointed star beside it" and show it to me.
   Wait for my approval. After that, pass it as a reference image to every other picture.
2. Make the library (each a single object, lots of empty space around it):
   - everyday places where people notice numbers: analogue clock face (no numerals), digital alarm clock
     (blank display), smartphone lock screen (blank), paper receipt (blank), car licence plate (blank),
     street address plaque (blank), microwave display (blank), train departure board (blank)
   - mood objects: open hand, a lit candle, a feather, a key, an open door, a winding path, a seed sprouting,
     two hands almost touching, a compass, an hourglass
   - the 8 moon phases (new, waxing crescent, first quarter, waxing gibbous, full, waning gibbous, last quarter,
     waning crescent)
   Any display or surface that would hold a number stays blank: the animation writes the number on it.
3. Prompt for each: what it is and from which angle, then "lots of empty space around it, nothing touching the
   edges", then the style line word for word, then "isolated object, transparent background, no text, no letters,
   no numbers, no labels, no arrows, no cast shadow, no frame".
4. GPT Image 2.5, background: transparent, quality medium, 2k. Square unless the object is clearly wide or tall.
5. Check every image: text or digits, colour, cut-off edges, extra objects, opaque background, or a style that
   doesn't match the anchor → remake (twice at most). Save to library/ with clear names, prompts to
   library/prompts.md. Report credits used (balance before/after) and the dollar cost at [PRICE PER CREDIT].
```

Później dokładamy do biblioteki: 22 zwierzęta mocy, 12 zwierząt chińskiego zodiaku, 16 kryształów, 12 kamieni
urodzinowych — dopiero gdy przyjdzie kolej na daną serię.

---

## STEP 1 — short script

```
We're making a short animated video step by step. Today only the script — no images, no code. Read CHANNEL.md
and docs/content-guide.md in the site repo.

Vertical 9:16, 30–40 seconds (75–100 words), one calm narrator.

Source: [PATH, e.g. src/content/numbers/en/444.json]. Build the script from that page: its quickAnswer, its
themes and the section that best fits a short (usually why-you-see-it). Say it the way you'd say it out loud —
don't read the page.

- First sentence = the search phrase people type, said naturally, and a reason to stay:
  e.g. "If you keep seeing 444, here's how it's traditionally read." No "Have you ever wondered".
- First frame already shows the number on an everyday object (from library/), moving. No logo intro.
- One idea only. Built from the number's own digits (content guide rule 5). Nothing that could be pasted onto
  another number's video.
- End with one reflective action from the page's what-to-do section, then loop back to the opening frame.
- Every sentence has something on screen that matches it. One continuous camera journey, no hard cuts.
- Use images from library/ wherever possible. List any new image needed (each a single object; numbers, labels
  and text are added by the animation, never drawn).

Give me:
1. Narration, word for word.
2. Shot list: each sentence, what's on screen, what the camera does.
3. Image list: which library images, plus any new ones (file name + description).
4. YouTube Shorts title (≤ 60 chars, starts with the number + "meaning"), 3 hashtags, and a Pinterest video Pin
   title + description linking to the page.
Save to script.md and show me.
```

---

## STEP 2 — new images (only if STEP 1 listed any)

```
Make the new images listed in script.md with Higgsfield, exactly as in STEP 0b (style anchor as reference,
same prompt structure, GPT Image 2.5, transparent, medium, 2k, max 2 remakes). Save to images/, prompts to
images/prompts.md, report credits and dollars. Show me the images. Don't start the animation.
```

---

## STEP 3 — voice and animation

```
Now the voice and the animation. Read CHANNEL.md.

1. Voice
   - If CHANNEL.md has no Voice ID yet: read the first two sentences with 4 voices (2 female, 2 male; warm, calm,
     natural English) using ElevenLabs v4 in Higgsfield, give me the files, and save the one I pick to CHANNEL.md.
   - Read the narration from script.md word for word with that voice and the same settings every time.
   - Get the exact time of every word by forced alignment on the finished audio (faster-whisper or whisperX,
     word timestamps, language en). Captions use the script's text, not the transcription.
2. Animation: Remotion project in this folder (reuse the template if it exists). 1080x1920, 60 fps, length =
   voice + 1 s. Look and colours from CHANNEL.md.
   Ways to show things:
   - the number written onto the blank object (clock, receipt, plate) in the brand serif, softly glowing gold,
   - the number's digits separating and each one showing its meaning from the digit table (e.g. 4 → "stability"),
   - slow camera pushes and pull-backs over the night sky; distant stars move slower and are slightly blurred,
   - soft gold light travelling along a path traced on the image (look at it and follow the real contour),
   - a magnifying circle growing out of a detail, joined to it by two thin lines,
   - labels fading in: small caps, wide letter spacing.
   How it moves (most important):
   - One camera for the whole scene. Every move starts slowly, speeds up, settles slowly; moves flow into each other.
   - Nothing pops in or out: fade in with a little scale and blur over ~0.5 s. Lines draw themselves on.
   - Lights are soft with a glow, never hard dots. One thing at a time. Calm.
   Captions: burned in, 1–3 words at a time, synced to word times, placed at 62–80% of frame height, current word
   in gold.
   Safe zones: nothing important in the top 8% or bottom 18%, no text in the right 12% (YouTube buttons).
   No image cut off at an edge. End card from CHANNEL.md.
   Template: images, positions, paths, labels, captions and timings live in one settings file, so a new video
   (or another language) only needs a new settings file and a new voice.
3. Check: render a still every 0.5 s and at every sentence start, look at all of them, fix what's off. Then render
   with the voice to out/short.mp4 and give it to me.
```

---

## STEP 4 — long video (8–12 min)

```
Let's make a full YouTube video, 16:9. Read CHANNEL.md and docs/content-guide.md. Reuse the template and
library/ images.

Work on your own, but stop at the two checkpoints (⏸). Elsewhere, if something is unclear, make the best call and
note it in PLAN.md.

Stage 1: plan and script
- 8–12 minutes, about 1,300–1,700 words, one calm narrator.
- Sources: [LIST OF PAGES, e.g. src/content/themes/en/love.json + the number pages it lists]. The video expands
  the pages, it doesn't read them out.
- First 30 seconds: the most useful honest answer up front, then what we'll cover by the end.
- 6–10 chapters, each answering one question and ending with a small question that pulls into the next.
  The ending returns to the opening and points to the page (and, where it exists, the site's free tool:
  angel number calculator, life path calculator, spirit animal quiz, moon phase today).
- Content guide rules apply to every sentence. Any factual claim (dates, astronomy, origins of names, calendar
  facts) goes in facts.md with its source; no solid source → cut it.
- Shot list for every sentence. Something new on screen at least every 5 seconds.
- Image list: mark which ones already exist in library/; new ones in the same style.
- Plan 4–6 Shorts that can be built from this video (one chapter each), each with its own hook sentence.
- Save to script.md, keep a ticked checklist in PLAN.md so work can resume after a break.
⏸ Show me script.md and facts.md and wait for approval.

Stage 2: new images as in STEP 2.
⏸ Show me the images and wait for approval.

Stage 3: voice — same voice and settings as CHANNEL.md, one paragraph at a time, joined with natural pauses
(~0.4 s between paragraphs, ~0.8 s between chapters). Word times by forced alignment as in STEP 3.

Stage 4: animation — Remotion, 1920x1080, 30 fps. One part per chapter, joined into one video. Same motion rules
as STEP 3, plus: side-by-side comparisons (e.g. 111 vs 1111), numbers that count in, diagrams that draw
themselves (e.g. the life path reduction 1+9+9+0 → 19 → 10 → 1). No hard cuts, no black frames: chapters flow
through a camera move. The camera always drifts a little. Captions as a separate .srt, not burned in.
End card from CHANNEL.md.

Stage 5: check and render — a still every second per chapter, look at all, fix. Render to out/full-video.mp4.

Last, in youtube.md:
- title (≤ 70 chars, matching how people search, e.g. "Angel Numbers for Love: What 111–999 Mean in Relationships"),
- description: two-sentence summary, the page link on the first line, chapter timestamps, links to every page
  mentioned, facts.md sources,
- two thumbnail ideas, and make both with GPT Image 2.5 (16:9, CHANNEL.md style, one object + the number,
  max 3 words of text),
- the Shorts plan with scripts and timings.

My topic: [TOPIC]
```

---

## STEP 5 — Shorts from a long video

```
From the video in this folder, make Short number [N] from the plan in youtube.md. Don't crop the 16:9 frame —
build a new 9:16 composition in the Shorts template from the same images. Write fresh narration (75–100 words)
with its own hook, record it with the same voice, then follow STEP 3. Set the Short's related video to the long
video. Make no new images unless the Short makes no sense without them — ask me first in that case.
```

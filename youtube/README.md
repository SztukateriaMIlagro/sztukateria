# Signs & Meanings — produkcja shortów i długich filmów

Kanał: `CHANNEL.md`. Publikacja: `content/UPLOAD.md`. Fakty: `content/facts.md`.

## Jak powstaje short

1. **Scenariusz** — wpis w `content/series-<n>.json`: segmenty `{ text, v }`, gdzie `text` to zdanie lektora, a `v`
   to kadr pokazywany w tym czasie. Typy kadrów (`src/Visuals.tsx`):
   `title`, `seq`, `compare`, `clock`, `digital`, `date`, `image`, `sum`, `pick`, `reveal`, `grid`, `moon`, `cta`.
   W „pick” pierwszy segment ma `hold` (sekundy ciszy na pauzę widza).
2. **Lektor** — ElevenLabs (connector w Claude): `eleven_v4`, głos **Frederick Surrey** (`j9jfwdrw7BRfcR43Qohk`),
   1 take, tekst = segmenty sklejone spacją, `[curious]` na początku, `[warmly]` przed pytaniem końcowym.
   Flow „Signs & Meanings – YouTube voiceovers”. Plik → `public/audio/<id>.mp3`.
3. **Czasy słów** — ElevenLabs Scribe (`creative_transcribe_audio` z `connect_from` = węzeł TTS, koszt 0) →
   `content/words/<id>.json`.
4. **Obrazy** — Higgsfield GPT Image 2.5, `quality: medium`, `background: transparent`, referencja = obraz-wzorzec
   `4bb870bd-5b94-457e-9f89-2a4c276bdcd8` (1 kredyt za obraz). Plik → `public/img/<id>.png`. Bez obrazu szablon używa
   rysunku z `src/Icons.tsx` (wieża, drzwi, kamienie, zegar, księżyc, tablica, paragon, papirus, kapsuła…).
5. **Składanie i render**
   ```
   npm install
   node scripts/build-timings.mjs          # przypisuje słowa do segmentów, sprawdza zgodność tekstu z nagraniem
   node scripts/render.mjs stills <id>     # klatki kontrolne → out/frames/<id>/
   python3 scripts/sheet.py <id>           # arkusz kontrolny → out/sheets/<id>.jpg
   node scripts/render.mjs video <id|all>  # MP4 1080×1920, 30 fps, głośność -14 LUFS → out/<id>.mp4
   node scripts/upload-sheet.mjs           # content/UPLOAD.md
   ```
   Podgląd na żywo: `npm run studio`.

## Jak powstaje długi film (16:9)

1. **Scenariusz** — `content/long/<id>.json`: `chapters[]` → `segments[] {text, v, hold?}`, `parts` = zakresy rozdziałów
   nagrywanych jednym plikiem (~2–3 tys. znaków). Dodatkowe kadry: `chapter` (`kicker`/`n`, `title`, `sub`), `outro`
   (ekran końcowy, daj `hold: 12–14`), `stars`. `"mode": "sleep"` = bajka na sen (bez napisów i efektów, wolne przenikania,
   na końcu obraz gaśnie), `"voiceTag": "[softly]"`.
2. **Lektor** — `node scripts/tts-text.mjs content/long/<id>.json` wypisuje tekst rozdziałów (z poprawkami wymowy);
   każdą część generuj osobno (v4, Frederick Surrey, 1 take), potem Scribe z `connect_from` = węzeł TTS.
3. **Zapis** — wynik `creative_get_flow_run_status` (plik JSON) →
   `python3 scripts/save-transcripts.py <plik> <generation_id_TTS>=<id>.p1 ...` → `public/audio/long/`, `content/words/long/`.
4. **Złożenie i render**
   ```
   python3 scripts/build-long.py                      # oś czasu: słowa ↔ nagranie (difflib), pauzy, rozdziały
   node scripts/render-long.mjs stills <id>           # klatki kontrolne → out/frames/<id>/ (+ sheet.py)
   node scripts/render-long.mjs thumbs <id>           # miniatura 1280×720 → out/<id>.thumb.jpg
   node scripts/render-long.mjs video <id>            # MP4 1920×1080, -14 LUFS (sen: -18) → out/<id>.mp4
   node scripts/upload-long.mjs                       # content/UPLOAD-LONG.md (opisy z timestampami rozdziałów)
   ```
   Render: ~1,5–2 min na minutę filmu na 4 rdzeniach. Mglistą poświatę wokół obrazów z Higgsfield usuwa
   `python3 scripts/clean-halo.py public/img/<id>.png`.

## Dźwięk
- `public/sfx/whoosh.mp3`, `chime.mp3` — ElevenLabs Sound Effects.
- `public/sfx/bed.mp3` — podkład syntetyzowany lokalnie (`scripts/make-bed.py`), bez licencji.

## Wymagania środowiska
Polityka sieci musi przepuszczać `storage.googleapis.com` (pliki ElevenLabs) oraz `d8j0ntlcm91z4.cloudfront.net`
(obrazy Higgsfield). Render używa Chromium z `/opt/pw-browsers` (zmienna `REMOTION_BROWSER` pozwala wskazać inny).

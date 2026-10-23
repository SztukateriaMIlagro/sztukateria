# Prompty do filmów i shortów YouTube — Sztukateria Milagro

Poprawiona wersja promptów z filmu „scientific illustration”. Zmiany względem oryginału:

- **Jeden plik `KANAL.md` z ustawieniami** (styl, kolor, głos, CTA, link do strony) zamiast powtarzania tego w każdym prompcie — kolejne odcinki są spójne i krótsze w zleceniu.
- **Język polski** i przeliczona długość (polski lektor ≈ 2,1–2,2 słowa/s, a nie 2,5 jak w angielskim).
- **Styl dopasowany do branży**: zamiast podręcznika biologii — rycina z XVIII-wiecznego wzornika ornamentów, akcent złoty (złocenia sztukaterii) zamiast niebieskiego.
- **Przezroczyste tło od razu z GPT Image 2.5** (`background: transparent`) zamiast osobnego usuwania tła — usuwanie tła zjada cienkie kreski i szrafury, a do tego kosztuje kredyty.
- **Obraz-wzorzec stylu**: najpierw jedna ilustracja, potem jest ona referencją dla pozostałych → mniej poprawek, spójny styl.
- **Szkice tanio, finał drogo**: pierwsza runda w niższej jakości, „high” tylko dla zaakceptowanych kadrów.
- **Fakty z artykułu i z `facts.md`**, legendy oznaczone jako legendy (w historii ornamentu jest ich dużo).
- **Napisy wypalone w shortach** (z timestampów słów), **CTA do artykułu** na końcu.
- **Punkty kontrolne** w długim filmie (po scenariuszu i po obrazach) zamiast „nie pytaj mnie o nic” — poprawka scenariusza jest za darmo, poprawka gotowej animacji kosztuje.
- **30 fps w long-formie** (wolne ruchy kamery wyglądają tak samo, render 2× szybszy); 60 fps tylko w shortach.
- **Shorty cięte z long-formów** — te same obrazy, ten sam szablon, koszt prawie wyłącznie lektora.

---

## KROK 0 — jednorazowo: plik ustawień kanału

```
Utwórz w tym folderze plik KANAL.md z ustawieniami, których będziemy używać w każdym filmie. Nie twórz jeszcze żadnych obrazów ani kodu.

- Marka: Sztukateria Milagro, strona: [ADRES STRONY]
- Język: polski. Lektor mówi jak rzemieślnik, który z pasją tłumaczy coś znajomemu: krótkie zdania, proste słowa, zero słów typu „niesamowite”, „szokujące”, „musisz to zobaczyć”.
- Tempo lektora: ok. 2,1 słowa na sekundę (30 s ≈ 63 słowa, 10 min ≈ 1300 słów).
- Linia stylu (używana dosłownie w każdym prompcie obrazu, po angielsku):
  "18th-century architectural engraving, like a plate from an old pattern book of ornament: fine black ink linework, delicate cross-hatching and stippling for shading, crisp contours, no colour, no paper texture"
- Akcent: ciepłe złoto (#B8913A), dodawane wyłącznie przez animację — dla światła, ruchu i podkreśleń. Nigdy nie jest rysowane w obrazach.
- Tło animacji: ciepły papier (#F5F0E6) z bardzo delikatną siatką kropek.
- Typografia etykiet: [FONT MARKI, np. Cormorant Garamond dla tytułów + Inter dla etykiet], wersaliki z szerokim odstępem liter.
- Głos: [ID GŁOSU — uzupełnimy po wyborze w kroku 3]
- Zakończenie każdego filmu: ostatnie 2–3 s to plansza „Więcej w artykule: [tytuł artykułu]” + logo. Bez proszenia o subskrypcję w shorcie.
- Rzetelność: tylko fakty, które da się wskazać w źródle (artykuł na stronie, encyklopedia, publikacja konserwatorska). Legendy (np. Kallimachos i liść akantu u Witruwiusza) zawsze nazywamy legendą. Nie wymyślamy dat, liczb ani nazwisk.
```

---

## KROK 1 — scenariusz shorta

```
Pomożesz mi zrobić krótki animowany film, krok po kroku. Dziś piszemy tylko scenariusz — bez obrazów i bez kodu. Przeczytaj KANAL.md i trzymaj się go.

Film pionowy 9:16, 30–40 sekund (ok. 63–85 słów), jeden spokojny lektor.

Treść:
- Źródłem jest artykuł: [LINK LUB ŚCIEŻKA DO ARTYKUŁU]. Bierz fakty z artykułu; jeśli coś dodajesz spoza niego, wpisz to do facts.md ze źródłem. Jeśli nie masz pewnego źródła — wytnij.
- Pierwsze zdanie nazywa to, na co patrzymy, i budzi ciekawość. Bez wstępów i bez „Czy zastanawiałeś się kiedyś”.
- Pierwsza klatka już pokazuje obiekt w ruchu (nie logo, nie pusty ekran).
- Ostatnie zdanie domyka myśl i płynnie wraca do pierwszego kadru, żeby film dobrze się zapętlał.

Obraz:
- Jedna ciągła podróż kamery, bez twardych cięć: zaczynamy od czegoś, co każdy zna (np. sufit z rozetą w kamienicy), wjeżdżamy w detal, który to wyjaśnia, na końcu odjazd lub pętla.
- Każde zdanie ma na ekranie coś, co dokładnie mu odpowiada.
- 4–8 obrazów, każdy to pojedynczy obiekt, żeby animacja mogła ruszać nimi osobno. Gdzie to ma sens, używaj rzutów jak w rycinach architektonicznych: widok z przodu (elewacja), przekrój profilu, widok z dołu.
- Etykiety, liczby i tekst dodaje animacja — nigdy nie są rysowane na obrazach.

Daj mi:
1. Narrację słowo w słowo.
2. Listę ujęć: każde zdanie, co jest na ekranie, co robi kamera.
3. Listę obrazów: nazwa pliku i co jest na każdym obrazie.
4. Tytuł shorta (do 60 znaków) i 2–3 hashtagi.
5. Słowa trudne do wymówienia dla syntezatora (np. „kimation”, „entasis”, „Witruwiusz”) z zapisem fonetycznym.

Zapisz wszystko w script.md (fakty w facts.md) i pokaż mi.

Mój pomysł: [TEMAT, np. „Dlaczego nad żyrandolem jest rozeta”]
```

---

## KROK 2 — obrazy (Higgsfield, GPT Image 2.5)

```
Teraz zrób obrazy do script.md w Higgsfield. Przeczytaj KANAL.md.

1. Wzorzec stylu: zacznij od jednego obrazu (najbardziej charakterystycznego z listy). Pokaż mi go i poczekaj na akceptację. Po akceptacji dodawaj go jako obraz referencyjny do wszystkich pozostałych.
2. Prompt każdego obrazu (po angielsku): co to jest i z jakiego rzutu/kąta, potem "lots of empty space around it, nothing touching the edges", potem linia stylu z KANAL.md dosłownie, potem "isolated object, transparent background, no text, no letters, no labels, no numbers, no arrows, no cast shadow, no frame, no border".
3. Model: GPT Image 2.5, background: transparent, rozdzielczość 2k. Kwadrat, chyba że obiekt jest wyraźnie szeroki (gzyms, fryz → 16:9 lub 21:9) albo wysoki (kolumna, pilaster → 9:16).
4. Pierwsza runda w jakości "medium". Obejrzyj każdy obraz. Jeśli ma tekst, kolor, uciętą krawędź, dodatkowe obiekty, nieprzezroczyste tło lub inny styl niż wzorzec — zrób go ponownie (maksymalnie 2 razy). Obrazy, które zostaną w filmie, wygeneruj raz jeszcze w "high" tylko jeśli w "medium" widać braki w detalach.
5. Zapisz pliki w images/ pod nazwami z listy, prompty w images/prompts.md.
6. Podaj, ile kredytów zużyto (sprawdź saldo przed i po) i ile to dolarów przy cenie [CENA ZA KREDYT, np. 0,049 USD]. Pokaż mi obrazy. Nie zaczynaj animacji.
```

---

## KROK 3 — lektor i animacja shorta

```
Teraz lektor i animacja. Przeczytaj KANAL.md.

1. Lektor:
   - Jeśli w KANAL.md nie ma jeszcze ID głosu: wygeneruj pierwsze zdanie narracji 3 różnymi polskimi, spokojnymi głosami (ElevenLabs v4 w Higgsfield), daj mi do odsłuchu, a wybrany zapisz w KANAL.md.
   - Przeczytaj narrację z script.md słowo w słowo, z poprawkami wymowy z listy trudnych słów.
   - Dokładne czasy każdego słowa uzyskaj wymuszonym dopasowaniem (np. faster-whisper / whisperX z word timestamps, język pl) na gotowym nagraniu i porównaj z tekstem scenariusza — w napisach ma być tekst ze scenariusza, nie z transkrypcji.
2. Animacja: projekt Remotion w tym folderze (jeśli szablon już istnieje — użyj go). 1080x1920, 60 fps, długość = lektor + 1 s. Tło i akcent z KANAL.md.
   Sposoby pokazywania:
   - powolne najazdy i odjazdy kamery,
   - lupa (koło powiększenia) wyrastająca z detalu, połączona z nim dwiema cienkimi liniami,
   - miękkie złote światła przesuwające się po ścieżkach na obrazach (obejrzyj obraz i wyznacz dokładną ścieżkę, np. wzdłuż profilu gzymsu albo konturu liścia akantu),
   - linie przekroju profilu, które same się rysują,
   - etykiety, które łagodnie się pojawiają: wersaliki, szeroki odstęp liter,
   - warstwy na różnej głębokości: dalsze ruszają się wolniej i są lekko rozmyte.
   Ruch (najważniejsze):
   - Jedna kamera dla całej sceny, jak kamera filmująca kartkę.
   - Każdy ruch zaczyna się powoli, przyspiesza i powoli wyhamowuje. Nic nie stoi i nic nie zatrzymuje się nagle; ruchy przechodzą jeden w drugi.
   - Nic nie wyskakuje: pojawianie się z lekką skalą i rozmyciem przez ok. 0,5 s.
   - Światła są miękkie z poświatą, nigdy twarde kropki.
   - Jedna rzecz naraz. Spokojnie.
   Napisy: wypalone, po 1–3 słowa, zsynchronizowane z czasami słów, w strefie 62–80% wysokości kadru, bieżące słowo podświetlone akcentem.
   Strefy bezpieczne: górne 8% i dolne 18% kadru bez niczego ważnego; prawe 12% bez tekstu (przyciski YouTube). Żaden obraz nie może być ucięty na krawędzi.
   Na końcu plansza CTA z KANAL.md.
   Szablon: obrazy, pozycje, ścieżki, etykiety i czasy w jednym pliku ustawień — nowy film = nowy plik ustawień. Napisy i etykiety mają być w pliku ustawień jako tekst, żeby wersja w innym języku wymagała tylko nowego lektora i przetłumaczonych napisów.
3. Kontrola: wyrenderuj klatkę co 0,5 s i na początku każdego zdania, obejrzyj wszystkie i popraw, co jest nie tak. Potem wyrenderuj film z lektorem do out/short.mp4 i daj mi go.
```

---

## KROK 4 — długi film (8–10 min)

```
Zróbmy pełny film na YouTube, 16:9. Przeczytaj KANAL.md. Jeśli w folderze jest już szablon animacji i obrazy z shortów — użyj ich ponownie.

Pracuj samodzielnie, ale zatrzymaj się w dwóch punktach kontrolnych (oznaczone ⏸). Poza nimi, jeśli coś jest niejasne, podejmij najlepszą decyzję i zapisz ją w PLAN.md.

Etap 1: plan i scenariusz
- 8–10 minut, ok. 1100–1300 słów, jeden spokojny lektor.
- Źródłem jest artykuł [LINK/ŚCIEŻKA]. Film rozwija artykuł, nie przepisuje go zdanie po zdaniu.
- Pierwsze 30 s: najciekawszy prawdziwy fakt, potem zapowiedź, czego dowiemy się do końca.
- 5–7 rozdziałów. Każdy odpowiada na jedno pytanie i kończy się małym pytaniem, które wciąga w następny. Zakończenie wraca do otwarcia, a ostatnie zdanie kieruje do artykułu.
- Każdy fakt, liczba, data i nazwisko w facts.md ze źródłem. Legendy oznaczone jako legendy. Bez pewnego źródła — wycinamy.
- Lista ujęć dla każdego zdania. Co najmniej co 5 sekund coś nowego na ekranie.
- Ok. 15–20 obrazów (pojedyncze obiekty, jeden styl z KANAL.md). Zaznacz, które obrazy już istnieją w images/.
- Zaplanuj 3–5 shortów, które da się wyciąć z tego filmu (po jednym pytaniu z rozdziału), każdy z własnym hakiem w pierwszym zdaniu.
- Zapisz w script.md, checklistę w PLAN.md i odhaczaj na bieżąco, żeby dało się wznowić pracę po przerwie.
⏸ Pokaż mi script.md i facts.md i poczekaj na akceptację.

Etap 2: obrazy — dokładnie jak w KROKU 2 (wzorzec stylu, transparent, medium → high tylko w razie potrzeby, maks. 2 poprawki). Policz kredyty.
⏸ Pokaż mi obrazy i poczekaj na akceptację.

Etap 3: lektor — ten sam głos i ustawienia z KANAL.md, generowany akapit po akapicie, połączony z naturalnymi pauzami (ok. 0,4 s między akapitami, 0,8 s między rozdziałami). Czasy słów z wymuszonego dopasowania jak w KROKU 3.

Etap 4: animacja — Remotion, 1920x1080, 30 fps. Jedna część na rozdział, połączone w jeden film. Te same zasady ruchu co w KROKU 3, plus: porównania obok siebie (np. kapitel dorycki / joński / koryncki), liczby i daty, które się odliczają, diagramy rysujące się linia po linii. Bez twardych cięć i czarnych klatek — rozdziały przechodzą przez ruch kamery. Nigdy nie trzymaj długo nieruchomej klatki; kamera zawsze lekko dryfuje. Napisy jako osobny plik .srt (nie wypalone). Na końcu plansza CTA z KANAL.md.

Etap 5: kontrola i render — dla każdego rozdziału klatka co sekundę, obejrzyj i popraw. Potem render do out/full-video.mp4.

Na koniec w youtube.md:
- tytuł (do 70 znaków, z frazą, pod którą jest artykuł),
- opis: 2 zdania streszczenia, link do artykułu w pierwszej linii, rozdziały z czasami, źródła z facts.md,
- 2 pomysły na miniaturę + wygeneruj obie w GPT Image 2.5 (16:9, styl z KANAL.md, jeden obiekt + maks. 3 słowa tekstu),
- skrypty i czasy shortów do wycięcia.

Mój temat: [TEMAT, np. „Liść akantu: jak jeden chwast z Grecji trafił na sufity polskich kamienic”]
```

---

## KROK 5 — shorty z długiego filmu

```
Z filmu w tym folderze zrób short nr [N] z listy w youtube.md. Nie wycinaj kadru z filmu 16:9 — zbuduj nową kompozycję 9:16 w szablonie shorta z tych samych obrazów. Napisz nową narrację (63–85 słów) z hakiem w pierwszym zdaniu, wygeneruj lektora tym samym głosem i postępuj dalej jak w KROKU 3. Nowych obrazów nie generuj, chyba że bez nich short nie ma sensu — wtedy najpierw zapytaj.
```

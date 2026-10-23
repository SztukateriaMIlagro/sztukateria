# Fakty i źródła — seria 1

Każde twierdzenie faktograficzne w narracji, ze źródłem. Symbolika (pick, find) opiera się na
`docs/content-guide.md` strony i jest podawana jako tradycja, nie fakt.

## f01 — Why buildings in Asia skip the 4th floor
- 4 (sì) brzmi prawie jak „śmierć” (sǐ) po mandaryńsku; podobnie po japońsku (shi) i koreańsku (sa); budynki pomijają
  4. (czasem 14., 24.) piętro; nazwa: tetrafobia. — https://en.wikipedia.org/wiki/Tetraphobia
- Na Zachodzie analogicznie pomija się 13. — https://en.wikipedia.org/wiki/Thirteenth_floor

## f02 — Lucky 8
- Otwarcie IO w Pekinie: 8.08.2008, **20:00** czasu chińskiego (popularne „8:08” to uproszczenie; część mediów tak
  podawała). — https://en.wikipedia.org/wiki/2008_Summer_Olympics_opening_ceremony
- 八 (bā) brzmi podobnie do 发 (fā, „bogacić się”); dopłaty za numery telefonów i tablice z ósemkami.
  — https://en.wikipedia.org/wiki/Chinese_numerology

## f03 — Why watch ads show 10:10
- Historia o Lincolnie to mit; powody projektowe: wskazówki nie zasłaniają logo i tarcz, układ symetryczny
  („uśmiech”); wcześniej popularne było 8:20. — https://www.snopes.com/fact-check/the-ten-ten-tenet/ ,
  https://www.mentalfloss.com/technology/why-1010-default-setting-clocks-and-watches ,
  https://factmyth.com/factoids/watches-are-typically-set-to-10-10-in-ads/

## f04 — Apollo 13
- Start 11.04.1970 o 14:13 EST = 13:13 czasu Houston (CST); eksplozja zbiornika tlenu 13.04.1970; cała trójka wróciła.
  — https://www.nasa.gov/image-article/launch-of-apollo-13-from-kennedy-space-center-april-11-1970 ,
  https://www.history.com/this-day-in-history/april-11/apollo-13-launched-to-moon
- „Two hundred thousand miles from home” — w chwili awarii statek był ok. 200 tys. mil (≈ 320 tys. km) od Ziemi.

## f05 — 616
- Papirus 115 (P. Oxy. 4499), z Oksyrynchos w Egipcie, datowany na ok. 225–275 r., podaje liczbę bestii jako 616;
  Ireneusz z Lyonu (II w.) znał wariant 616 i go odrzucał. — https://en.wikipedia.org/wiki/Papyrus_115 ,
  https://en.wikipedia.org/wiki/Number_of_the_beast

## f06 — Who invented angel numbers
- Pitagorejczycy uważali liczby za podstawę rzeczywistości. — https://en.wikipedia.org/wiki/Pythagoreanism
- Pojęcie „angel numbers” spopularyzowała Doreen Virtue (m.in. *Angel Numbers 101*, Hay House, 2008); w 2017 r.
  została chrześcijanką i wyrzekła się przekonań New Age. — https://en.wikipedia.org/wiki/Doreen_Virtue

## f07 — Why 11:11 keeps following you
- „Frequency illusion” — termin Arnolda Zwicky’ego (Language Log, 2005–2006): selektywna uwaga + efekt potwierdzenia.
  — https://languagelog.ldc.upenn.edu/nll/?p=42180 , https://en.wikipedia.org/wiki/Frequency_illusion

## f08 — Why the cat isn't in the Chinese zodiac
- Legenda o Wielkim Wyścigu (szczur nie budzi kota); w zodiaku wietnamskim kot zamiast królika.
  — https://en.wikipedia.org/wiki/Cat_(zodiac)

## f09 — Why a week has 7 days
- Siedem „wędrujących” ciał widocznych gołym okiem → nazwy dni (Sunday, Monday, Saturday; hiszp. martes–viernes);
  w angielskim Tiw, Woden, Thor, Frigg. — https://en.wikipedia.org/wiki/Names_of_the_days_of_the_week

## f10 — Birthstones 1912
- Sierpień 1912, Kansas City: (American) National Association of Jewelers przyjmuje oficjalną listę; tanzanit dodany do
  grudnia w 2002, spinel do sierpnia w 2016; wcześniejsze tradycje łączą 12 kamieni z napierśnikiem Aarona.
  — https://en.wikipedia.org/wiki/Birthstone , https://www.gemsociety.org/article/history-of-birthstones/

## m01 — Full moon names
- Nazwy pełni wg miesięcy (Wolf, Snow, Worm, Pink, Flower, Strawberry, Buck, Sturgeon, Corn, Hunter's, Beaver, Cold),
  spopularyzowane przez amerykańskie almanachy rolnicze. — https://www.almanac.com/full-moon-names ;
  strona: `src/content/moon/en/*`

## m02 — Birthstones by month
- Współczesna lista (Jewelers of America); czerwiec także kamień księżycowy (i aleksandryt), październik także turmalin.
  — https://en.wikipedia.org/wiki/Birthstone

## m03 — Life path number
- Metoda jak na stronie (`src/lib/numerology.ts`): redukcja miesiąca, dnia i roku osobno, potem suma; 11/22/33 to liczby
  mistrzowskie. Przykład 4.07.1990: 7 + 4 + (1+9+9+0=19→10→1) = 12 → 3.

## m04 — Chinese zodiac by birth year
- Cykl 12 zwierząt; rok zaczyna się w Chiński Nowy Rok (styczeń/luty). 2026 = Koń (od 17.02.2026),
  2027 = Koza (od 6.02.2027). — https://en.wikipedia.org/wiki/Chinese_zodiac ; strona: `docs/chinese-zodiac-brief.md`

## t01 — 11/11
- Rozejm kończący I wojnę światową wszedł w życie o 11:00, 11 listopada 1918; w wielu krajach minuta ciszy o 11:00.
  — https://en.wikipedia.org/wiki/Armistice_of_11_November_1918 , https://en.wikipedia.org/wiki/Remembrance_Day

## t02 — Closest full moon of 2026
- Pełnia 24.12.2026, 01:28 UTC (wieczór 23.12 w obu Amerykach), odległość 356 729 km — najmniejsza spośród pełni 2026.
  Dane: `src/data/moon-times.ts` strony (astronomy-engine). Grudniowa pełnia = Cold Moon; zimą pełnia wędruje wysoko po
  niebie i świeci prawie całą noc (na półkuli północnej).

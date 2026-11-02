# Clothing Calculator

En webbapp som rekommenderar vad du ska ha på dig utifrån vädret där du är, hur aktiv du är och hur lätt du fryser eller blir varm.

## Vad programmet gör

1. Du väljer **aktivitetsnivå**: vila, promenad eller löpning.
2. Du ställer in **temperaturkänslighet** med ett reglage (från "Very easily cold" till "Very easily warm").
3. Du skriver in en **plats** eller hämtar den automatiskt med webbläsarens geolocation (markör-knappen).
4. Du trycker på **Calculate**, och appen:
   - hämtar aktuellt väder för platsen från OpenWeatherMap (temperatur, "känns som", vind, luftfuktighet, väderbeskrivning),
   - räknar ut ett isoleringsvärde (clo-score) mellan 0 och 7,
   - visar en rekommenderad outfit som bild och som lista med plagg,
   - visar väderinformation med emoji.

Om det regnar (åska, duggregn eller regn) byts outfiten ut mot en regnanpassad variant, till exempel med regnjacka, vattentäta skor eller paraply.

### Beräkningen

```
basisolering  = 1 + (20 - upplevd temperatur °C) / 20
isolering     = basisolering + aktivitetsjustering + känslighetsjustering
clo-score     = avrunda((isolering - 0.75) / 0.35), begränsat till 0–7
```

| Aktivitet | Justering | | Känslighet | Justering |
|-----------|-----------|-|------------|-----------|
| Vila      | +0.35     | | Very easily cold | +0.5  |
| Promenad  | 0         | | Easily cold      | +0.25 |
| Löpning   | −0.8      | | Average          | 0     |
|           |           | | Easily warm      | −0.25 |
|           |           | | Very easily warm | −0.5  |

Clo-score 0 ger t.ex. t-shirt och shorts, medan 7 ger termiskt underställ, parkas, vantar, mössa och halsduk.

Idén bygger på clo-begreppet (klädisolering) och forskning om komfortgränser för klädsel. Se artikeln i `src/`.

## Tekniker

- **HTML5**: sidstruktur och formulärelement (knappar, range-reglage, textfält).
- **CSS3**: layout och utseende i `styles.css`.
- **JavaScript (vanilla, ES6+)**: all logik i `index.js`, utan ramverk eller byggsteg. Använder bland annat `async`/`await`, `fetch`, destructuring, template literals och DOM-manipulation.
- **[OpenWeatherMap API](https://openweathermap.org/current)**: väderdata, både via ortnamn och via koordinater (omvänd geolocation).
- **Geolocation API**: hämtar användarens position i webbläsaren.
- **[Flaticon UIcons](https://www.flaticon.com/uicons)**: ikoner för aktivitetsknapparna och platsknappen (laddas från CDN).

## Kom igång

Projektet är statiskt och kräver ingen installation.

```bash
# Alternativ 1: öppna filen direkt
open index.html

# Alternativ 2: lokal server (rekommenderas, och krävs för geolocation i vissa webbläsare)
python3 -m http.server 8000
# öppna sedan http://localhost:8000
```

### API-nyckel

Appen behöver en egen API-nyckel från [OpenWeatherMap](https://openweathermap.org/api). Lägg in den i konstanten `apiKey` högst upp i `index.js`.

## Projektstruktur

```
.
├── index.html   # sidans struktur
├── styles.css   # utseende
├── index.js     # logik: väderhämtning, beräkning, rendering
├── img/         # outfit-bilder (0–7, samt regnvarianter)
└── src/         # bakgrundsmaterial (forskningsartikel)
```

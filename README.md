# BuildVersionClient

BuildVersionClient är en liten Angular-applikation (Angular 20) som konsumerar en BuildVersion REST API (v1).

Syfte
- Visa och hantera build-versioner för projekt (lista, sök efter namn, skapa/uppdatera, incrementera versioner).
- Erbjuda en stabil, statiskt typad klient mot APIets v1-specifikation (ingen dynamisk OpenAPI-discovery längre).

Snabbstart
1. Installera beroenden:

```powershell
npm install
```

2. Starta dev-servern:

```powershell
npm start
```

Öppna webbläsaren på http://localhost:4200/.

Bygga

```powershell
npm run build
```

Tester

```powershell
npm test
```

Arkitektur & viktiga delar
- `src/app/services/build-version.service.ts` — Statisk, typed klient för v1-endpoints. Använder `environment.buildVersionApiBaseUrl` som bas-URL.
- `src/app/services/build-version.types.ts` — Trimade DTO-typer som används i klienten.
- `src/app/pages/build-version-list` — Standalone-komponenten som visar listan och erbjuder sök ("Get by name") som nu visar resultat i en dialog.
- `src/app/pages/dialogs/build-version-detail-dialog.ts` — Dialog som visar alla fält från en hittad BuildVersion eller ett felmeddelande.
- `src/app/services/theme.service.ts` — Enkel ThemeService för att toggla och persistenta tema-val (light/dark).
- `src/test-setup.ts` — Global test-setup som resetter lokalt state (t.ex. theme localStorage) för att undvika flakiga tester.

Konfiguration
- Bas-URL för API: ändra `src/environments/environment.ts` / `environment.prod.ts`:

```ts
export const environment = {
	production: false,
	buildVersionApiBaseUrl: 'https://buildversionservice.local'
};
```

Utvecklingsriktlinjer
- Projektet använder standalone-komponenter för enkel testbarhet.
- Byt inte tillbaka till dynamisk OpenAPI-discovery utan att ha en tydlig anledning — den statiska klienten är avsedd att ge stabilitet och typ-säkerhet.

Generera (fulla) typer från OpenAPI (valfritt)
- Om du vill generera fullständiga TypeScript-typer från ett OpenAPI-spec kan du använda t.ex. `openapi-generator-cli` eller `nswag` och placera resultet i `src/app/services/`.
- Rekommenderat kommando (exempel med openapi-generator):

```bash
npx @openapitools/openapi-generator-cli generate -i https://buildversionservice.local/openapi/v1.json -g typescript-angular -o tmp/openapi
```

Om du genererar stora typer, tänk på att trimma eller dela upp filerna för att hålla lokala editor- och test-upplevelser rimliga.

Varför GitHub Copilot?
- Under migreringen till en statisk, typad klient och när UI-förbättringar skrevs, användes GitHub Copilot som assistent för att snabba upp återkommande mönster, förslag och testkod. Copilot kan vara ett kraftfullt verktyg för produktivitet — använd det som en medhjälpare men granska alltid förslag innan accept.

Ändra och arbeta med koden
- API-adresser och miljöer: `src/environments/*.ts`.
- Ny komponent: skapa en ny standalone-komponent och importera den där den används.
- Tester: lägg till enhetstester i `src/app/**/*.spec.ts` och använd `HttpClientTestingModule` för HTTP-testning.

Changelog och code review
- Se `CHANGELOG.md` för en kronologisk lista över ändringar sedan första commit.
- Se `CODE_REVIEW.md` för en sammanfattning och rekommendationer inför nästa iteration.

Licens & bidrag
- Standard open-source: lägg till en licensfil om du vill dela koden offentlig.

---
Den här README uppdaterades 2025-10-21 för att reflektera migrationen till en statisk v1-klient, UI- och testförbättringar och dokumentationstillägg.

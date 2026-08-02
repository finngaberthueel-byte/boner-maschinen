# boner maschinen — Website

```
index.html                  Website + Verwaltung (alles in einer Datei)
functions/api/[[pfad]].js   Backend: Login, Angebote, Bilder
README.md                   diese Anleitung
```

Gehostet bei Cloudflare Pages. Die Angebote liegen in einem KV-Speicher, nicht im Code —
der Kunde ändert sie über `deine-domain.ch/#verwaltung` und sie sind sofort live.

---

# Livegang — Klick für Klick

## Teil 1 · Repository auf GitHub (5 Min)

1. **github.com** öffnen, einloggen
2. Oben rechts auf **`+`** → **New repository**
3. **Repository name:** `boner-maschinen`
4. **Public** oder **Private** — beides geht
5. **Create repository** klicken
6. Auf der nächsten Seite: **uploading an existing file** anklicken
7. Die Dateien hineinziehen: `index.html`, `README.md` **und den ganzen Ordner `functions`**
   → Der Ordner muss mit hochgeladen werden, sonst funktioniert die Verwaltung nicht.
   Prüfen: im Repository muss `functions/api/[[pfad]].js` sichtbar sein.
8. Unten **Commit changes** klicken

---

## Teil 2 · Cloudflare-Konto (2 Min)

9. **dash.cloudflare.com/sign-up** öffnen
10. E-Mail und Passwort eingeben → **Sign Up**
11. Bestätigungsmail öffnen, Link anklicken

---

## Teil 3 · Projekt anlegen (5 Min)

12. Im Cloudflare-Dashboard links auf **Compute (Workers)** → **Workers & Pages**
13. Blauer Knopf **Create** (oder **Create application**)
14. Reiter **Pages** wählen
15. **Connect to Git** klicken
16. **Connect GitHub** → GitHub-Login bestätigen
17. **Only select repositories** → `boner-maschinen` auswählen → **Install & Authorize**
18. Zurück bei Cloudflare: `boner-maschinen` in der Liste anklicken → **Begin setup**
19. Einstellungen:
    - **Project name:** `boner-maschinen`
    - **Production branch:** `main`
    - **Framework preset:** `None`
    - **Build command:** **leer lassen**
    - **Build output directory:** `/`
20. **Save and Deploy** klicken
21. Warten bis **Success** erscheint (ca. 1 Min). Die Adresse lautet
    `boner-maschinen.pages.dev` — anklicken, die Website ist schon da.
    Die Verwaltung funktioniert noch nicht, das kommt jetzt.

---

## Teil 4 · Speicher anlegen (3 Min)

22. Links im Menü **Storage & Databases** → **KV**
23. **Create Instance** (oder **Create a namespace**)
24. **Namespace name:** `boner-daten` → **Add**

---

## Teil 5 · Speicher mit der Website verbinden (3 Min)

25. Links **Workers & Pages** → Projekt **boner-maschinen** anklicken
26. Reiter **Settings**
27. Abschnitt **Bindings** → **Add** → **KV namespace**
28. Ausfüllen:
    - **Variable name:** `DATEN`  ← genau so, gross geschrieben
    - **KV namespace:** `boner-daten` auswählen
29. **Save** klicken

---

## Teil 6 · Passwort setzen (2 Min)

30. Gleiche Seite, Abschnitt **Variables and Secrets** → **Add**
31. Ausfüllen:
    - **Type:** `Secret` auswählen
    - **Variable name:** `ADMIN_PASSWORT`  ← genau so
    - **Value:** das Wunschpasswort, z. B. `Kueblis-Maschinen-2026`
32. **Save** klicken

---

## Teil 7 · Neu veröffentlichen (2 Min)

Bindings greifen erst nach einem neuen Deployment.

33. Reiter **Deployments**
34. Beim obersten Eintrag rechts auf **⋯** → **Retry deployment**
35. Warten bis **Success**

---

## Teil 8 · Testen (3 Min)

36. `boner-maschinen.pages.dev/#verwaltung` öffnen
37. Passwort aus Schritt 31 eingeben → **Anmelden**
38. Bei einer Maschine auf **Bearbeiten**, den Preis ändern → **Übernehmen**
39. Oben **Veröffentlichen** klicken
40. `boner-maschinen.pages.dev` in einem neuen Tab öffnen → der neue Preis steht da

Klappt das, ist alles korrekt eingerichtet.

---

## Teil 9 · Eigene Domain (10 Min + Wartezeit)

41. Projekt → Reiter **Custom domains** → **Set up a domain**
42. `bonermaschinen.ch` eingeben → **Continue**
43. Cloudflare zeigt zwei Nameserver an, z. B. `ada.ns.cloudflare.com`. Notieren.
44. Beim Domain-Anbieter des Kunden einloggen (Hostpoint, Infomaniak, Switchplus …)
45. Dort **Nameserver** oder **DNS-Server** suchen und durch die zwei von Cloudflare ersetzen
46. Speichern. Umstellung dauert 1–24 Stunden, meist unter einer Stunde.
47. Danach läuft die Seite unter `bonermaschinen.ch`, https kommt automatisch

---

# Für den Kunden

**Adresse:** `bonermaschinen.ch/#verwaltung`
**Passwort:** das aus Schritt 31

Ablauf: anmelden → **Neue Maschine** oder **Bearbeiten** → Felder ausfüllen, Fotos
auswählen → **Übernehmen** → oben **Veröffentlichen**. Sofort live.

Die Anmeldung gilt 12 Stunden, danach neu einloggen. Passwort ändern: Schritt 30–35 wiederholen.

---

# Vor dem Livegang ersetzen

| Wo | Was |
|---|---|
| ganze Datei | `081 000 00 00` und `tel:+41000000000` → echte Nummer |
| Hero, Zeitleiste | `[Jahr]` — Gründung, Werkstatt, Übergabe |
| Kontakt, Impressum | `[Strasse und Nr.]` der Werkstatt in Küblis |
| Kontakt | `[Zeiten]` Öffnungszeiten |
| Impressum | `[MWST-Nummer]` |
| Datenschutz | `[Datum eintragen]` |
| Verwaltung | die sechs Beispielmaschinen löschen |
| Platzhalter-Kacheln | echte Fotos aus Werkstatt und Ausstellung |

**Geprüfte Angaben** (öffentliche Register): Einzelunternehmen, Inhaber Ambrosi Boner,
Sitz Oberdorfstrasse 36, 7247 Saas im Prättigau, UID CHE-113.543.167,
E-Mail `info@bonermaschinen.ch`. Telefonnummer nicht auffindbar — beim Kunden erfragen.

---

# Wenn etwas klemmt

| Meldung | Ursache |
|---|---|
| «KV-Namespace DATEN ist nicht verbunden» | Teil 5 fehlt oder Variable heisst nicht exakt `DATEN`. Danach Teil 7 wiederholen. |
| «ADMIN_PASSWORT ist nicht gesetzt» | Teil 6 fehlt. Danach Teil 7 wiederholen. |
| «Passwort stimmt nicht» | Gross-/Kleinschreibung prüfen, Leerzeichen am Ende |
| «Nicht angemeldet oder Sitzung abgelaufen» | 12 Stunden vorbei — neu anmelden |
| Verwaltung zeigt Beispielmaschinen statt der echten | Noch nie **Veröffentlichen** gedrückt |
| Bilder kommen nicht | Immer die https-Adresse verwenden, nicht die Datei lokal öffnen |

---

# Bemerkungen

- **Karte:** bewusst kein Google-Maps-Einbindung. Beim Livegang kommt an der markierten
  Stelle eine OpenStreetMap-Karte via Leaflet.
- **Schriften:** von Google Fonts geladen. Für maximale DSG-Sauberkeit lokal einbinden.
- **Kosten:** Cloudflare Pages und KV sind im Gratis-Tarif. Nur die Domain kostet.
- **Wiederverwendung:** Das gleiche Muster funktioniert bei jedem weiteren Kunden —
  neues Repo, neues Pages-Projekt, neuer KV-Namespace, fertig.

---

© 2026 Voltrix – Website erstellt für boner maschinen

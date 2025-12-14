# Konflikt-Wiederherstellung (schneller Reset)

Falls du weiterhin Merge-Konflikte siehst, hilft ein harter Reset auf den aktuellen Remote-Stand plus ein neuer Branch. **Achtung:**
dabei gehen lokale Änderungen verloren, also zuvor alles committen oder sichern.

## Schnellanleitung
```bash
git fetch --all --prune
# Auf den Hauptbranch wechseln (hier: work). Passe den Namen an, falls dein Remote anders heißt.
git checkout work
# Auf den Remote-Stand des Branches zurücksetzen
# (passt branch-name an, z. B. origin/main, wenn dein Remote-Branch main heißt)
git reset --hard origin/work
# Neuen sauberen Branch für deine Arbeit anlegen
git checkout -b feature-wm-clean
```

Danach kannst du wie gewohnt Abhängigkeiten installieren und starten:
```bash
npm install          # einmalig im Projekt-Root, damit npm-run-all verfügbar ist
npm run install:all  # installiert Backend + Frontend
npm run dev          # startet beide parallel
```

## Warum dieser Weg hilft
- Der Hard-Reset entfernt alle lokalen Konfliktmarker und setzt deine Dateien exakt auf den Remote-Stand.
- Ein neuer Branch stellt sicher, dass du nicht erneut alte Konflikte mitziehst.
- `git fetch --all --prune` räumt Referenzen zu gelöschten Remote-Branches auf, damit du den richtigen Branch erwischst.

## Falls du lokale Änderungen behalten musst
1. Sichere sie vorab: `git stash push -m "backup"` oder `git commit`.
2. Führe danach den Reset wie oben aus.
3. Hole deine Änderungen zurück: `git stash pop` (kann wieder Konflikte erzeugen, dann gezielt lösen) oder per `git cherry-pick <commit>`.

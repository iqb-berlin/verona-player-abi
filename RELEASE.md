# Release Note 5.0.0-rc #

## UI-Anpassungen ##

* Verbesserte Anzeige der required Felder - tbc
* Dropdown und Counter Felder können nun auch mit Enter-Taste bestätigt werden
* Verbesserung der Accessibility durch bessere Nutzung von aria-Labeln - tbc

## Funktions-Änderungen ##
siehe auch neue iqb-scripted Version

* Likert Elemente können nun ebenfalls als required gesetzt werden
* dabei kann nur der komplette Likert Block als required gesetzt werden
* dadurch wird jedes Likert Element required gesetzt


* Reset Button (kleines x) bei Radio-Button-Gruppen - UI tbd
* dadurch wird eine bereits getätigte Auswahl wieder zurück gesetzt
* einsetzbar bei multiple-choice und likert

## Neue iqb-scripted Version ##

* Required für likert
* Reset Button für Checkbox-Gruppen
* Reset Button für Likert-Buttons
* Label-Feld für alle Elemente

## Technische Neuerungen ##

* Migration auf Angular Version 19
* Umstellung von @Input, @Output auf input(), output()
* Umstellung auf zoneless

# Release Notes 5.0.0 #

## UI-Anpassungen ##

* Verbesserte Anzeige der required Felder
* Dropdown und Counter Felder können nun auch mit Enter-Taste bestätigt werden
* Verbesserung der Accessibility durch bessere Nutzung von aria-Labeln

## Funktions-Änderungen ##
siehe auch neue iqb-scripted Version

* Likert Elemente können nun ebenfalls als required gesetzt werden
* dabei kann nur der komplette Likert Block als required gesetzt werden
* dadurch wird jedes Likert Element required gesetzt


* Reset Button (kleines x) bei Radio-Button-Gruppen
* dadurch wird eine bereits getätigte Auswahl wieder zurückgesetzt
* einsetzbar bei multiple-choice und likert

## Neue iqb-scripted Version ##

* Required für likert
* Reset-Button für Checkbox-Gruppen
* Reset-Button für Likert-Buttons

## Technische Neuerungen ##

* Migration auf Angular Version 19
* Umstellung von @Input, @Output auf input(), output()
* Umstellung auf zoneless

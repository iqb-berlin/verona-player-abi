# iqb-scripted Syntax im Detail
iqb-scripted@1.2, Dezember 2024

## Versionsangabe ##

| Schlüsselwort  | Bedeutung                    | Parameter |
|----------------|------------------------------|-----------|
| `iqb-scripted` | Angabe der genutzten Version | `1.2`     |

Erste Zeile des Skripts muss die benutzte iqb-scripted Version enthalten.

**Beispiele**

```
iqb-scripted::1.2
```

## Textgestaltung ohne Eingabe[](#textgestaltung-ohne-eingabe)

Wird bei den Schlüsselworten title, header oder text der jeweilige Parameter weggelassen, wird ein Zeilenabstand in der jeweiligen Höhe eingefügt.


| Schlüsselwort | Bedeutung                                                                                                                                          | Parameter                        |
|---------------|----------------------------------------------------------------------------------------------------------------------------------------------------|----------------------------------|
| `title`       | eine Zeile Text als oberste Gliederungsüberschrift                                                                                                 | Text des Titels (optional)       |
| `header`      | eine Zeile Text als zweite Gliederungsüberschrift                                                                                                  | Text der Überschrift (optional)  |
| `text`        | Standard-Text                                                                                                                                      | Text (optional)                  |
| `html`        | wird genau so in das Formular übernommen; dient der Lösung besonderer Layout-Probleme; Achtung: unsichere Inhalte wie Links werden herausgefiltert | Html-Text                        |
| `hr`          | stellt eine horizontale Linie dar                                                                                                                  | _keine_                          |
| `rem`         | leitet einen Kommentar ein, der bei der Verarbeitung ignoriert wird                                                                                | Text des Kommentars (optional)   |

**Beispiele**

```
title::na sowas!
html::And now <strong>this text here is bolded</strong>
hr
text::Einfach nur so mal Text, der aber - wenn zu wenig Platz ist - auch mal umgebrochen wird.??Aber nicht vergessen: Ab und zu mit der Maus drüber!
rem::ab hier noch Nummern der Fragen prüfen!!!!!
header::Abschnitt 223
```

## Eingabe von Text und Zahlen[](#eingabe-von-text-und-zahlen)


| Schlüsselwort  | Parameter                                                          | Standardwert              |
|----------------|--------------------------------------------------------------------|---------------------------|
| `input-text`   | 1\. Name der Variablen, in die die Eingabe gespeichert werden soll | _Angabe ist erforderlich_ |
|                | 2\. Pflichtfeld: `0`\=nein, `1`\=ja                                | `0`                       |
|                | 3\. Text vor dem Eingabefeld (Eingabeaufforderung)                 | _kein Text_               |
|                | 4\. Text nach dem Eingabefeld                                      | _kein Text_               |
|                | 5\. Anzahl von Zeilen (>1 bedeutet mehrzeiliges Eingabefeld)       | 1                         |
|                | 6\. maximale Anzahl von Zeichen bei der Eingabe                    | _unbegrenzt_              |
| `input-number` | 1\. Name der Variablen, in die die Eingabe gespeichert werden soll | _Angabe ist erforderlich_ |
|                | 2\. Pflichtfeld: `0`\=nein, `1`\=ja                                | `0`                       |
|                | 3\. Text vor dem Eingabefeld (Eingabeaufforderung)                 | _kein Text_               |
|                | 4\. Text nach dem Eingabefeld                                      | _kein Text_               |
|                | 5\. Minimalwert                                                    | _kein_                    |
|                | 6\. Maximalwert                                                    | _kein_                    |

**Beispiele**

```
input-number::task12ahmfA::1::Teilaufgabe 1.2a (Analysis)::::0::10
input-text::note::0::Weitere Kommentare zu den Prüfungsaufgaben (optional)::::20??Abschließend haben Sie an dieser Stelle die Möglichkeit, zusätzliche Hinweise und Kommentare zu den Prüfungsaufgaben und Erwartungshorizonten festzuhalten.
input-number::A155f::1::Wie viel wiegt ungefähr eine Kuh?::kg::1::1000
```

#### Weitere Erläuterungen[](#weitere-erläuterungen)

Mehrzeilige Eingabefelder sind mindestens zwei Zeilen hoch, auch wenn sie leer sind. Bei der Eingabe vergrößert sich dann das Eingabefeld nach Bedarf. Die angegebene Obergrenze gilt nur für die Darstellung, nicht für den Inhalt, d. h. sollte mehr eingegeben werden, als in die angegebenen Zeilen passt, wird ein Scrollbalken eingeblendet und die weitere Eingabe ist nicht blockiert.

Ungültige Eingaben (z. B. Grenze des numerischen Feldes überschritten) erzeugen einen roten Hinweistext. Der eingegebene Wert wird nicht gespeichert.

Bei numerischen Eingaben ist als Dezimaltrennzeichen sowohl ein Komma als auch ein Punkt erlaubt. Bei der Auswertung muss beides vorgesehen werden.

Ein Pflichtfeld ist zunächst nicht hervorgehoben. Erst wenn das Eingabefeld besucht und ohne eine Eingabe verlassen wurde, ist ein roter Hinweistext eingeblendet.

#### Antwortdaten[](#antwortdaten)

Die Eingabe wird stets als `string` gespeichert, auch wenn es sich um eine Zahl handelt.

## Ankreuzen und Auswählen[](#ankreuzen-und-auswählen)

Bei einer `checkbox` kreuzt man nur an. Bei `multiple-choice` werden die Optionen untereinander dargestellt und es kann nur eine Option ausgewählt werden. Bei `drop-down` werden die Optionen in eine Klappbox gepackt, was Platz spart.


| Schlüsselwort                      | Parameter                                                                                                                         | Standardwert              |
|------------------------------------|-----------------------------------------------------------------------------------------------------------------------------------|---------------------------|
| `checkbox`                         | 1\. Name der Variablen, in die die Eingabe gespeichert werden soll                                                                | _Angabe ist erforderlich_ |
|                                    | 2\. Pflichtfeld: `0`\=nein, `1`\=ja                                                                                               | `0`                       |
|                                    | Achtung: Pflichtfeld bedeutet hier, dass die Checkbox ausgewählt/angekreuzt sein muss (z. B. Zustimmung zu Datenschutzfragen).    |                           |
|                                    | 3\. Text vor dem Eingabefeld (Eingabeaufforderung)                                                                                | _kein Text_               |
|                                    | 4\. Text nach dem Eingabefeld                                                                                                     | _kein Text_               |
|                                    | Achtung: Als Wert der Variablen wird ‘true’ oder ‘false’ gespeichert. Der Wert der Variable ist im Ausgangszustand immer ‘false’. |                           |
| `multiple-choice` oder `drop-down` | 1\. Name der Variablen, in die die Eingabe gespeichert werden soll                                                                | _Angabe ist erforderlich_ |
|                                    | 2\. Pflichtfeld: `0`\=nein, `1`\=ja                                                                                               | `0`                       |
|                                    | 3\. Text vor der Optionsliste (Eingabeaufforderung)                                                                               | _kein Text_               |
|                                    | 4\. ResetButton anzeigen: `0`\=nein, `1`\=ja [^1]                                                                                 | `0`                       |
|                                    | 5\. Liste der Optionen, jeweils getrennt durch `##`                                                                               | _keine_                   |
|                                    | Achtung: Als Wert der Variablen wird die Position der gewählten Option gespeichert, beginnend mit `1`.                            |                           |

### Gruppe von Ankreuzkästchen[](#gruppe-von-ankreuzkästchen)

Manchmal möchte man mehrere Ankreuzkästchen mit einer gemeinsamen Instruktion zusammenfassen. Links wird dann diese Aufforderung bzw. Frage platziert, und rechts eine Liste von Ankreuzmöglichkeiten.


| Schlüsselwort      | Parameter                                                                     | Standardwert |
|--------------------|-------------------------------------------------------------------------------|--------------|
| `checkboxes-start` | 1\. Text links als Aufforderung oder Frage                                    |              |
| `checkbox`         | Parameter identisch mit oben; es wird allerdings nur der erste Text verwendet |              |
| `checkboxes-end`   | beendet den Block; ohne Parameter                                             |              |

**Beispiele**

```
checkbox::task162ahmfF::0::Sie fühlen sich beunruhigt
multiple-choice::task3wtrtimeS::1::Ich fühle mich heute großartig::trifft gar nicht zu##trifft eher nicht zu##trifft eher zu##trifft voll zu
drop-down::ta33S::1::Ich fühlte mich gestern großartig::##trifft gar nicht zu##trifft eher nicht zu##trifft eher zu##trifft voll zu
checkboxes-start::Wann schauen Sie besonders gern aus dem Fenster?
  checkbox::fenster01::Morgens
  checkbox::fenster02::Mittags
  checkbox::fenster03::Abends
  checkbox::fenster04::Nachts
checkboxes-end
```

### Antwortdaten[](#antwortdaten-1)

In den Daten sind bei Checkboxen `true` oder `false` gespeichert. Wenn eine Checkbox noch nicht gezeigt wurde, dann ist ihr Status `NOT_REACHED`, aber der Wert ist schon `false`. Erst wenn sie gezeigt wurde, sollte der Wert verwendet werden (Status `DISPLAYED`). Und wenn der Status `VALUE_CHANGED` berichtet wird, hat die Testperson bewusst einen Wert geändert.

Bei der Klappbox und der Gruppe von Radio-Buttons wird stets die Position der gewählten Option in die Antwortdaten geschrieben, beginnend mit `1`. Wenn eine Klappbox nicht als Pflichtfeld markiert ist, wird automatisch eine leere Option hinzugefügt, die dann den Antwortwert `1` erhält.

## Mehrfachauswahl in Tabellen[](#mehrfachauswahl-in-tabellen)

Mit dem `likert` Element kann eine Liste von Fragen mit einer einheitlichen Antwortskala definiert werden. Sie funktioniert ähnlich wie eine Liste von exklusiven Checkboxen mit dem Unterschied, dass Antworten-Optionen nur einmal im Tabellenkopf definiert werden müssen. Diese Form ist sehr platzsparend und kann schnell beantwortet werden.


| Schlüsselwort  | Parameter                                                                         | Standardwert                              |
|----------------|-----------------------------------------------------------------------------------|-------------------------------------------|
| `likert-start` | 1\. Liste der Antwortoptionen jeweils getrennt durch `##`                         | _Angabe ist erforderlich_                 |
|                | 2\. Pflichtfeld: `0`\=nein, `1`\=ja [^1]                                          | `0`                                       |
|                | 3\. ResetButton anzeigen: `0`\=nein, `1`\=ja [^1]                                 | `0`                                       |
| likert         | 1\. Name der Variablen, in die die Eingabe gespeichert werden soll 2. (Frage)Text | _mindestens eine Angabe ist erforderlich_ |
| `likert-end`   | 1\. keine                                                                         | _Angabe ist erforderlich_                 |

**Beispiele**

```
likert-start::1::0::sehr hilfreich##eher hilfreich##teilweise hilfreich##eher nicht hilfreich##nicht hilfreich
    likert::task2useA::Abschnitt 1: Einleitung
    likert::task2useB::Abschnitt 2: Starten der Computer
    likert::task2useC::Abschnitt 3: Anmeldung
    likert::task2useD::Abschnitt 4: Steuerung über Testleitungskonsole
    likert::task2useE::Abschnitt 5: Speichern/Beenden
likert-end
```

### Antwortdaten[](#antwortdaten-2)

Es wird für jede Zeile und damit Variable die Spalte der gewählten Option in die Antwortdaten geschrieben, beginnend mit `1`.

## Unterformulare[](#unterformulare)

`repeat-start` und `repeat-end` markieren einen Block von Elementen, der während der Beantwortung dynamisch mehrfach erzeugt wird. Dazu muss die befragte Person eine Zahl eingeben, die die Anzahl der Wiederholungen steuert.

Innerhalb des Blocks sind Ein- und Ausblendungen erlaubt. Die Variable, deren Wert das Ein- bzw. Ausblenden steuert, wird zuerst im selben Unterformular gesucht, dann eine Ebene höher usw. Man kann sich nicht auf Variablenwerte in anderen Unterformularen desselben Formularblockes beziehen.


| Schlüsselwort  | Parameter                                                                                                  | Standardwert              |
|----------------|------------------------------------------------------------------------------------------------------------|---------------------------|
| `repeat-start` | 1\. ID des Blockes mit Unterformularen                                                                     | _Angabe ist erforderlich_ |
|                | 2\. Text vor dem Eingabefeld (Eingabeaufforderung)                                                         | _kein Text_               |
|                | 3\. Text für die Überschrift zu Beginn jeden Blockes (Blocknummer wird jeweils dynamisch dahinter gesetzt) | ‘Block’                   |
|                | 4\. Maximalwert für die Anzahl der Blöcke                                                                  | 10                        |
| `repeat-end`   | _keine_                                                                                                    |                           |

**Beispiel**

```
rem::Schleife für alle Prüflinge
repeat-start::examineecount::Wie viele Prüflinge gibt es?::Angaben zu Prüfling::20??Sie können Angaben zu maximal 20 Prüflingen eintragen. Sollten sich im Kurs mehr als 20 Prüflinge befinden, ist eine Auswahl vorzunehmen. Diese Auswahl sollte so erfolgen, dass ein möglichst breites Leistungsspektrum abgebildet wird. Vermieden werden sollte eine selektive Berücksichtigung bzw. Nichtberücksichtigung bestimmter Gruppen (z. B. besonders leistungsschwache oder leistungsstarke Prüflinge, Schülerinnen und Schüler mit nichtdeutscher Herkunftssprache).
    input-number::task1::1::Teilaufgabe 1::::0::10
    input-number::task2::1::Teilaufgabe 2::::0::10
    input-number::task3::1::Teilaufgabe 3::::0::10
repeat-end
```

### Antwortdaten[](#antwortdaten-3)

Für ein Unterformular gibt es eine Variable, die die von der Testperson eingegebene Anzahl der Unterformulare enthält. Die ID dieser Variable entspricht der ID des Blockes mit den Unterformularen. Weitere Erklärungen finden Sie unter **Praktische Hinweise/ Arbeiten mit Unterformularen**.

## Ein- und Ausblenden von Formularteilen[](#ein--und-ausblenden-von-formularteilen)

`if-start` und `if-end` markieren einen Block von Elementen, der in Abhängigkeit des Wertes einer Variablen gezeigt oder ausgeblendet wird. Dabei wird der eingegebene Wert mit einem Sollwert verglichen. Mit `if-else` können Elemente ein-/ausgeblendet werden, wenn der Wert **nicht** mit dem Sollwert übereinstimmt.

| Schlüsselwort | Parameter                                              |
|---------------|--------------------------------------------------------|
| `if-start`    | 1\. Name der Variablen, deren Wert geprüft werden soll |
|               | 2\. Wert                                               |
| `if-else`     | _keine_                                                |
| `if-end`      | _keine_                                                |

### Unterformulare[](#unterformulare-1)

Wenn sich der Block in einem Unterformular befindet, wird die Variable zur Prüfung der Bedingung zunächst in diesem Unterformular gesucht. Danach wird in dem darüber liegenden Unterformular gesucht usw. Es ist nicht möglich, auf Variablenwerte eines anderen Unterformulars derselben Ebene bzw. außerhalb des genannten Pfades zuzugreifen.

## Schalter zur Navigation[](#schalter-zur-navigation)

nav-button-group ermöglicht das Einfügen von Navigationselementen. Art und Reihenfolge können gewählt werden. Mögliche Bedienelemente sind: `next`, `previous`, `first`, `last` und `end`.

| Schlüsselwort      | Parameter                                         |
|--------------------|---------------------------------------------------|
| `nav-button-group` | 1\. Liste der Optionen, jeweils getrennt durch ## |

**Beispiele**

```
nav-button-group::previous##next##first##last##end
nav-button-group::next
```

[^1]: neu in Version 1.2

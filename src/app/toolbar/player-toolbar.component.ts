import {
  Component, EventEmitter, Input, Output
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { lastValueFrom, map } from 'rxjs';
import { VeronaService } from '../verona/verona.service';
import { InputScriptDialog } from './input-script-dialog.component';

const testScript1 = `iqb-scripted::1.0
title::Testscript Title??Hilfetext1
header::Abschnitt 1 Basic Elements??Hilfetext1
header
text::Standard Text Element??Hilfetext1
html::HTML Element with <strong>strong</strong> text and hyperlink: <a href=”https://www.iqb.hu-berlin.de”>IQB website</a>??Hilfetext1
hr
rem::Kommentar. Soll nicht erscheinen!
header::Abschnitt 2 Eingabeelemente
input-text::text_var1::1::Text eingeben::Text nach Feld::0::10??Hilfetext1
input-number::num_var1::1::Nummer eingeben::Text nach Feld::0::10??Hilfetext1
header::Abschnitt 3 Auswahlelemente
checkbox::check_var1::0::Bitte ankreuzen??Hilfetext1
if-start::check_var1::true
  text::Checked
if-end
multiple-choice::mc_var1::1::Multiple Choice Feld: ::Choice1##Choice2##Choice3??Hilfetext1
drop-down::dd_var1::1::Dropdown Feld: ::Choice1##Choice2##Choice3??Hilfetext1
if-start::mc_var1::1
  text::Choice 1 chosen
  if-start::check_var1::true
    text::and Checked
  if-end
if-else
  text::NOT Choice1
if-end
repeat-start::examinee1::Wie viele Prüflinge gibt es?::Angaben zu Prüfling::20
  text::Repeat Inhalt
  if-start::check_var1::true
    text::Checked
  if-end
repeat-end
repeat-start::examinee2::Wie viele Prüflinge gibt es?::Angaben zu Prüfling::20
  text::Repeat Inhalt
  repeat-start::examinee3::Wie viele Prüflinge gibt es2?::Angaben zu Prüfling::20
    text::Repeat Inhalt2
  repeat-end
repeat-end
likert-start::trifft gar nicht zu##trifft eher nicht zu##trifft eher zu##trifft voll zu
    likert::LI001::iqb-scripted ist toll
    likert::LI002::simple player unit Definition ist toll
likert-end
nav-button-group::previous##next##first##last##end`;

@Component({
  selector: 'player-toolbar',
  template: `
    <button mat-fab [matMenuTriggerFor]="menu" matTooltip="Load/Save..." matTooltipPosition="above">
      <mat-icon>menu</mat-icon>
    </button>
    <mat-menu #menu="matMenu">
      <button mat-menu-item (click)="scriptDialogBox()">
        input script
      </button>
      <button mat-menu-item (click)="check()">
        Check Form Valid
      </button>
    </mat-menu>
  `,
  styles: [
    '.mdc-fab {z-index: 999; position: absolute; top: 20px; right: 20px}'
  ]
})
export class PlayerToolbarComponent {
  @Input() parentForm: FormGroup;
  @Output() toggleDrawerClick = new EventEmitter();
  private lastScript = '';

  constructor(
    private veronaService: VeronaService,
    private inputScriptDialog: MatDialog
  ) { }

  scriptDialogBox() {
    const dialogRef = this.inputScriptDialog.open(InputScriptDialog, {
      width: '600px',
      height: '700px',
      data: this.lastScript || testScript1
    });
    return lastValueFrom(dialogRef.afterClosed().pipe(
      map(dialogResult => {
        if (dialogResult === true) {
          const dialogComponent = dialogRef.componentInstance;
          this.lastScript = dialogComponent.scriptText;
          this.veronaService.raiseNewStartCommandForTesting(this.lastScript);
        }
        return false;
      })

    ));
  }

  script2() {
    this.veronaService.raiseNewStartCommandForTesting(`
    iqb-scripted::1.0
    title::Script 2 - Selection
    checkbox::task162ahmfF::0::Sie fühlen sich beunruhigt
    multiple-choice::task3wtrtimeS::1::Ich fühle mich heute großartig::trifft gar nicht zu##trifft eher nicht zu##trifft eher zu##trifft voll zu
    drop-down::ta33S::1::Ich fühlte mich gestern großartig::trifft gar nicht zu##trifft eher nicht zu##trifft eher zu##trifft voll zu
    checkboxes-start::Ich habe in meiner Verwandtschaft??düdü
      checkbox::ch01::0::Frauen
      checkbox::ch02::0::Männer
      checkbox::ch03::0::Kinder
      checkbox::ch04::0::Greise
      checkbox::ch05::0::Hunde
    checkboxes-end
    if-start::task162ahmfF::true
      text::"Sie fühlen sich beunruhigt" ist angeklickt
    if-else
      text::"Sie fühlen sich beunruhigt" ist nicht angeklickt
    if-end

    if-start::ch02::true
      text::"Männer" ist angeklickt
    if-else
      text::"Männer" ist nicht angeklickt
    if-end

    if-start::task3wtrtimeS::2
      text::Bei "heute" ist Option 2 gewählt
    if-else
      text::Bei "heute" ist Option 2 nicht gewählt
    if-end

    if-start::ta33S::3
      text::Bei "gestern" ist Option 3 gewählt
    if-else
      text::Bei "gestern" ist Option 3 nicht gewählt
    if-end
    `);
  }

  script3() {
    this.veronaService.raiseNewStartCommandForTesting(`
    iqb-scripted::1.0
    title::Script 3 - Likert
  likert-start::sehr hilfreich##eher hilfreich##teilweise hilfreich##eher nicht hilfreich##nicht hilfreich
  likert::task2useA::Abschnitt 1: Einleitung
  likert::task2useB::Abschnitt 2: Starten der Computer
  likert::task2useC::Abschnitt 3: Anmeldung
  likert::task2useD::Abschnitt 4: Steuerung über Testleitungskonsole
  likert::task2useE::Abschnitt 5: Speichern/Beenden
  likert-end
    if-start::task2useC::3
      text::Bei "Abschnitt 3: Anmeldung" ist Option 3 gewählt
    if-else
      text::Bei "Abschnitt 3: Anmeldung" ist Option 3 nicht gewählt
    if-end
    `);
  }

  script4() {
    this.veronaService.raiseNewStartCommandForTesting(`
    iqb-scripted::1.0
    title::Script 4 - Repeat
    checkbox::task162ahmfF::0::Ihre Lieblingsfarbe ist Gelb.
    hr
repeat-start::examinees::Wie viele Prüflinge gibt es?::Angaben zu Prüfling::20??Sie können Angaben zu maximal 20 Prüflingen eintragen. Sollten sich im Kurs mehr als 20 Prüflinge befinden, ist eine Auswahl vorzunehmen. Diese Auswahl sollte so erfolgen, dass ein möglichst breites Leistungsspektrum abgebildet wird. Vermieden werden sollte eine selektive Berücksichtigung bzw. Nichtberücksichtigung bestimmter Gruppen (z. B. besonders leistungsschwache oder leistungsstarke Prüflinge, Schülerinnen und Schüler mit nichtdeutscher Herkunftssprache).
    input-number::task1::1::Teilaufgabe 1::::0::10
    input-number::task2::1::Teilaufgabe 2::::0::10
    input-number::task3::1::Teilaufgabe 3::::0::10
    checkbox::task162ahmfF::0::Ihre Lieblingsfarbe ist Gelb.

    if-start::task3::3
      text::Bei "Teilaufgabe 3" wurde "3" eingetragen.
    if-else
      text::Bei "Teilaufgabe 3" wurde "3" nicht eingetragen.
    if-end

    if-start::task162ahmfF::true
      text::"Lieblingsfarbe" wurde angekreuzt.
    if-else
      text::"Lieblingsfarbe" wurde nicht angekreuzt.
    if-end
repeat-end    `);
  }

  check() {
    console.log(this.parentForm.valid);
  }
}

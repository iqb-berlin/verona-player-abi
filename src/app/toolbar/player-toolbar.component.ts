import {
  Component, EventEmitter, Output, input } from '@angular/core';
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
html:: <strong>Strong</strong> text and hyperlink: <a href=”https://www.iqb.hu-berlin.de”>IQB website</a>??Hilfetext1
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
    <input #fileInputUnit type="file" hidden="hidden" (change)="uploadUnitFile($event)">
    <mat-menu #menu="matMenu">
      <button mat-menu-item (click)="scriptDialogBox()">
        input script
      </button>
      <button mat-menu-item (click)="fileInputUnit.click()">
        load script file
      </button>
      <button mat-menu-item (click)="check()">
        check if form valid
      </button>
    </mat-menu>
  `,
  styles: [
    '.mdc-fab {z-index: 999; position: absolute; top: 20px; right: 20px}'
  ]
})
export class PlayerToolbarComponent {
  parentForm = input<FormGroup>();
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

  uploadUnitFile(fileInputEvent: Event): void {
    const target = fileInputEvent.target as HTMLInputElement;
    if (target && target.files && target.files.length > 0) {
      const fileToUpload = target.files[0];
      const myReader = new FileReader();
      myReader.onload = e => {
        this.lastScript = e.target ? (e.target.result as string) : '';
        this.veronaService.raiseNewStartCommandForTesting(this.lastScript);
      };
      myReader.readAsText(fileToUpload);
    }
  }

  check() {
    VeronaService.sendConsoleMessage_Info(this.parentForm().valid ? 'Form is valid' : 'Form is not valid');
  }
}

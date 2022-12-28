import { Component, EventEmitter, Output } from '@angular/core';
import { VeronaService } from './verona/verona.service';

@Component({
  selector: 'player-toolbar',
  template: `
    <button mat-fab [matMenuTriggerFor]="menu" matTooltip="Load/Save..." matTooltipPosition="above">
      <mat-icon>menu</mat-icon>
    </button>
    <mat-menu #menu="matMenu">
      <button mat-menu-item (click)="script1()">
        Load Script1
      </button>
      <button mat-menu-item (click)="script2()">
        Load Script2
      </button>
    </mat-menu>
  `,
  styles: [
    '.mdc-fab {z-index: 999; position: absolute; top: 20px; right: 20px}'
  ]
})
export class PlayerToolbarComponent {
  @Output() toggleDrawerClick = new EventEmitter();

  constructor(
    private veronaService: VeronaService
  ) { }

  script1() {
    this.veronaService.raiseNewStartCommandForTesting(`
    iqb-scripted::1.0
    title::Test-Script 1 - Input Text & Number
    html::Melden Sie sich beim <a href="https://www.iqb.hu-berlin.de" target="_blank">IQB</a> oder woanders!
    hr
    input-text::V001::0::Bitte Begründung eingeben!::::15
    input-text::V003::0::Bitte Begründung eingeben!::km/h::4
    hr
    input-text::V002::1::Bitte irgendwas anderes eingeben!
    input-number::V002::1::Bitte ein Zahl eingeben!::kg::0::3
    `);
  }

  script2() {
    this.veronaService.raiseNewStartCommandForTesting(`
    iqb-scripted::1.0
    title::Script 2 - Selection
    checkbox::task162ahmfF::0::Sie fühlen sich beunruhigt
    multiple-choice::task3wtrtimeS::1::Ich fühle mich heute großartig::trifft gar nicht zu##trifft eher nicht zu##trifft eher zu##trifft voll zu
    drop-down::ta33S::1::Ich fühlte mich gestern großartig::trifft gar nicht zu##trifft eher nicht zu##trifft eher zu##trifft voll zu

    `);
  }
}

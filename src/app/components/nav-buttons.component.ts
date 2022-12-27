import {
  Component, EventEmitter, Input, Output
} from '@angular/core';
import { ElementComponent } from './element.component';
import { NavButtonGroupElement } from '../classes';

@Component({
  selector: 'player-nav-button-group',
  template: `
    <div class="fx-row-center-center">
      <div *ngFor="let option of elementData.options">
        <button mat-raised-button matTooltip="{{iconMap[option].tooltip}}"
                (click)="click(option)">
          <mat-icon>{{iconMap[option].iconName}}</mat-icon>
        </button>
      </div>
    </div>
  `,
  styles: ['button {margin: 20px 5px}']
})
export class NavButtonsComponent extends ElementComponent {
  @Input() elementData: NavButtonGroupElement;
  @Output() navigationRequested = new EventEmitter<string>();

  iconMap = {
    previous: {
      iconName: 'keyboard_arrow_left',
      tooltip: 'Vorheriges Item'
    },
    next: {
      iconName: 'keyboard_arrow_right',
      tooltip: 'Nächstes Item'
    },
    first: {
      iconName: 'first_page',
      tooltip: 'Zum ersten Item'
    },
    last: {
      iconName: 'last_page',
      tooltip: 'Zum letzten Item'
    },
    end: {
      iconName: 'keyboard_arrow_up',
      tooltip: 'Beenden'
    }
  };

  click(option: string): void {
    this.navigationRequested.emit(option);
  }
}

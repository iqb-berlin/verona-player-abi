import {
  Component, EventEmitter, OnInit, Output
} from '@angular/core';
import { ElementComponent } from './element.component';
import { PropertyKey } from '../classes/interfaces';
import { UIElement } from '../classes/UIElement';

@Component({
  selector: 'player-nav-button-group',
  template: `
    <div fxLayout="row" fxLayoutAlign="center none">
      <div *ngFor="let option of options">
        <button mat-raised-button matTooltip="{{iconMap[option].tooltip}}"
                (click)="click(option)">
          <mat-icon>{{iconMap[option].iconName}}</mat-icon>
        </button>
      </div>
    </div>
  `,
  styles: ['button {margin: 20px 5px}']
})
export class NavButtonsComponent extends ElementComponent implements OnInit {
  @Output() navigationRequested = new EventEmitter<string>();

  options: string[] = [];
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

  ngOnInit(): void {
    const elementData = this.elementData as UIElement;
    this.options = elementData.properties.get(PropertyKey.TEXT2).split('##');
  }

  click(option: string): void {
    this.navigationRequested.emit(option);
  }
}

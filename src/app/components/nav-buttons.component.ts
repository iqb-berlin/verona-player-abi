import {
  Component, EventEmitter, Input, OnInit, Output
} from '@angular/core';
import { ElementComponent } from './element.component';
import { NavButtonGroupElement } from '../classes';
import { VeronaService } from '../verona/verona.service';
import { UnitNavigationTarget } from '../verona/verona.interfaces';

@Component({
  selector: 'player-nav-button-group',
  template: `
    <div class="fx-row-center-center">
      @for (option of elementData.options; track option) {
        <div>
          <button mat-raised-button [matTooltip]="iconMap[option].tooltip"
            [disabled]="iconMap[option].disabled"
            (click)="click(option)">
            <mat-icon>{{iconMap[option].iconName}}</mat-icon>
          </button>
        </div>
      }
    </div>
    `,
  styles: [
    `button {
      margin: 20px 5px
    }`,
    `.mat-icon {
      font-size: 1.3rem;
      margin-left: 8px;
      margin-right: 8px;
    }`
  ]
})
export class NavButtonsComponent extends ElementComponent implements OnInit {
  @Input() elementData: NavButtonGroupElement;
  @Output() navigationRequested = new EventEmitter<string>();

  iconMap = {
    previous: {
      iconName: 'keyboard_arrow_left',
      tooltip: 'Vorheriges Item',
      disabled: false
    },
    next: {
      iconName: 'keyboard_arrow_right',
      tooltip: 'Nächstes Item',
      disabled: false
    },
    first: {
      iconName: 'first_page',
      tooltip: 'Zum ersten Item',
      disabled: false
    },
    last: {
      iconName: 'last_page',
      tooltip: 'Zum letzten Item',
      disabled: false
    },
    end: {
      iconName: 'keyboard_arrow_up',
      tooltip: 'Beenden',
      disabled: false
    }
  };

  constructor(public veronaService: VeronaService) {
    super();
  }

  ngOnInit() {
    Object.keys(this.iconMap).forEach(k => {
      this.iconMap[k].disabled = !this.veronaService.enabledNavigationTargets.includes(k as UnitNavigationTarget);
    });
  }

  click(option: string): void {
    this.navigationRequested.emit(option);
  }
}

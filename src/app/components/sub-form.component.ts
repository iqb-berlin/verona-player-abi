import {
  Component, EventEmitter, Input, Output
} from '@angular/core';
import { ElementComponent } from './element.component';
import {
  CheckboxElement,
  ErrorElement, LikertBlock, NavButtonGroupElement,
  NumberInputElement, RepeatBlock,
  SelectionElement, SimpleBlock,
  TextElement,
  TextInputElement,
  UIElement
} from '../classes';
import { FieldType } from '../classes/interfaces';

@Component({
  selector: 'player-sub-form',
  template: `
    <ng-container [ngSwitch]="elementData.type">
      <player-text *ngSwitchCase="fieldType.TEXT" [elementData]="elementDataAsTextElement"></player-text>
      <player-text *ngSwitchCase="fieldType.HEADER" [elementData]="elementDataAsTextElement"></player-text>
      <player-text *ngSwitchCase="fieldType.HTML" [elementData]="elementDataAsTextElement"></player-text>
      <hr *ngSwitchCase="fieldType.HR"/>
      <player-text *ngSwitchCase="fieldType.TITLE" [elementData]="elementDataAsTextElement"></player-text>
      <p *ngSwitchCase="fieldType.SCRIPT_ERROR" class="script-error">
        {{elementDataAsErrorElement.text}} {{elementDataAsErrorElement.parameter}}</p>
      <player-input *ngSwitchCase="fieldType.INPUT_TEXT" [elementData]="elementDataAsNumberOrTextInputElement"
                    (elementDataChange)="elementDataChange.emit(elementData)" [parentForm]="parentForm"></player-input>
      <player-input *ngSwitchCase="fieldType.INPUT_NUMBER" [elementData]="elementDataAsNumberOrTextInputElement"
                    (elementDataChange)="elementDataChange.emit(elementData)" [parentForm]="parentForm"></player-input>
      <player-checkbox *ngSwitchCase="fieldType.CHECKBOX" [elementData]="elementDataAsCheckboxElement"
                       (elementDataChange)="elementDataChange.emit(elementData)" [parentForm]="parentForm">
      </player-checkbox>
      <player-select *ngSwitchCase="fieldType.MULTIPLE_CHOICE" [elementData]="elementDataAsSelectionElement"
                     (elementDataChange)="elementDataChange.emit(elementData)" [parentForm]="parentForm">
      </player-select>
      <player-select *ngSwitchCase="fieldType.DROP_DOWN" [elementData]="elementDataAsSelectionElement"
                     (elementDataChange)="elementDataChange.emit(elementData)" [parentForm]="parentForm">
      </player-select>
      <player-nav-button-group *ngSwitchCase="fieldType.NAV_BUTTON_GROUP"
                               [elementData]="elementDataAsNavButtonGroupElement"
                               (elementDataChange)="elementDataChange.emit(elementData)"
                               (navigationRequested)="navigationRequested.emit($event)">
      </player-nav-button-group>
      <player-likert *ngSwitchCase="fieldType.LIKERT_BLOCK" [elementData]="elementDataAsLikertBlock"
                     (elementDataChange)="elementDataChange.emit($event)" [parentForm]="parentForm"></player-likert>
      <player-repeat *ngSwitchCase="fieldType.REPEAT_BLOCK" [elementData]="elementDataAsRepeatBlock"
                     (elementDataChange)="elementDataChange.emit($event)" [parentForm]="parentForm"></player-repeat>
      <div *ngSwitchCase="fieldType.IFTHENELSE_BLOCK">
        <div *ngFor="let e of elementDataAsSimpleBlock.elements">
          <player-sub-form [elementData]="e" [parentForm]="parentForm"
                           (elementDataChange)="elementDataChange.emit($event)"></player-sub-form>
        </div>
      </div>
    </ng-container>
  `,
  styles: ['.script-error {color: orange; background-color: navy; padding: 4px 12px}']
})
export class SubFormComponent extends ElementComponent {
  @Input() elementData: UIElement;
  @Output() navigationRequested = new EventEmitter<string>();
  get elementDataAsTextElement(): TextElement {
    return this.elementData as TextElement;
  }

  get elementDataAsErrorElement(): ErrorElement {
    return this.elementData as ErrorElement;
  }

  get elementDataAsNumberOrTextInputElement(): NumberInputElement | TextInputElement {
    return this.elementData.type === FieldType.INPUT_NUMBER ? this.elementData as NumberInputElement :
      this.elementData as TextInputElement;
  }

  get elementDataAsCheckboxElement(): CheckboxElement {
    return this.elementData as CheckboxElement;
  }

  get elementDataAsSelectionElement(): SelectionElement {
    return this.elementData as SelectionElement;
  }

  get elementDataAsNavButtonGroupElement(): NavButtonGroupElement {
    return this.elementData as NavButtonGroupElement;
  }

  get elementDataAsLikertBlock(): LikertBlock {
    return this.elementData as LikertBlock;
  }

  get elementDataAsRepeatBlock(): RepeatBlock {
    return this.elementData as RepeatBlock;
  }

  get elementDataAsSimpleBlock(): SimpleBlock {
    return this.elementData as SimpleBlock;
  }
}

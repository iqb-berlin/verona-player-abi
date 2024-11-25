import {
  Component, EventEmitter, Output, input } from '@angular/core';
import { ElementComponent } from './element.component';
import {
  CheckboxBlock,
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
@switch (elementData().type) {
  @case (fieldType.TEXT) {
    <player-text [elementData]="elementDataAsTextElement"></player-text>
  }
  @case (fieldType.HEADER) {
    <player-text [elementData]="elementDataAsTextElement"></player-text>
  }
  @case (fieldType.HTML) {
    <player-text [elementData]="elementDataAsTextElement"></player-text>
  }
  @case (fieldType.HR) {
    <hr/>
  }
  @case (fieldType.TITLE) {
    <player-text [elementData]="elementDataAsTextElement"></player-text>
  }
  @case (fieldType.SCRIPT_ERROR) {
    <p class="script-error">
    {{elementDataAsErrorElement.text}} {{elementDataAsErrorElement.parameter}}</p>
  }
  @case (fieldType.INPUT_TEXT) {
    <player-input [elementData]="elementDataAsNumberOrTextInputElement"
    (valueChange)="valueChange.emit()" [parentForm]="parentForm()"></player-input>
  }
  @case (fieldType.INPUT_NUMBER) {
    <player-input [elementData]="elementDataAsNumberOrTextInputElement"
    (valueChange)="valueChange.emit()" [parentForm]="parentForm()"></player-input>
  }
  @case (fieldType.CHECKBOX) {
    <player-checkbox [elementData]="elementDataAsCheckboxElement"
      (valueChange)="valueChange.emit()" [parentForm]="parentForm()">
    </player-checkbox>
  }
  @case (fieldType.CHECKBOX_BLOCK) {
    <player-checkboxes [elementData]="elementDataAsCheckboxBlock"
      (valueChange)="valueChange.emit()" [parentForm]="parentForm()">
    </player-checkboxes>
  }
  @case (fieldType.MULTIPLE_CHOICE) {
    <player-select [elementData]="elementDataAsSelectionElement"
      (valueChange)="valueChange.emit()" [parentForm]="parentForm()">
    </player-select>
  }
  @case (fieldType.DROP_DOWN) {
    <player-select [elementData]="elementDataAsSelectionElement"
      (valueChange)="valueChange.emit()" [parentForm]="parentForm()">
    </player-select>
  }
  @case (fieldType.NAV_BUTTON_GROUP) {
    <player-nav-button-group
      [elementData]="elementDataAsNavButtonGroupElement"
      (valueChange)="valueChange.emit()"
      (navigationRequested)="navigationRequested.emit($event)">
    </player-nav-button-group>
  }
  @case (fieldType.LIKERT_BLOCK) {
    <player-likert [elementData]="elementDataAsLikertBlock"
    (valueChange)="valueChange.emit()" [parentForm]="parentForm()"></player-likert>
  }
  @case (fieldType.REPEAT_BLOCK) {
    <player-repeat [elementData]="elementDataAsRepeatBlock"
    (valueChange)="valueChange.emit()" [parentForm]="parentForm()"></player-repeat>
  }
  @case (fieldType.IFTHENELSE_BLOCK) {
    <div>
      @for (e of elementDataAsSimpleBlock.elements; track e) {
        <div>
          <player-sub-form [elementData]="e" [parentForm]="parentForm()"
          (valueChange)="valueChange.emit()"></player-sub-form>
        </div>
      }
    </div>
  }
}
`,
  styles: ['.script-error {color: orange; background-color: navy; padding: 4px 12px}']
})
export class SubFormComponent extends ElementComponent {
  elementData = input<UIElement>();
  @Output() navigationRequested = new EventEmitter<string>();
  get elementDataAsTextElement(): TextElement {
    return this.elementData() as TextElement;
  }

  get elementDataAsErrorElement(): ErrorElement {
    return this.elementData() as ErrorElement;
  }

  get elementDataAsNumberOrTextInputElement(): NumberInputElement | TextInputElement {
    return this.elementData().type === FieldType.INPUT_NUMBER ? this.elementData() as NumberInputElement :
      this.elementData() as TextInputElement;
  }

  get elementDataAsCheckboxElement(): CheckboxElement {
    return this.elementData() as CheckboxElement;
  }

  get elementDataAsSelectionElement(): SelectionElement {
    return this.elementData() as SelectionElement;
  }

  get elementDataAsNavButtonGroupElement(): NavButtonGroupElement {
    return this.elementData() as NavButtonGroupElement;
  }

  get elementDataAsLikertBlock(): LikertBlock {
    return this.elementData() as LikertBlock;
  }

  get elementDataAsRepeatBlock(): RepeatBlock {
    return this.elementData() as RepeatBlock;
  }

  get elementDataAsSimpleBlock(): SimpleBlock {
    return this.elementData() as SimpleBlock;
  }

  get elementDataAsCheckboxBlock(): CheckboxBlock {
    return this.elementData() as CheckboxBlock;
  }
}

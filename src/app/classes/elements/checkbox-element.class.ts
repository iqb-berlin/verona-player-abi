import { FieldType } from '../interfaces';
import { InputElement } from './input-element.class';

export class CheckboxElement extends InputElement {
  textAfter = '';
  constructor(subform: string, definitionLine?: string) {
    super(subform);
    this.type = FieldType.CHECKBOX;
    this.value = 'false';
    if (definitionLine) this.parseDefinition(definitionLine);
  }

  parseDefinition(definitionLine: string): string {
    const localDefinition = super.parseDefinition(definitionLine);
    const lineSplits = localDefinition.split('::');
    this.textAfter = lineSplits.shift();
    return lineSplits.join('::');
  }

  copyProperties(targetElement: CheckboxElement) {
    super.copyProperties(targetElement);
    targetElement.textAfter = this.textAfter;
  }

  clone(subform?: string): CheckboxElement {
    const newElement = new CheckboxElement(subform);
    this.copyProperties(newElement);
    return newElement;
  }
}

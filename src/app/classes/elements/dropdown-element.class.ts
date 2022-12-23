import { FieldType } from '../interfaces';
import { InputElement } from './input-element.class';

export class DropDownElement extends InputElement {
  textAfter = '';
  constructor(subform: string, definitionLine?: string) {
    super(subform);
    this.type = FieldType.DROP_DOWN;
    if (definitionLine) this.parseDefinition(definitionLine);
  }

  parseDefinition(definitionLine: string): string {
    const localDefinition = super.parseDefinition(definitionLine);
    const lineSplits = localDefinition.split('::');
    this.textAfter = lineSplits.shift();
    return lineSplits.join('::');
  }

  copyProperties(targetElement: DropDownElement) {
    super.copyProperties(targetElement);
    targetElement.textAfter = this.textAfter;
  }

  clone(subform?: string): DropDownElement {
    const newElement = new DropDownElement(subform);
    this.copyProperties(newElement);
    return newElement;
  }
}

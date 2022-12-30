import { FieldType } from '../interfaces';
import { InputElement } from './input-element.class';

export class SelectionElement extends InputElement {
  options: string[] = [];
  constructor(subform: string, definitionLine?: string) {
    super(subform);
    this.type = FieldType.DROP_DOWN;
    if (definitionLine) this.parseDefinition(definitionLine);
  }

  parseDefinition(definitionLine: string): string {
    const localDefinition = super.parseDefinition(definitionLine);
    const lineSplits = localDefinition.split('::');
    this.options = lineSplits.shift().split('##');
    return lineSplits.join('::');
  }

  copyProperties(targetElement: SelectionElement) {
    super.copyProperties(targetElement);
    targetElement.options = this.options;
  }

  clone(subform?: string): SelectionElement {
    const newElement = new SelectionElement(subform);
    this.copyProperties(newElement);
    return newElement;
  }
}

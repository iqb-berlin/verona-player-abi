import { FieldType } from '../interfaces';
import { InputElement } from './input-element.class';

export class NumberInputElement extends InputElement {
  textAfter = '';
  minValue = 0;
  maxValue = 0;
  constructor(subform: string, definitionLine?: string) {
    super(subform);
    this.type = FieldType.INPUT_NUMBER;
    if (definitionLine) this.parseDefinition(definitionLine);
  }

  parseDefinition(definitionLine: string): string {
    const localDefinition = super.parseDefinition(definitionLine);
    const lineSplits = localDefinition.split('::');
    this.textAfter = lineSplits.shift();
    this.minValue = parseInt(lineSplits.shift(), 10);
    this.maxValue = parseInt(lineSplits.shift(), 10);
    return lineSplits.join('::');
  }

  copyProperties(targetElement: NumberInputElement) {
    super.copyProperties(targetElement);
    targetElement.textAfter = this.textAfter;
    targetElement.minValue = this.minValue;
    targetElement.maxValue = this.maxValue;
  }

  clone(subform?: string): NumberInputElement {
    const newElement = new NumberInputElement(subform);
    this.copyProperties(newElement);
    return newElement;
  }
}

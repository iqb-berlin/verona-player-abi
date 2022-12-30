import { FieldType } from '../interfaces';
import { InputElement } from './input-element.class';

export class NumberInputElement extends InputElement {
  textAfter = '';
  minValue = -Number.MAX_VALUE;
  maxValue = Number.MAX_VALUE;
  constructor(subform: string, definitionLine?: string) {
    super(subform);
    this.type = FieldType.INPUT_NUMBER;
    if (definitionLine) this.parseDefinition(definitionLine);
  }

  parseDefinition(definitionLine: string): string {
    const localDefinition = super.parseDefinition(definitionLine);
    const lineSplits = localDefinition.split('::');
    if (lineSplits.length > 0) this.textAfter = lineSplits.shift();
    if (lineSplits.length > 0) {
      const numValue = lineSplits.shift();
      if (numValue) this.minValue = parseInt(numValue, 10);
    }
    if (lineSplits.length > 0) {
      const numValue = lineSplits.shift();
      if (numValue) this.maxValue = parseInt(numValue, 10);
    }
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

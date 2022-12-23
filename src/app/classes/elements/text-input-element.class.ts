import { FieldType } from '../interfaces';
import { InputElement } from './input-element.class';

export class TextInputElement extends InputElement {
  textAfter = '';
  maxLines = 0;
  maxLength = 0;
  constructor(subform: string, definitionLine?: string) {
    super(subform);
    this.type = FieldType.INPUT_TEXT;
    if (definitionLine) this.parseDefinition(definitionLine);
  }

  parseDefinition(definitionLine: string): string {
    const localDefinition = super.parseDefinition(definitionLine);
    const lineSplits = localDefinition.split('::');
    this.textAfter = lineSplits.shift();
    this.maxLines = parseInt(lineSplits.shift(), 10);
    this.maxLength = parseInt(lineSplits.shift(), 10);
    return lineSplits.join('::');
  }

  copyProperties(targetElement: TextInputElement) {
    super.copyProperties(targetElement);
    targetElement.textAfter = this.textAfter;
    targetElement.maxLines = this.maxLines;
    targetElement.maxLength = this.maxLength;
  }

  clone(subform?: string): TextInputElement {
    const newElement = new TextInputElement(subform);
    this.copyProperties(newElement);
    return newElement;
  }
}

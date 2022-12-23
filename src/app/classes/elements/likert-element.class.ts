import { FieldType } from '../interfaces';
import { InputElement } from './input-element.class';

export class LikertElement extends InputElement {
  constructor(subform: string, definitionLine?: string) {
    super(subform);
    this.type = FieldType.LIKERT_ELEMENT;
    if (definitionLine) this.parseDefinition(definitionLine);
  }

  clone(subform?: string): LikertElement {
    const newElement = new LikertElement(subform);
    this.copyProperties(newElement);
    return newElement;
  }
}

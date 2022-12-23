import { FieldType } from '../interfaces';
import { InputElement } from './input-element.class';

export class MultiChoiceElement extends InputElement {
  constructor(subform: string, definitionLine?: string) {
    super(subform);
    this.type = FieldType.MULTIPLE_CHOICE;
    if (definitionLine) this.parseDefinition(definitionLine);
  }

  clone(subform?: string): MultiChoiceElement {
    const newElement = new MultiChoiceElement(subform);
    this.copyProperties(newElement);
    return newElement;
  }
}

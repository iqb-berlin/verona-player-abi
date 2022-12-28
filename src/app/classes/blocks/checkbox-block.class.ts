import { UIBlock } from '../UIBlock';
import { FieldType } from '../interfaces';

export class CheckboxBlock extends UIBlock {
  textBefore = '';

  constructor(subform: string, definitionLine?: string) {
    super(subform);
    this.type = FieldType.CHECKBOX_BLOCK;
    if (definitionLine) this.parseDefinition(definitionLine);
  }

  parseDefinition(definitionLine: string): string {
    this.textBefore = super.parseDefinition(definitionLine);
    return '';
  }

  clone(subform?: string): CheckboxBlock {
    const newElement = new CheckboxBlock(subform);
    newElement.textBefore = this.textBefore;
    this.elements.forEach(e => {
      newElement.elements.push(e.clone(subform));
    });
    return newElement;
  }
}

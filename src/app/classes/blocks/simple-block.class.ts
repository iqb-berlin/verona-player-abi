import { UIBlock } from '../UIBlock';
import { FieldType } from '../interfaces';

export class SimpleBlock extends UIBlock {
  constructor(subform: string, definitionLine?: string) {
    super(subform, definitionLine);
    this.type = FieldType.SIMPLE_BLOCK;
  }

  clone(subform?: string): SimpleBlock {
    const newElement = new SimpleBlock(subform);
    this.elements.forEach(e => {
      newElement.elements.push(e.clone(subform));
    });
    return newElement;
  }
}

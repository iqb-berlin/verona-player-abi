import { UIBlock } from '../UIBlock';
import { FieldType } from '../interfaces';

export class LikertBlock extends UIBlock {
  headerList: string[];

  constructor(subform: string, definitionLine?: string) {
    super(subform, definitionLine);
    this.type = FieldType.LIKERT_BLOCK;
  }

  parseDefinition(definitionLine: string): string {
    const localDefinition = super.parseDefinition(definitionLine);
    this.headerList = localDefinition.split('##');
    return '';
  }

  clone(subform?: string): LikertBlock {
    const newElement = new LikertBlock(subform);
    newElement.headerList = this.headerList;
    this.elements.forEach(e => {
      newElement.elements.push(e.clone(subform));
    });
    return newElement;
  }
}

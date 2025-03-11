import { UIBlock } from '../UIBlock';
import { FieldType } from '../interfaces';

export class LikertBlock extends UIBlock {
  headerList: string[];
  required = false;
  enableReset = false;

  constructor(subform: string, definitionLine?: string) {
    super(subform, definitionLine);
    this.type = FieldType.LIKERT_BLOCK;
    if (definitionLine) this.parseDefinition(definitionLine);
  }

  parseDefinition(definitionLine: string): string {
    const localDefinition = super.parseDefinition(definitionLine);
    const lineSplits = localDefinition.split('::');
    if (lineSplits.length > 0) {
      if (lineSplits[0].trim() === "0" || lineSplits[0].trim() === "1") {
        this.required = lineSplits.shift().trim() === '1';
        if (lineSplits.length > 0) {
          if (lineSplits[0].trim() === "0" || lineSplits[0].trim() === "1") {
            this.enableReset = lineSplits.shift().trim() === '1';
          }
        }
      }
    }
    this.headerList = lineSplits.shift().split('##');
    return lineSplits.join('::');
  }

  clone(subform?: string): LikertBlock {
    const newElement = new LikertBlock(subform);
    newElement.headerList = this.headerList;
    newElement.required = this.required;
    newElement.enableReset = this.enableReset;
    this.elements.forEach(e => {
      newElement.elements.push(e.clone(subform));
    });
    return newElement;
  }
}

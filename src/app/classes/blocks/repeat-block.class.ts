import { UIElement } from '../UIElement';
import { UIBlock } from '../UIBlock';
import { FieldType } from '../interfaces';
import { SimpleBlock } from './simple-block.class';
import { VeronaResponse, VeronaResponseStatus } from '../../verona/verona.interfaces';

export const SubformSeparator = '##';

export class RepeatBlock extends UIBlock {
  id: string;
  status = VeronaResponseStatus.NOT_REACHED;
  numberOfSubForms = 0;
  maxNumberOfSubForms = 10;
  numberOfSubFormsPrompt = '';
  headerText = 'Block';
  templateElements: UIElement[] = [];
  get elementsAsSimpleBlocks(): SimpleBlock[] {
    return this.elements.map(e => e as SimpleBlock);
  }

  constructor(subform: string, definitionLine?: string) {
    super(subform);
    this.type = FieldType.REPEAT_BLOCK;
    if (definitionLine) this.parseDefinition(definitionLine);
  }

  parseDefinition(definitionLine: string): string {
    const localDefinition = super.parseDefinition(definitionLine);
    const lineSplits = localDefinition.split('::');
    this.id = lineSplits.shift();
    if (lineSplits.length > 0) this.numberOfSubFormsPrompt = lineSplits.shift();
    if (lineSplits.length > 0) this.headerText = lineSplits.shift();
    if (lineSplits.length > 0) this.maxNumberOfSubForms = parseInt(lineSplits.shift(), 10);
    return '';
  }

  clone(subform?: string): RepeatBlock {
    const newElement = new RepeatBlock(subform);
    newElement.id = this.id;
    newElement.numberOfSubForms = this.numberOfSubForms;
    newElement.maxNumberOfSubForms = this.maxNumberOfSubForms;
    newElement.numberOfSubFormsPrompt = this.numberOfSubFormsPrompt;
    newElement.headerText = this.headerText;
    this.elements.forEach(e => {
      newElement.elements.push(e.clone(subform));
    });
    this.templateElements.forEach(e => {
      newElement.templateElements.push(e.clone(subform));
    });
    return newElement;
  }

  check(values: VeronaResponse[]): void {
    this.hidden = false;
    const myResponse = values.find(vr => (vr.id === this.id) && (vr.subform === this.subform));
    if (myResponse) this.numberOfSubForms = parseInt(myResponse.value, 10);
    this.setSubBlockNumber(values);
    super.check(values);
  }

  getValues(): VeronaResponse[] {
    if (this.hidden) return [];
    const values: VeronaResponse[] = [{
      id: this.id,
      subform: this.subform,
      status: this.status,
      value: this.numberOfSubForms.toString()
    }];
    this.elements.forEach(element => {
      values.push(...element.getValues());
    });
    return values;
  }

  setSubBlockNumber(responses: VeronaResponse[] = []): void {
    const newElements: UIElement[] = [];
    const oldSubBlockNumber = this.elements.length;
    for (let i = 0; i < this.numberOfSubForms; i++) {
      if (i < oldSubBlockNumber) {
        newElements.push(this.elements[i]);
      } else {
        const newSubformId = `${this.subform ? `${this.subform}${SubformSeparator}` : ''}${this.id}_${i}`;
        const newElement = new SimpleBlock(newSubformId);
        this.templateElements.forEach(templateElement => {
          const cloneElement = templateElement.clone(newSubformId);
          cloneElement.check(responses);
          newElement.elements.push(cloneElement);
        });
        newElements.push(newElement);
      }
    }
    this.elements = newElements;
  }
}

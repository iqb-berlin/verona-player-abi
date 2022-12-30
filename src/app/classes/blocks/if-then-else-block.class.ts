import { UIElement } from '../UIElement';
import { UIBlock } from '../UIBlock';
import { FieldType } from '../interfaces';
import { VeronaResponse } from '../../verona/verona.interfaces';
import { SubformSeparator } from './repeat-block.class';

export class IfThenElseBlock extends UIBlock {
  conditionVariableName = '';
  conditionTrueValue = '';
  trueElements: UIElement[] = [];
  falseElements: UIElement[] = [];

  constructor(subform: string, definitionLine?: string) {
    super(subform);
    this.type = FieldType.IFTHENELSE_BLOCK;
    if (definitionLine) this.parseDefinition(definitionLine);
  }

  parseDefinition(definitionLine: string): string {
    const localDefinition = super.parseDefinition(definitionLine);
    const lineSplits = localDefinition.split('::');
    this.conditionVariableName = lineSplits.shift();
    this.conditionTrueValue = lineSplits.shift();
    return lineSplits.join('::');
  }

  clone(subform?: string): IfThenElseBlock {
    const newElement = new IfThenElseBlock(subform);
    newElement.conditionVariableName = this.conditionVariableName;
    newElement.conditionTrueValue = this.conditionTrueValue;
    this.trueElements.forEach(e => {
      newElement.trueElements.push(e.clone(subform));
    });
    this.falseElements.forEach(e => {
      newElement.falseElements.push(e.clone(subform));
    });
    return newElement;
  }

  check(values: VeronaResponse[]): void {
    const mySubforms: string[] = this.subform ? this.subform.split(SubformSeparator) : [];
    let conditionVariableValue = '';
    let searchComplete = false;
    do {
      const searchSubForm = mySubforms.length > 0 ? mySubforms.join(SubformSeparator) : '';
      const myResponse = values.find(vr => (vr.id === this.conditionVariableName) && (vr.subform === searchSubForm));
      if (myResponse) {
        searchComplete = true;
        conditionVariableValue = myResponse.value;
      } else if (mySubforms.length === 0) {
        searchComplete = true;
      } else {
        mySubforms.pop();
      }
    } while (!searchComplete);
    if (this.conditionTrueValue === conditionVariableValue) {
      this.elements = this.trueElements;
      this.falseElements.forEach(e => {
        e.hide();
      });
    } else {
      this.elements = this.falseElements;
      this.trueElements.forEach(e => {
        e.hide();
      });
    }
    super.check(values);
  }
}

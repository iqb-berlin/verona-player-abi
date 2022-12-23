import { UIElement } from '../UIElement';
import { UIBlock } from '../UIBlock';
import { FieldType } from '../interfaces';
import { VeronaResponse } from '../../verona/verona.interfaces';
import { VeronaService } from '../../verona/verona.service';

export class IfThenElseBlock extends UIBlock {
  conditionVariableName = '';
  conditionTrueValue = '';
  trueElements: UIElement[] = [];
  falseElements: UIElement[] = [];

  constructor(subform: string, definitionLine?: string) {
    super(subform, definitionLine);
    this.type = FieldType.IFTHENELSE_BLOCK;
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
    const varValue = VeronaService.getNearestVariableValue(
      this.conditionVariableName, this.subform, values
    );
    if (this.conditionTrueValue === varValue) {
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

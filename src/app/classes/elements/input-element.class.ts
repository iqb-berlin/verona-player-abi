import { UIElement } from '../UIElement';
import { VeronaResponse } from '../../verona/verona.interfaces';

export abstract class InputElement extends UIElement {
  id: string;
  subform: string;
  value: string;
  status = 'UNSET';
  required = false;
  textBefore = '';

  constructor(subform: string, definitionLine?: string) {
    super();
    this.subform = subform;
    if (definitionLine) this.parseDefinition(definitionLine);
  }

  parseDefinition(definitionLine: string): string {
    const localDefinition = super.parseDefinition(definitionLine);
    const lineSplits = localDefinition.split('::');
    this.id = lineSplits.shift().trim();
    this.required = lineSplits.shift().trim() === '1';
    this.textBefore = lineSplits.shift();
    return lineSplits.join('::');
  }

  check(values: VeronaResponse[]): void {
    this.hidden = false;
    const myResponse = values.find(vr => (vr.id === this.id) && (vr.subform === this.subform));
    if (myResponse) this.value = myResponse.value;
  }

  getValues(): VeronaResponse[] {
    if (this.hidden || !this.value) {
      return [];
    }
    return [{
      id: this.id,
      subform: this.subform,
      status: this.status,
      value: this.value
    }];
  }

  copyProperties(targetElement: InputElement) {
    super.copyProperties(targetElement);
    targetElement.id = this.id;
    targetElement.required = this.required;
    targetElement.textBefore = this.textBefore;
    // todo: status and subform?
  }
}

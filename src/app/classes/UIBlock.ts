import { UIElement } from './UIElement';
import { VeronaResponse } from '../verona/verona.interfaces';

export abstract class UIBlock extends UIElement {
  subform: string;
  elements: UIElement[] = [];

  constructor(subform: string, definitionLine?: string) {
    super();
    this.subform = subform;
    if (definitionLine) this.parseDefinition(definitionLine);
  }

  getValues(): VeronaResponse[] {
    const values: VeronaResponse[] = [];
    this.elements.forEach(element => {
      values.push(...element.getValues());
    });
    return values;
  }

  check(values: VeronaResponse[]): void {
    this.hidden = false;
    this.elements.forEach(e => {
      e.check(values);
    });
  }
}

import { FieldType } from '../interfaces';
import { UIElement } from '../UIElement';
import { VeronaResponse } from '../../verona/verona.interfaces';

export class HRElement extends UIElement {
  constructor() {
    super();
    this.type = FieldType.HR;
  }

  // eslint-disable-next-line class-methods-use-this
  clone(): HRElement {
    return new HRElement();
  }

  // eslint-disable-next-line class-methods-use-this
  getValues(): VeronaResponse[] { return []; }

  // eslint-disable-next-line class-methods-use-this,@typescript-eslint/no-unused-vars
  check(values: VeronaResponse[]): void { }
}

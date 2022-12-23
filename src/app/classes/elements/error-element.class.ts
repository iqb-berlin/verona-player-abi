import { FieldType } from '../interfaces';
import { UIElement } from '../UIElement';
import { VeronaResponse } from '../../verona/verona.interfaces';

export class ErrorElement extends UIElement {
  text: string;
  constructor(errorText?: string) {
    super();
    this.type = FieldType.SCRIPT_ERROR;
    this.text = errorText;
  }

  copyProperties(targetElement: ErrorElement) {
    super.copyProperties(targetElement);
    targetElement.text = this.text;
  }

  clone(): ErrorElement {
    const newElement = new ErrorElement();
    this.copyProperties(newElement);
    return newElement;
  }

  // eslint-disable-next-line class-methods-use-this
  getValues(): VeronaResponse[] { return []; }

  // eslint-disable-next-line class-methods-use-this
  check(values: VeronaResponse[]): void { }
}

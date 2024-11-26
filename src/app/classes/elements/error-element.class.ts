import { FieldType } from '../interfaces';
import { UIElement } from '../UIElement';
import { VeronaResponse } from '../../verona/verona.interfaces';

export class ErrorElement extends UIElement {
  text: string;
  parameter: string;
  constructor(errorText?: string, parameter?: string) {
    super();
    this.type = FieldType.SCRIPT_ERROR;
    this.text = errorText;
    this.parameter = parameter;
  }

  copyProperties(targetElement: ErrorElement) {
    super.copyProperties(targetElement);
    targetElement.text = this.text;
    targetElement.parameter = this.parameter;
  }

  clone(): ErrorElement {
    const newElement = new ErrorElement();
    this.copyProperties(newElement);
    return newElement;
  }

  // eslint-disable-next-line class-methods-use-this
  getValues(): VeronaResponse[] { return []; }

  // eslint-disable-next-line class-methods-use-this,@typescript-eslint/no-unused-vars
  check(values: VeronaResponse[]): void {}
}

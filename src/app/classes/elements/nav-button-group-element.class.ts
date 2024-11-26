import { FieldType } from '../interfaces';
import { UIElement } from '../UIElement';
import { VeronaResponse } from '../../verona/verona.interfaces';

export class NavButtonGroupElement extends UIElement {
  options: string[] = [];
  constructor(definitionLine?: string) {
    super();
    this.type = FieldType.NAV_BUTTON_GROUP;
    if (definitionLine) this.parseDefinition(definitionLine);
  }

  parseDefinition(definitionLine: string): string {
    this.options = super.parseDefinition(definitionLine).split('##');
    return '';
  }

  copyProperties(targetElement: NavButtonGroupElement) {
    super.copyProperties(targetElement);
    targetElement.options = this.options;
  }

  clone(): NavButtonGroupElement {
    const newElement = new NavButtonGroupElement();
    this.copyProperties(newElement);
    return newElement;
  }

  // eslint-disable-next-line class-methods-use-this
  getValues(): VeronaResponse[] { return []; }

  // eslint-disable-next-line class-methods-use-this,@typescript-eslint/no-unused-vars
  check(values: VeronaResponse[]): void { }
}

import { FieldType } from '../interfaces';
import { UIElement } from '../UIElement';
import { VeronaResponse } from '../../verona/verona.interfaces';

export class TextElement extends UIElement {
  text = '';

  constructor(definitionLine?: string) {
    super();
    this.type = FieldType.TEXT;
    if (definitionLine) this.parseDefinition(definitionLine);
  }

  parseDefinition(definitionLine: string): string {
    this.text = super.parseDefinition(definitionLine);
    return '';
  }

  copyProperties(targetElement: TextElement) {
    super.copyProperties(targetElement);
    targetElement.text = this.text;
  }

  clone(): UIElement {
    const newElement = new TextElement();
    this.copyProperties(newElement);
    return newElement;
  }

  // eslint-disable-next-line class-methods-use-this
  getValues(): VeronaResponse[] { return []; }

  // eslint-disable-next-line class-methods-use-this,@typescript-eslint/no-unused-vars
  check(values: VeronaResponse[]): void { }
}

import { FieldType } from './interfaces';
import { VeronaResponse } from '../verona/verona.interfaces';

export abstract class UIElement {
  hidden: boolean = false;
  helpText = '';
  type: FieldType = FieldType.UNSET;

  parseDefinition(definitionLine: string): string {
    const lineSplits = definitionLine.split('??');
    if (lineSplits.length > 1) {
      this.helpText = lineSplits[1];
      return lineSplits[0];
    }
    return definitionLine;
  }

  hide(): void {
    this.hidden = true;
  }

  copyProperties(targetElement: UIElement) {
    targetElement.hidden = this.hidden;
    targetElement.helpText = this.helpText;
    targetElement.type = this.type;
  }

  abstract clone(idSuffix?: string): UIElement;
  abstract getValues(): VeronaResponse[];
  abstract check(values: VeronaResponse[]): void;
}

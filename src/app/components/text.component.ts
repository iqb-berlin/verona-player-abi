import { Component, Input } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { ElementComponent } from './element.component';
import { FieldType } from '../classes/interfaces';
import { TextElement } from '../classes';

@Component({
  selector: 'player-text',
  template: `
    <ng-container [ngSwitch]="element.type">
      <p *ngSwitchCase="fieldType.TEXT" [matTooltip]="element.helpText" [matTooltipPosition]="'above'">
        {{content}}&nbsp;</p>
      <h1 *ngSwitchCase="fieldType.TITLE" [matTooltip]="element.helpText" [matTooltipPosition]="'above'">
        {{content}}&nbsp;</h1>
      <h2 *ngSwitchCase="fieldType.HEADER" [matTooltip]="element.helpText" [matTooltipPosition]="'above'">
        {{content}}&nbsp;</h2>
      <div *ngSwitchCase="fieldType.HTML" [innerHTML]="content"
           [matTooltip]="element.helpText" [matTooltipPosition]="'above'"></div>
    </ng-container>
  `
})
export class TextComponent extends ElementComponent {
  content: string | SafeHtml;
  element: TextElement;

  @Input()
  set elementData(value: TextElement) {
    this.element = value;
    if (value.type === FieldType.HTML) {
      this.content = this.sanitizer.bypassSecurityTrustHtml(value.text);
    } else {
      this.content = value.text;
    }
  }

  constructor(private sanitizer: DomSanitizer) {
    super();
  }
}

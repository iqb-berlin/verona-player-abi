import { Component, Input, input } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { ElementComponent } from './element.component';
import { FieldType } from '../classes/interfaces';
import { TextElement } from '../classes';

@Component({
  selector: 'player-text',
  template: `
@switch (element.type) {
  @case (fieldType.TEXT) {
    <p [matTooltip]="element.helpText" [matTooltipPosition]="'above'">
    {{content}}&nbsp;</p>
  }
  @case (fieldType.TITLE) {
    <h1 [matTooltip]="element.helpText" [matTooltipPosition]="'above'">
    {{content}}&nbsp;</h1>
  }
  @case (fieldType.HEADER) {
    <h2 [matTooltip]="element.helpText" [matTooltipPosition]="'above'">
    {{content}}&nbsp;</h2>
  }
  @case (fieldType.HTML) {
    <div [innerHTML]="content"
    [matTooltip]="element.helpText" [matTooltipPosition]="'above'"></div>
  }
}
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

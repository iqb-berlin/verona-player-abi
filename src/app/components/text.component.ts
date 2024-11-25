import {Component, input, OnInit} from '@angular/core';
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
export class TextComponent extends ElementComponent implements OnInit {
  content: string | SafeHtml;
  elementData = input<TextElement>();
  element: TextElement;

  ngOnInit(): void {
    this.element = this.elementData();
    if (this.elementData().type === FieldType.HTML) {
      this.content = this.sanitizer.bypassSecurityTrustHtml(this.elementData().text);
    } else {
      this.content = this.elementData().text;
    }
  }

  constructor(private sanitizer: DomSanitizer) {
    super();
  }
}

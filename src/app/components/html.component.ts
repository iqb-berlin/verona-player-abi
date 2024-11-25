import { Component, computed, input } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ElementComponent } from './element.component';
import { TextElement } from '../classes';

@Component({
  selector: 'player-html',
  template: `
    <div [innerHTML]="content()"
    [matTooltip]="elementData().helpText" [matTooltipPosition]="'above'"></div>
  `
})

export class HtmlComponent extends ElementComponent {
  elementData = input<TextElement>();
  content = computed(() => this.sanitizer.bypassSecurityTrustHtml(this.elementData().text));

  constructor(private sanitizer: DomSanitizer) {
    super();
  }
}

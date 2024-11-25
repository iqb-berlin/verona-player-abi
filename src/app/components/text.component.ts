import {Component, input } from '@angular/core';
import { ElementComponent } from './element.component';
import { TextElement } from '../classes';

@Component({
  selector: 'player-text',
  template: `
    @switch (elementData().type) {
      @case (fieldType.TEXT) {
        <p [matTooltip]="elementData().helpText" [matTooltipPosition]="'above'">
        {{elementData().text}}&nbsp;</p>
      }
      @case (fieldType.TITLE) {
        <h1 [matTooltip]="elementData().helpText" [matTooltipPosition]="'above'">
        {{elementData().text}}&nbsp;</h1>
      }
      @case (fieldType.HEADER) {
        <h2 [matTooltip]="elementData().helpText" [matTooltipPosition]="'above'">
        {{elementData().text}}&nbsp;</h2>
      }
    }
  `
})

export class TextComponent extends ElementComponent implements OnInit {
  elementData = input<TextElement>();
}

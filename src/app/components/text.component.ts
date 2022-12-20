import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { ElementComponent } from './element.component';
import { FieldType, PropertyKey } from '../classes/interfaces';
import { UIElement } from '../classes/UIElement';

@Component({
  selector: 'player-text',
  template: `
    <ng-container *ngIf="content" [ngSwitch]="elementDataAsUIElement.fieldType">
      <p *ngSwitchCase="fieldType.TEXT" matTooltip={{helpText}} [matTooltipPosition]="'above'">{{content}}</p>
      <p *ngSwitchCase="fieldType.SCRIPT_ERROR" class="script-error">{{content}}</p>
      <h1 *ngSwitchCase="fieldType.TITLE" matTooltip={{helpText}} [matTooltipPosition]="'above'">{{content}}</h1>
      <h2 *ngSwitchCase="fieldType.HEADER" matTooltip={{helpText}} [matTooltipPosition]="'above'">{{content}}</h2>
      <div *ngSwitchCase="fieldType.HTML" [innerHTML]="content"
           matTooltip={{helpText}} [matTooltipPosition]="'above'"></div>
    </ng-container>

    <ng-container *ngIf="!content" [ngSwitch]="elementDataAsUIElement.fieldType">
      <p *ngSwitchCase="fieldType.TEXT">&nbsp;</p>
      <h1 *ngSwitchCase="fieldType.TITLE">&nbsp;</h1>
      <h2 *ngSwitchCase="fieldType.HEADER">&nbsp;</h2>
      <hr *ngSwitchCase="fieldType.HR"/>
    </ng-container>
  `,
  styles: ['.script-error {font-size: large; color: red; font-weight: bold}']
})
export class TextComponent extends ElementComponent implements OnInit {
  content: string | SafeHtml;
  helpText = '';

  constructor(private sanitizer: DomSanitizer) {
    super();
  }

  ngOnInit(): void {
    const elementData = this.elementData as UIElement;
    this.helpText = elementData.helpText;
    if (elementData.fieldType === FieldType.HTML) {
      this.content = this.sanitizer.bypassSecurityTrustHtml(
        elementData.properties.get(PropertyKey.TEXT)
      );
    } else {
      this.content = elementData.properties.get(PropertyKey.TEXT);
    }
  }
}

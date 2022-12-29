import {
  Component, Input, OnDestroy, OnInit, ViewEncapsulation
} from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ElementComponent } from './element.component';
import { ErrorElement, LikertBlock, LikertElement } from '../classes';
import { InputElement } from '../classes/elements/input-element.class';
import { VeronaResponseStatus } from '../verona/verona.interfaces';

@Component({
  selector: 'player-likert',
  template: `
    <mat-card class="fx-column-start-stretch">
      <div class="fx-row-space-between-center likert-header">
        <div [style.flex]="'40'">&nbsp;</div>
        <div [style.flex]="'60'" class="fx-row-space-around-center">
          <div *ngFor="let header of headerList" class="fx-row-center-center">{{header}}</div>
        </div>
      </div>
      <mat-card-content class="fx-column-start-stretch" [formGroup]="localForm">
        <div *ngFor="let element of elements" class="likert-row">
          <div *ngIf="element.type === fieldType.SCRIPT_ERROR">
            {{element.text}} {{element.parameter}}
          </div>
          <div *ngIf="element.type === fieldType.LIKERT_ELEMENT"
               class="fx-row-space-around-center" IsInViewDetection (intersecting)="comingIntoView(element.id)">
            <div [style.flex]="'40'" [matTooltip]="element.helpText">{{element.textBefore}}</div>
            <mat-radio-group [formControlName]="element.id" [style.flex]="'60'"
                             class="fx-row-space-around-center" (ngModelChange)="valueChanged(element.id, $event)">
              <mat-radio-button *ngFor="let header of headerList; let i = index" [value]="(i + 1).toString()">
              </mat-radio-button>
            </mat-radio-group>
          </div>
        </div>
      </mat-card-content>
    </mat-card>
  `,
  styles: [
    '.likert-header {min-height: 40px}',
    '.likert-row:nth-child(even) {background-color: #F5F5F5;}',
    '.likert-row:nth-child(odd) {background-color: lightgrey;}',
    '.likert-row {padding: 2px 10px}'
  ],
  encapsulation: ViewEncapsulation.None
})

export class LikertComponent extends ElementComponent implements OnInit, OnDestroy {
  localForm = new FormGroup({});
  localFormId = Math.floor(Math.random() * 20000000 + 10000000).toString();
  headerList: string[];
  elements: (LikertElement | ErrorElement)[];

  @Input()
  set elementData(value: LikertBlock) {
    this.elements = [];
    this.headerList = value.headerList;
    value.elements.forEach(likertElement => {
      if (likertElement instanceof LikertElement) {
        const formControl = new FormControl();
        formControl.setValue(likertElement.value, { emitEvent: false });
        this.localForm.addControl(likertElement.id, formControl);
        this.elements.push(likertElement);
      } else if (likertElement instanceof ErrorElement) {
        this.elements.push(likertElement);
      }
    });
  }

  ngOnInit() {
    setTimeout(() => {
      this.parentForm.addControl(this.localFormId, this.localForm);
    });
  }

  ngOnDestroy(): void {
    this.parentForm.removeControl(this.localFormId);
  }

  valueChanged(id: string, $event: string) {
    const myElement = this.elements.find(e => (e as InputElement).id === id);
    if (myElement) {
      (myElement as InputElement).value = $event;
      (myElement as InputElement).status = VeronaResponseStatus.VALUE_CHANGED;
      this.valueChange.emit();
    }
  }

  comingIntoView(id: string) {
    const myElement = this.elements.find(e => (e as InputElement).id === id);
    if (myElement && (myElement as InputElement).status === VeronaResponseStatus.NOT_REACHED) {
      (myElement as InputElement).status = VeronaResponseStatus.DISPLAYED;
      this.valueChange.emit();
    }
  }
}

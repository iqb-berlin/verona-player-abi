import {
  Component, Input, OnDestroy, ViewEncapsulation
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { Subscription } from 'rxjs';
import { ElementComponent } from './element.component';
import { ErrorElement, LikertBlock, LikertElement } from '../classes';

@Component({
  selector: 'player-likert',
  template: `
    <mat-card class="fx-column-start-stretch">
      <div class="fx-row-space-between-center">
        <div [style.flex]="'40'">&nbsp;</div>
        <div [style.flex]="'60'" class="fx-row-space-around-center">
          <div *ngFor="let header of headerList" class="fx-row-center-center">{{header}}</div>
        </div>
      </div>
      <mat-card-content class="fx-column-start-stretch">
        <div *ngFor="let element of elements"
             [formGroup]="parentForm" class="likert-row">
          <div *ngIf="element.type === fieldType.SCRIPT_ERROR">
            {{element.text}}
          </div>
          <div *ngIf="element.fieldType === fieldType.LIKERT_ELEMENT"
               class="fx-row-space-around-center">
            <div [style.flex]="'40'" [matTooltip]="element.helpText">{{element.textBefore}}</div>
            <mat-radio-group [formControlName]="element.id" [style.flex]="'60'"
                             class="fx-row-space-around-center">
              <mat-radio-button [style.flex]="'auto'" [value]="header"
                                *ngFor="let header of headerList;let i=index;"
                                [formControlName]="element.id" ngDefaultControl>
              </mat-radio-button>
            </mat-radio-group>
          </div>
        </div>
      </mat-card-content>
    </mat-card>
  `,
  styles: [
    '.mat-radio-label {flex-direction: row; place-content: center center}',
    '.likert-row:nth-child(even) {background-color: #F5F5F5;}',
    '.likert-row:nth-child(odd) {background-color: lightgrey;}',
    '.likert-row {padding: 4px}'
  ],
  encapsulation: ViewEncapsulation.None
})

export class LikertComponent extends ElementComponent implements OnDestroy {
  headerList: string[];
  elements: (LikertElement | ErrorElement)[];
  formControls = [];
  valueChangeSubscriptions: Subscription[] = [];

  @Input()
  set elementData(value: LikertBlock) {
    this.elements = [];
    this.headerList = value.headerList;
    this.valueChangeSubscriptions.forEach(subscription => {
      subscription.unsubscribe();
    });
    value.elements.forEach(likertElement => {
      if (likertElement instanceof LikertElement) {
        const formControl = new FormControl(likertElement.id);
        this.formControls.push(formControl);
        this.parentForm.addControl(likertElement.id, formControl);
        this.valueChangeSubscriptions.push(formControl.valueChanges.subscribe(newValue => {
          likertElement.value = String(newValue);
          this.valueChange.emit();
        }));
        if (likertElement.value) formControl.setValue(likertElement.value);
        this.elements.push(likertElement);
      } else if (likertElement instanceof ErrorElement) {
        this.elements.push(likertElement);
      }
    });
  }

  ngOnDestroy(): void {
    this.valueChangeSubscriptions.forEach(subscription => {
      subscription.unsubscribe();
    });
    this.formControls.forEach(formControl => {
      this.parentForm.removeControl(formControl);
    });
  }
}

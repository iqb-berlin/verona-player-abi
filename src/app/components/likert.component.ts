import {
  Component, Input, OnDestroy, OnInit, ViewEncapsulation
} from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
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
      <mat-card-content class="fx-column-start-stretch" [formGroup]="localForm">
        <div *ngFor="let element of elements" class="likert-row">
          <div *ngIf="element.type === fieldType.SCRIPT_ERROR">
            {{element.textBefore}}
          </div>
          <div *ngIf="element.type === fieldType.LIKERT_ELEMENT"
               class="fx-row-space-around-center">
            <div [style.flex]="'40'" [matTooltip]="element.helpText">{{element.textBefore}}</div>
            <mat-radio-group [formControlName]="element.id" [style.flex]="'60'"
                             class="fx-row-space-around-center">
              <mat-radio-button *ngFor="let header of headerList; let i = index" [value]="(i + 1).toString()">
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

export class LikertComponent extends ElementComponent implements OnInit, OnDestroy {
  localForm = new FormGroup({});
  headerList: string[];
  elements: (LikertElement | ErrorElement)[];
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
        const formControl = new FormControl();
        this.localForm.addControl(likertElement.id, formControl);
        /*
        this.valueChangeSubscriptions.push(formControl.valueChanges.subscribe(newValue => {
          likertElement.value = String(newValue);
          this.valueChange.emit();
        }));
        if (likertElement.value) formControl.setValue(likertElement.value);
         */
        this.elements.push(likertElement);
      } else if (likertElement instanceof ErrorElement) {
        this.elements.push(likertElement);
      }
    });
  }

  ngOnInit() {
    setTimeout(() => {
      this.parentForm.addControl('', this.localForm);
    });
  }

  ngOnDestroy(): void {
    this.valueChangeSubscriptions.forEach(subscription => {
      subscription.unsubscribe();
    });
    //  this.parentForm.removeControl(formControl);
  }
}

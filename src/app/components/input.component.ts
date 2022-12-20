import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { ElementComponent } from './element.component';
import { FieldType, PropertyKey } from '../classes/interfaces';
import { InputElement } from '../classes/UIElement';

@Component({
  selector: 'player-input',
  template: `
    <div fxLayout="row" fxLayoutAlign="space-between center" fxFill>
      <div fxFlex="50" *ngIf="preText">
        <p>{{preText}}</p>
      </div>
      <div fxFlex="50" fxLayout="row">
        <mat-form-field *ngIf="linesNumber > 1" appearance="fill" fxFlex="90" fxFlexAlign="start">
          <textarea matInput cdkTextareaAutosize cdkAutosizeMinRows="2" [cdkAutosizeMaxRows]="linesNumber"
                    [formControl]="inputControl"
                    autocomplete="off"
                    matTooltip={{helpText}}
                    matTooltipPosition="above"></textarea>
          <mat-error *ngIf="inputControl.errors">
            {{inputControl.errors | errorTransform}}
          </mat-error>
        </mat-form-field>
        <mat-form-field *ngIf="linesNumber <= 1" fxFlexAlign="start" appearance="fill" fxFlex="50">
          <input matInput [formControl]="inputControl" autocomplete="off"
                 matTooltip={{helpText}} matTooltipPosition="above"/>
          <mat-error *ngIf="inputControl.errors">
            {{inputControl.errors | errorTransform}}
          </mat-error>
        </mat-form-field>
        <p style="margin: 0 0 0 10px" *ngIf="postText">{{postText}}</p>
      </div>
    </div>
  `
})

export class InputComponent extends ElementComponent implements OnInit, OnDestroy {
  preText = '';
  postText = '';
  helpText = '';
  linesNumber = 1;
  inputControl = new FormControl();
  valueChangeSubscription: Subscription;

  ngOnInit(): void {
    const elementData = this.elementData as InputElement;
    this.preText = elementData.properties.get(PropertyKey.TEXT);
    this.postText = elementData.properties.get(PropertyKey.TEXT2);
    this.helpText = elementData.helpText;
    if (elementData.fieldType === FieldType.INPUT_TEXT) {
      const linesNumberStr = elementData.properties.get(PropertyKey.LINES_NUMBER);
      if (linesNumberStr) {
        const linesNumberTry = Number(linesNumberStr);
        if (!Number.isNaN(linesNumberTry)) {
          this.linesNumber = linesNumberTry;
        }
      }
      const myValidators = [];
      const maxLengthStr = elementData.properties.get(PropertyKey.MAX_LENGTH);
      if (maxLengthStr) {
        const maxLengthNumberTry = Number(maxLengthStr);
        if (!Number.isNaN(maxLengthNumberTry)) {
          myValidators.push(Validators.maxLength(maxLengthNumberTry));
        }
      }
      if (elementData.required) {
        myValidators.push(Validators.required);
      }
      if (myValidators.length > 0) {
        this.inputControl.setValidators(myValidators);
      }
      if (this.value) {
        this.inputControl.setValue(this.value);
      }
      this.parentForm.addControl(elementData.id, this.inputControl);
      this.valueChangeSubscription = this.inputControl.valueChanges.subscribe(() => {
        if (this.inputControl.valid) {
          this.value = this.inputControl.value;
        } else {
          this.value = '';
        }
      });
    } else if (elementData.fieldType === FieldType.INPUT_NUMBER) {
      const myValidators = [];
      myValidators.push(Validators.pattern(/^-?\d+[.,]?\d*$/));
      const maxValueStr = elementData.properties.get(PropertyKey.MAX_VALUE);
      if (maxValueStr) {
        const maxValueNumberTry = Number(maxValueStr);
        if (!Number.isNaN(maxValueNumberTry)) {
          myValidators.push(Validators.max(maxValueNumberTry));
        }
      }
      const minValueStr = elementData.properties.get(PropertyKey.MIN_VALUE);
      if (minValueStr) {
        const minValueNumberTry = Number(minValueStr);
        if (!Number.isNaN(minValueNumberTry)) {
          myValidators.push(Validators.min(minValueNumberTry));
        }
      }
      if (elementData.required) {
        myValidators.push(Validators.required);
      }
      if (this.value) {
        this.inputControl.setValue(this.value);
      }
      this.inputControl.setValidators(myValidators);
      this.parentForm.addControl(elementData.id, this.inputControl);
      this.valueChangeSubscription = this.inputControl.valueChanges.subscribe(() => {
        if (this.inputControl.valid) {
          this.value = this.inputControl.value;
        } else {
          this.value = '';
        }
      });
    }
  }

  ngOnDestroy(): void {
    this.valueChangeSubscription.unsubscribe();
    this.parentForm.removeControl((this.elementData as InputElement).id);
  }
}

import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { PropertyKey } from '../classes/interfaces';
import { ElementComponent } from './element.component';
import { InputElement } from '../classes/UIElement';

@Component({
  selector: 'player-select',
  styles: [
    '.r-group {display: flex; flex-direction: column; margin: 15px 0;}',
    '.r-option {margin: 5px;}'],
  template: `
    <div fxLayout="row" fxLayoutAlign="space-between start" fxFill>
      <div fxFlex="50" *ngIf="label">
        <p>{{label}}</p>
      </div>
      <div fxFlex="50" fxLayout="row">
        <mat-radio-group class="r-group" [formControl]="selectInputControl" fxLayout="column" fxLayoutAlign="start start"
                         *ngIf="elementDataAsUIElement.fieldType === fieldType.MULTIPLE_CHOICE"
                         matTooltip={{helpText}} [matTooltipPosition]="'above'">
          <mat-radio-button class="r-option" *ngFor="let option of options; let i = index"
                            [value]="(i + 1).toString()">
            {{option}}
          </mat-radio-button>
          <mat-error *ngIf="selectInputControl.touched && selectInputControl.errors">
            {{selectInputControl.errors | errorTransform}}
          </mat-error>
        </mat-radio-group>
        <mat-form-field appearance="fill" *ngIf="elementDataAsUIElement.fieldType === fieldType.DROP_DOWN">
          <mat-select [formControl]="selectInputControl" placeholder="Bitte wählen"
                      matTooltip={{helpText}} [matTooltipPosition]="'above'">
            <mat-option *ngIf="showEmptyOptionFirst" [value]=""></mat-option>
            <mat-option *ngFor="let option of options; let i = index" [value]="(i + 1).toString()">
              {{option}}
            </mat-option>
          </mat-select>
          <mat-error *ngIf="selectInputControl.errors">
            {{selectInputControl.errors | errorTransform}}
          </mat-error>
        </mat-form-field>
      </div>
    </div>
  `
})
export class SelectComponent extends ElementComponent implements OnInit, OnDestroy {
  label = '';
  helpText = '';
  options: string[] = [];
  selectInputControl = new FormControl();
  valueChangeSubscription: Subscription;
  showEmptyOptionFirst = false;

  ngOnInit(): void {
    const elementData = this.elementData as InputElement;
    this.label = elementData.properties.get(PropertyKey.TEXT);
    this.helpText = elementData.helpText;
    const optionsStr = elementData.properties.get(PropertyKey.TEXT2);
    if (optionsStr) {
      this.options = optionsStr.split('##');
    }
    if (elementData.required) {
      this.selectInputControl.setValidators(Validators.required);
    } else {
      this.showEmptyOptionFirst = true;
    }
    if (this.value) {
      this.selectInputControl.setValue(this.value);
    }
    this.parentForm.addControl(elementData.id, this.selectInputControl);
    this.valueChangeSubscription = this.selectInputControl.valueChanges.subscribe(() => {
      if (this.selectInputControl.valid) {
        this.value = this.selectInputControl.value;
      } else {
        this.value = '';
      }
    });
  }

  ngOnDestroy(): void {
    this.valueChangeSubscription.unsubscribe();
    this.parentForm.removeControl((this.elementData as InputElement).id);
  }
}

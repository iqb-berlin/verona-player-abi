import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { ElementComponent } from './element.component';
import { PropertyKey } from '../classes/interfaces';
import { InputElement } from '../classes/UIElement';

@Component({
  selector: 'player-checkbox',
  template: `
    <div fxLayout="row" fxLayoutAlign="space-between center" fxFill>
      <div fxFlex="50" *ngIf="preText">
        <p>{{preText}}</p>
      </div>
      <div fxFlex="50">
        <mat-checkbox class="chb" [formControl]="checkboxControl"
                      matTooltip={{helpText}}
                      [matTooltipPosition]="'above'">
          {{postText}}
        </mat-checkbox>
        <mat-error *ngIf="checkboxControl.errors && checkboxControl.touched">
          {{checkboxControl.errors | errorTransform: true}}
        </mat-error>
      </div>
    </div>
  `,
  styles: [
    '.chb {margin: 5px;}']
})
export class CheckboxComponent extends ElementComponent implements OnInit, OnDestroy {
  preText = '';
  postText = '';
  helpText = '';
  checkboxControl = new FormControl();
  valueChangeSubscription: Subscription;

  ngOnInit(): void {
    const elementData = this.elementData as InputElement;
    this.preText = elementData.properties.get(PropertyKey.TEXT);
    this.postText = elementData.properties.get(PropertyKey.TEXT2);
    this.helpText = elementData.helpText;
    if (elementData.required) {
      this.checkboxControl.setValidators(Validators.requiredTrue);
    }
    this.parentForm.addControl(elementData.id, this.checkboxControl);
    this.valueChangeSubscription = this.checkboxControl.valueChanges.subscribe(() => {
      if (this.checkboxControl.valid && this.checkboxControl.value === true) {
        this.value = 'true';
      } else {
        this.value = 'false';
      }
    });
    this.checkboxControl.setValue(this.value === 'true');
  }

  ngOnDestroy(): void {
    this.valueChangeSubscription.unsubscribe();
    this.parentForm.removeControl((this.elementData as InputElement).id);
  }
}

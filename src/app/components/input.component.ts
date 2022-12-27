import {
  Component, Input, OnDestroy, OnInit
} from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { ElementComponent } from './element.component';
import { NumberInputElement, TextInputElement } from '../classes';

@Component({
  selector: 'player-input',
  template: `
    <div class="fx-row-space-between-center">
      <div [style.flex] ="'50'" *ngIf="elementData.textBefore">
        {{elementData.textBefore}}
      </div>
      <div [style.flex] ="'50'" class="fx-column-start-stretch">
        <mat-form-field *ngIf="elementAsTextInput.maxLines > 1" appearance="fill" [style.flex] ="'90'">
          <textarea matInput cdkTextareaAutosize cdkAutosizeMinRows="2"
                    [cdkAutosizeMaxRows]="elementAsTextInput.maxLines"
                    [formControl]="inputControl"
                    autocomplete="off"
                    matTooltip={{helpText}}
                    matTooltipPosition="above"></textarea>
          <mat-error *ngIf="inputControl.errors">
            {{inputControl.errors | errorTransform}}
          </mat-error>
        </mat-form-field>
        <mat-form-field *ngIf="elementAsTextInput.maxLines <= 1" appearance="fill" [style.flex] ="'50'">
          <input matInput [formControl]="inputControl" autocomplete="off"
                 matTooltip={{helpText}} matTooltipPosition="above"/>
          <mat-error *ngIf="inputControl.errors">
            {{inputControl.errors | errorTransform}}
          </mat-error>
        </mat-form-field>
        <p style="margin: 0 0 0 10px" *ngIf="elementData.textAfter">{{elementData.textAfter}}</p>
      </div>
    </div>
  `
})

export class InputComponent extends ElementComponent implements OnInit, OnDestroy {
  @Input() elementData: NumberInputElement | TextInputElement;
  inputControl = new FormControl();
  valueChangeSubscription: Subscription;

  get elementAsNumberInput(): NumberInputElement {
    return this.elementData as NumberInputElement;
  }

  get elementAsTextInput(): TextInputElement {
    return this.elementData as TextInputElement;
  }

  ngOnInit(): void {
    const myValidators = [];
    if (this.elementData instanceof TextInputElement) {
      if (this.elementData.maxLength) myValidators.push(Validators.maxLength(this.elementData.maxLength));
    } else {
      myValidators.push(Validators.pattern(/^-?\d+[.,]?\d*$/));
      if (this.elementData.maxValue) myValidators.push(Validators.max(this.elementData.maxValue));
      if (this.elementData.minValue) myValidators.push(Validators.min(this.elementData.minValue));
    }
    if (this.elementData.required) myValidators.push(Validators.required);
    if (myValidators.length > 0) this.inputControl.setValidators(myValidators);
    this.inputControl.setValue(this.elementData.value);
    this.parentForm.addControl(this.elementData.id, this.inputControl);
    this.valueChangeSubscription = this.inputControl.valueChanges.subscribe(() => {
      if (this.inputControl.valid) {
        this.elementData.value = this.inputControl.value;
      } else {
        this.elementData.value = '';
      }
      this.valueChange.emit(this.elementData.value);
    });
  }

  ngOnDestroy(): void {
    this.valueChangeSubscription.unsubscribe();
    this.parentForm.removeControl(this.elementData.id);
  }
}

import {
  Component, Input, OnDestroy, OnInit
} from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { ElementComponent } from './element.component';
import { NumberInputElement, TextInputElement } from '../classes';
import { VeronaResponseStatus } from '../verona/verona.interfaces';

@Component({
  selector: 'player-input',
  template: `
    <div class="fx-row-start-center" IsInViewDetection (intersecting)="comingIntoView()">
      <div [style.flex] ="'0 1 50%'" *ngIf="elementData.textBefore">
        {{elementData.textBefore}}
      </div>
      <mat-form-field *ngIf="elementAsTextInput.maxLines > 1"
                      [style.flex] ="elementData.textAfter ? '30' : '50'" appearance="fill">
        <textarea matInput cdkTextareaAutosize="true" cdkAutosizeMinRows="2"
                  [cdkAutosizeMaxRows]="elementAsTextInput.maxLines ? elementAsTextInput.maxLines + 1 : 2"
                  [formControl]="inputControl"
                  autocomplete="off"
                  (ngModelChange)="valueChanged($event)"
                  [matTooltip]="elementData.helpText"
                  matTooltipPosition="above"></textarea>
        <mat-error *ngIf="inputControl.errors">
          {{inputControl.errors | errorTransform}}
        </mat-error>
      </mat-form-field>
      <mat-form-field appearance="fill"
          *ngIf="elementAsTextInput.maxLines <= 1 || elementAsNumberInput.maxValue || elementAsNumberInput.minValue"
          [style.flex]="'0 1 25%'">
        <input matInput [formControl]="inputControl" autocomplete="off" (ngModelChange)="valueChanged($event)"
               [matTooltip]="elementData.helpText" matTooltipPosition="above"/>
        <mat-error *ngIf="inputControl.errors">
          {{inputControl.errors | errorTransform}}
        </mat-error>
      </mat-form-field>
      <div [style.margin-left]="'10px'" *ngIf="elementData.textAfter">{{elementData.textAfter}}</div>
    </div>
  `
})

export class InputComponent extends ElementComponent implements OnInit, OnDestroy {
  @Input() elementData: NumberInputElement | TextInputElement;
  inputControl = new FormControl();

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
      if (this.elementData.maxValue < Number.MAX_VALUE) myValidators.push(Validators.max(this.elementData.maxValue));
      if (this.elementData.minValue > -Number.MAX_VALUE) myValidators.push(Validators.min(this.elementData.minValue));
    }
    if (this.elementData.required) myValidators.push(Validators.required);
    if (myValidators.length > 0) this.inputControl.setValidators(myValidators);
    this.inputControl.setValue(this.elementData.value, { emitEvent: false });
    this.parentForm.addControl(this.elementData.id, this.inputControl);
  }

  ngOnDestroy(): void {
    this.parentForm.removeControl(this.elementData.id);
  }

  valueChanged($event: string) {
    this.elementData.value = $event;
    this.elementData.status = VeronaResponseStatus.VALUE_CHANGED;
    this.valueChange.emit();
  }

  comingIntoView() {
    if (this.elementData.status === VeronaResponseStatus.NOT_REACHED) {
      this.elementData.status = VeronaResponseStatus.DISPLAYED;
      this.valueChange.emit();
    }
  }
}

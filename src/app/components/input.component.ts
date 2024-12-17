import {
  Component, OnDestroy, OnInit, input } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { ElementComponent } from './element.component';
import { NumberInputElement, TextInputElement } from '../classes';
import { VeronaResponseStatus } from '../verona/verona.interfaces';

@Component({
  selector: 'player-input',
  standalone: false,
  template: `
    <div class="fx-row-start-center" IsInViewDetection (intersecting)="comingIntoView()">
      @if (elementData().textBefore) {
        <div [style.flex] ="'50 1 320px'">
          {{elementData().textBefore}}
        </div>
      }
      @if (elementAsTextInput.maxLines > 1) {
        <mat-form-field
          [style.flex] ="elementData().textAfter ? '30' : '50'" appearance="fill">
          <textarea matInput
            cdkTextareaAutosize="true"
            cdkAutosizeMinRows="2"
            [cdkAutosizeMaxRows]="elementAsTextInput.maxLines ? elementAsTextInput.maxLines + 1 : 2"
            [formControl]="inputControl"
            autocomplete="off"
            (input)="valueChanged($event)"
            [matTooltip]="elementData().helpText"
            matTooltipPosition="above"
          ></textarea>
          @if (inputControl.errors) {
            <mat-error>
              {{inputControl.errors | errorTransform}}
            </mat-error>
          }
        </mat-form-field>
      }
      @if (elementAsTextInput.maxLines <= 1 || elementAsNumberInput.maxValue || elementAsNumberInput.minValue) {
        <mat-form-field appearance="fill"
          [style.flex]="'0 1 200px'">
          <mat-label>{{elementData().textBefore}}</mat-label>
          <input matInput [formControl]="inputControl" autocomplete="off" (input)="valueChanged($event)"
            [matTooltip]="elementData().helpText" matTooltipPosition="above"/>
            @if (inputControl.errors) {
              <mat-error>
                {{inputControl.errors | errorTransform}}
              </mat-error>
            }
          </mat-form-field>
        }
        @if (elementData().textAfter) {
          <div [style.margin-left]="'10px'" [style.flex]="'1 1 25%'">{{elementData().textAfter}}</div>
        }
      </div>
  `
})

export class InputComponent extends ElementComponent implements OnInit, OnDestroy {
  elementData = input<NumberInputElement | TextInputElement>();
  inputControl = new FormControl();

  get elementAsNumberInput(): NumberInputElement {
    return this.elementData() as NumberInputElement;
  }

  get elementAsTextInput(): TextInputElement {
    return this.elementData() as TextInputElement;
  }

  ngOnInit(): void {
    const myValidators = [];
    if (this.elementData() instanceof TextInputElement) {
      if ((this.elementData() as TextInputElement).maxLength) myValidators.push(Validators.maxLength((this.elementData() as TextInputElement).maxLength));
    } else {
      myValidators.push(Validators.pattern(/^-?\d+[.,]?\d*$/));
      if ((this.elementData() as NumberInputElement).maxValue < Number.MAX_VALUE) myValidators.push(Validators.max((this.elementData() as NumberInputElement).maxValue));
      if ((this.elementData() as NumberInputElement).minValue > -Number.MAX_VALUE) myValidators.push(Validators.min((this.elementData() as NumberInputElement).minValue));
    }
    if (this.elementData().required) myValidators.push(Validators.required);
    if (myValidators.length > 0) this.inputControl.setValidators(myValidators);
    this.inputControl.setValue(this.elementData().value, { emitEvent: false });
    this.parentForm().addControl(this.elementData().id, this.inputControl);
  }

  ngOnDestroy(): void {
    this.parentForm().removeControl(this.elementData().id);
  }

  valueChanged($event: Event) {
    this.elementData().value = ($event.target as HTMLInputElement).value;
    this.elementData().status = VeronaResponseStatus.VALUE_CHANGED;
    this.valueChange.emit();
  }

  comingIntoView() {
    if (this.elementData().status === VeronaResponseStatus.NOT_REACHED) {
      this.elementData().status = VeronaResponseStatus.DISPLAYED;
      this.valueChange.emit();
    }
  }
}

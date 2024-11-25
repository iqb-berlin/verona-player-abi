import {
  Component, OnDestroy, OnInit, input } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { ElementComponent } from './element.component';
import { CheckboxElement } from '../classes';
import { VeronaResponseStatus } from '../verona/verona.interfaces';
import {MatCheckboxChange} from "@angular/material/checkbox";

@Component({
  selector: 'player-checkbox',

      template: `
    <div class="fx-row-start-center">
      @if (elementData().textBefore) {
        <div [style.flex] ="'0 1 50%'">
          {{elementData().textBefore}}
        </div>
      }
      <div [style.flex]="'50'" IsInViewDetection (intersecting)="comingIntoView()">
        <mat-checkbox [formControl]="checkboxControl"
          [matTooltip]="elementData().helpText"
          (change)="valueChanged($event)"
          [matTooltipPosition]="'above'">
          {{elementData().textAfter}}
        </mat-checkbox>
        @if (checkboxControl.errors && checkboxControl.touched) {
          <mat-error>
            {{checkboxControl.errors | errorTransform: true}}
          </mat-error>
        }
      </div>
    </div>
    `
})
export class CheckboxComponent extends ElementComponent implements OnInit, OnDestroy {
  elementData = input<CheckboxElement>();
  checkboxControl = new FormControl();

  ngOnInit(): void {
    if (this.elementData().required) {
      this.checkboxControl.setValidators(Validators.requiredTrue);
    }
    this.parentForm().addControl(this.elementData().id, this.checkboxControl);
    this.checkboxControl.setValue(this.elementData().value === 'true', { emitEvent: false });
  }

  ngOnDestroy(): void {
    this.parentForm().removeControl(this.elementData().id);
  }

  valueChanged($event: MatCheckboxChange) {
    this.elementData().value = $event ? 'true' : 'false';
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

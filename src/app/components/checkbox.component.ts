import {
  Component, Input, OnDestroy, OnInit
} from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { ElementComponent } from './element.component';
import { CheckboxElement } from '../classes';

@Component({
  selector: 'player-checkbox',
  template: `
    <div class="fx-row-start-center">
      <div [style.flex] ="'0 1 50%'" *ngIf="elementData.textBefore">
        {{elementData.textBefore}}
      </div>
      <div [style.flex]="'50'">
        <mat-checkbox [formControl]="checkboxControl"
                      [matTooltip]="elementData.helpText"
                      (ngModelChange)="valueChanged($event)"
                      [matTooltipPosition]="'above'">
          {{elementData.textAfter}}
        </mat-checkbox>
        <mat-error *ngIf="checkboxControl.errors && checkboxControl.touched">
          {{checkboxControl.errors | errorTransform: true}}
        </mat-error>
      </div>
    </div>
  `
})
export class CheckboxComponent extends ElementComponent implements OnInit, OnDestroy {
  @Input() elementData: CheckboxElement;
  checkboxControl = new FormControl();

  ngOnInit(): void {
    if (this.elementData.required) {
      this.checkboxControl.setValidators(Validators.requiredTrue);
    }
    this.parentForm.addControl(this.elementData.id, this.checkboxControl);
    this.checkboxControl.setValue(this.elementData.value === 'true', { emitEvent: false });
  }

  ngOnDestroy(): void {
    this.parentForm.removeControl(this.elementData.id);
  }

  valueChanged($event: boolean) {
    this.elementData.value = $event ? 'true' : 'false';
    this.valueChange.emit();
  }
}

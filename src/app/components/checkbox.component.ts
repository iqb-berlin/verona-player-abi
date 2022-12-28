import {
  Component, Input, OnDestroy, OnInit
} from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
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
  valueChangeSubscription: Subscription;

  ngOnInit(): void {
    if (this.elementData.required) {
      this.checkboxControl.setValidators(Validators.requiredTrue);
    }
    this.parentForm.addControl(this.elementData.id, this.checkboxControl);
    this.valueChangeSubscription = this.checkboxControl.valueChanges.subscribe(() => {
      if (this.checkboxControl.valid && this.checkboxControl.value === true) {
        this.elementData.value = 'true';
      } else {
        this.elementData.value = 'false';
      }
      this.valueChange.emit(this.elementData.value);
    });
    this.checkboxControl.setValue(this.elementData.value === 'true');
  }

  ngOnDestroy(): void {
    this.valueChangeSubscription.unsubscribe();
    this.parentForm.removeControl(this.elementData.id);
  }
}

import {
  Component, Input, OnDestroy, OnInit
} from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import { ElementComponent } from './element.component';
import { CheckboxBlock, CheckboxElement, ErrorElement } from '../classes';

@Component({
  selector: 'player-checkboxes',
  template: `
    <div class="fx-row-start-start">
      <div [style.flex] ="'0 1 50%'" *ngIf="textBefore">
        {{textBefore}}
      </div>
      <div [style.flex]="'50'" class="fx-column-start-stretch" [formGroup]="localForm">
        <div *ngFor="let element of elements">
          <div *ngIf="element.type === fieldType.SCRIPT_ERROR">
            {{element.text}} {{element.parameter}}
          </div>
          <div *ngIf="element.type === fieldType.CHECKBOX">
            <mat-checkbox [formControlName]="element.id"
                          [matTooltip]="element.helpText"
                          [matTooltipPosition]="'above'">
              {{element.textBefore}}
            </mat-checkbox>
          </div>
        </div>
      </div>
    </div>
  `
})

export class CheckboxesComponent extends ElementComponent implements OnInit, OnDestroy {
  localForm = new FormGroup({});
  formControls = [];
  valueChangeSubscriptions: Subscription[] = [];
  elements: (CheckboxElement | ErrorElement)[] = [];
  textBefore = '';

  @Input()
  set elementData(value: CheckboxBlock) {
    this.textBefore = value.textBefore;
    value.elements.forEach(checkboxElement => {
      if (checkboxElement instanceof CheckboxElement) {
        const formControl = new FormControl();
        this.formControls.push(formControl);
        this.localForm.addControl(checkboxElement.id, formControl, { emitEvent: false });
        this.elements.push(checkboxElement);
        /*
        this.valueChangeSubscriptions.push(formControl.valueChanges.subscribe(newValue => {
          checkboxElement.value = String(newValue);
          this.valueChange.emit();
        }));
        if (checkboxElement.value) formControl.setValue(checkboxElement.value);
         */
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
    this.formControls.forEach(formControl => {
      this.parentForm.removeControl(formControl);
    });
  }
}

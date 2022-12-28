import {
  Component, Input, OnDestroy, OnInit
} from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { ElementComponent } from './element.component';
import { SelectionElement } from '../classes';

@Component({
  selector: 'player-select',
  template: `
    <div [class]="elementData.type === fieldType.MULTIPLE_CHOICE ? 'fx-row-start-start' : 'fx-row-start-center'">
      <div [style.flex] ="'0 1 50%'" *ngIf="elementData.textBefore">
        {{elementData.textBefore}}
      </div>
      <mat-radio-group *ngIf="elementData.type === fieldType.MULTIPLE_CHOICE"
                       [style.flex]="'50'" class="fx-column-start-stretch" [formControl]="selectInputControl"
                       [matTooltip]="elementData.helpText" [matTooltipPosition]="'above'">
        <mat-radio-button *ngFor="let option of elementData.options; let i = index"
                          [value]="(i + 1).toString()">
          {{option}}
        </mat-radio-button>
        <mat-error *ngIf="selectInputControl.touched && selectInputControl.errors">
          {{selectInputControl.errors | errorTransform}}
        </mat-error>
      </mat-radio-group>

      <mat-form-field [style.flex]="'50'"
        appearance="fill" *ngIf="elementData.type === fieldType.DROP_DOWN">
        <mat-select [formControl]="selectInputControl" placeholder="Bitte wählen"
                    [matTooltip]="elementData.helpText" [matTooltipPosition]="'above'">
          <mat-option *ngIf="!elementData.required" [value]=""></mat-option>
          <mat-option *ngFor="let option of elementData.options; let i = index" [value]="(i + 1).toString()">
            {{option}}
          </mat-option>
        </mat-select>
        <mat-error *ngIf="selectInputControl.errors">
          {{selectInputControl.errors | errorTransform}}
        </mat-error>
      </mat-form-field>
    </div>
  `
})
export class SelectComponent extends ElementComponent implements OnInit, OnDestroy {
  @Input() elementData: SelectionElement;
  selectInputControl = new FormControl();
  valueChangeSubscription: Subscription;

  ngOnInit(): void {
    if (this.elementData.required) this.selectInputControl.setValidators(Validators.required);
    if (this.elementData.value) this.selectInputControl.setValue(this.elementData.value);
    this.parentForm.addControl(this.elementData.id, this.selectInputControl);
    this.valueChangeSubscription = this.selectInputControl.valueChanges.subscribe(() => {
      if (this.selectInputControl.valid) {
        this.elementData.value = this.selectInputControl.value;
      } else {
        this.elementData.value = '';
      }
    });
  }

  ngOnDestroy(): void {
    this.valueChangeSubscription.unsubscribe();
    this.parentForm.removeControl(this.elementData.id);
  }
}

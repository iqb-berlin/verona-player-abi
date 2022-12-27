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
    <div class="fx-row-space-between-start">
      <div [style.flex]="'50'" *ngIf="elementData.textBefore">
        {{elementData.textBefore}}
      </div>
      <div [style.flex]="'auto'" class="fx-row-space-between-start">
        <mat-radio-group class="r-group fx-column-start-stretch" [formControl]="selectInputControl"
                         *ngIf="elementData.type === fieldType.MULTIPLE_CHOICE"
                         matTooltip={{helpText}} [matTooltipPosition]="'above'">
          <mat-radio-button class="r-option" *ngFor="let option of elementData.options; let i = index"
                            [value]="(i + 1).toString()">
            {{option}}
          </mat-radio-button>
          <mat-error *ngIf="selectInputControl.touched && selectInputControl.errors">
            {{selectInputControl.errors | errorTransform}}
          </mat-error>
        </mat-radio-group>
        <mat-form-field appearance="fill" *ngIf="elementData.type === fieldType.DROP_DOWN">
          <mat-select [formControl]="selectInputControl" placeholder="Bitte wählen"
                      matTooltip={{helpText}} [matTooltipPosition]="'above'">
            <mat-option *ngIf="showEmptyOptionFirst" [value]=""></mat-option>
            <mat-option *ngFor="let option of elementData.options; let i = index" [value]="(i + 1).toString()">
              {{option}}
            </mat-option>
          </mat-select>
          <mat-error *ngIf="selectInputControl.errors">
            {{selectInputControl.errors | errorTransform}}
          </mat-error>
        </mat-form-field>
      </div>
    </div>
  `,
  styles: [
    '.r-group {display: flex; flex-direction: column; margin: 15px 0;}',
    '.r-option {margin: 5px;}']
})
export class SelectComponent extends ElementComponent implements OnInit, OnDestroy {
  @Input() elementData: SelectionElement;
  selectInputControl = new FormControl();
  valueChangeSubscription: Subscription;
  showEmptyOptionFirst = false;

  ngOnInit(): void {
    if (this.elementData.required) {
      this.selectInputControl.setValidators(Validators.required);
    } else {
      this.showEmptyOptionFirst = true;
    }
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

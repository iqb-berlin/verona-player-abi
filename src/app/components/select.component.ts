import {
  Component, Input, OnDestroy, OnInit
} from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { ElementComponent } from './element.component';
import { SelectionElement } from '../classes';
import { VeronaResponseStatus } from '../verona/verona.interfaces';

@Component({
  selector: 'player-select',
  template: `
    <div [class]="elementData.type === fieldType.MULTIPLE_CHOICE ? 'fx-row-start-start' : 'fx-row-start-center'"
         IsInViewDetection (intersecting)="comingIntoView()">
      <div [style.flex] ="'0 1 50%'" *ngIf="elementData.textBefore">
        {{elementData.textBefore}}
      </div>
      <mat-radio-group *ngIf="elementData.type === fieldType.MULTIPLE_CHOICE"
                       [style.flex]="'50'" class="fx-column-start-stretch" [formControl]="selectInputControl"
                       (ngModelChange)="valueChanged($event)"
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
                    (ngModelChange)="valueChanged($event)"
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

  ngOnInit(): void {
    if (this.elementData.required) this.selectInputControl.setValidators(Validators.required);
    this.selectInputControl.setValue(this.elementData.value, { emitEvent: false });
    this.parentForm.addControl(this.elementData.id, this.selectInputControl);
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

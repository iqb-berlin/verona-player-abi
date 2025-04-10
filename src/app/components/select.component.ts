import {
  Component, OnDestroy, OnInit, input } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { ElementComponent } from './element.component';
import { SelectionElement } from '../classes';
import { VeronaResponseStatus } from '../verona/verona.interfaces';
import {MatSelectChange} from "@angular/material/select";
import {MatRadioChange} from "@angular/material/radio";

@Component({
  selector: 'player-select',
  standalone: false,
  template: `
    <div [class]="elementData().type === fieldType.MULTIPLE_CHOICE ? 'fx-row-start-start' : 'fx-row-start-center'"
      IsInViewDetection (intersecting)="comingIntoView()">
      @if (elementData().textBefore) {
        <div [style.flex] ="'0 1 max(320px, 50%)'">
          {{elementData().textBefore}}
        </div>
      }
      @if (elementData().type === fieldType.MULTIPLE_CHOICE) {
        <mat-radio-group
          [style.flex]="'1 1 320px'" class="fx-column-start-stretch"
          [formControl]="selectInputControl"
          (change)="valueChanged($event)"
          [matTooltip]="elementData().helpText" [matTooltipPosition]="'above'">
          @for (option of elementData().options; track option; let i = $index) {
            <mat-radio-button
              [value]="(i + 1).toString()"
              [aria-label]="option">
              {{option}}
            </mat-radio-button>
          }
          @if (elementData().enableReset) {
            <button [style]="'width:min-content'" (click)="resetControl($event)">x</button>
          }
          @if (selectInputControl.touched && selectInputControl.errors) {
            <mat-error>
              {{selectInputControl.errors | errorTransform}}
            </mat-error>
          }
        </mat-radio-group>
      }

      @if (elementData().type === fieldType.DROP_DOWN) {
        <mat-form-field [style.flex]="'1 1 320px'"
          appearance="fill">
          <mat-select [formControl]="selectInputControl" placeholder="Bitte wählen"
            (selectionChange)="valueChanged($event)"
            [matTooltip]="elementData().helpText" [matTooltipPosition]="'above'">
            @if (!elementData().required) {
              <mat-option [value]=""></mat-option>
            }
            @for (option of elementData().options; track option; let i = $index) {
              <mat-option [value]="(i + 1).toString()">
                {{option}}
              </mat-option>
            }
          </mat-select>
          @if (selectInputControl.errors) {
            <mat-error>
              {{selectInputControl.errors | errorTransform}}
            </mat-error>
          }
        </mat-form-field>
      }
    </div>
  `,
  styles: ['button {margin: 6px 9px}']
})

export class SelectComponent extends ElementComponent implements OnInit, OnDestroy {
  elementData = input<SelectionElement>();
  selectInputControl = new FormControl();

  ngOnInit(): void {
    if (this.elementData().required) this.selectInputControl.setValidators(Validators.required);
    this.selectInputControl.setValue(this.elementData().value, { emitEvent: false });
    this.parentForm().addControl(this.elementData().id, this.selectInputControl);
  }

  ngOnDestroy(): void {
    this.parentForm().removeControl(this.elementData().id);
  }

  resetControl($event: any) {
    this.selectInputControl.setValue(null);
    this.elementData().value = undefined;
    this.elementData().status = VeronaResponseStatus.VALUE_CHANGED;
    this.valueChange.emit();
  }

  valueChanged($event: MatSelectChange | MatRadioChange) {
    this.elementData().value = $event.value;
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

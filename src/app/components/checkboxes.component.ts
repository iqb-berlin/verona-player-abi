import {
  Component, OnDestroy, OnInit, input } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ElementComponent } from './element.component';
import { CheckboxBlock, CheckboxElement, ErrorElement } from '../classes';
import { InputElement } from '../classes/elements/input-element.class';
import { VeronaResponseStatus } from '../verona/verona.interfaces';
import {MatCheckboxChange} from "@angular/material/checkbox";

@Component({
  selector: 'player-checkboxes',
  template: `
    <div class="fx-row-start-start">
      @if (textBefore) {
        <div [style.flex] ="'0 1 50%'">
          {{textBefore}}
        </div>
      }
      <div [style.flex]="'50'" class="fx-column-start-stretch" [formGroup]="localForm">
        @for (element of elements; track element) {
          <div>
            @if (element.type === fieldType.SCRIPT_ERROR) {
              <div>
                {{element.text}} {{element.parameter}}
              </div>
            }
            @if (element.type === fieldType.CHECKBOX) {
              <div
                IsInViewDetection (intersecting)="comingIntoView(element.id)">
                <mat-checkbox [formControlName]="element.id"
                  [matTooltip]="element.helpText"
                  (change)="valueChanged(element.id, $event)"
                  [matTooltipPosition]="'above'">
                  {{element.textBefore}}
                </mat-checkbox>
              </div>
            }
          </div>
        }
      </div>
    </div>
    `
})

export class CheckboxesComponent extends ElementComponent implements OnInit, OnDestroy {
  localForm = new FormGroup({});
  localFormId = Math.floor(Math.random() * 20000000 + 10000000).toString();
  elements: (CheckboxElement | ErrorElement)[] = [];
  elementData = input<CheckboxBlock>();
  textBefore = '';

  ngOnInit() {
    this.textBefore = this.elementData().textBefore;
    this.elements = [];
    this.elementData().elements.forEach(checkboxElement => {
      if (checkboxElement instanceof CheckboxElement) {
        const formControl = new FormControl();
        this.localForm.addControl(checkboxElement.id, formControl, { emitEvent: false });
        this.elements.push(checkboxElement);
        formControl.setValue(checkboxElement.value === 'true', { emitEvent: false });
      } else if (checkboxElement instanceof ErrorElement) {
        this.elements.push(checkboxElement);
      }
    });
    this.parentForm().addControl(this.localFormId, this.localForm);
  }

  ngOnDestroy(): void {
    this.parentForm().removeControl(this.localFormId);
  }

  valueChanged(id: string, $event: MatCheckboxChange) {
    const myElement = this.elements.find(e => (e as InputElement).id === id);
    if (myElement) {
      (myElement as InputElement).value = $event.checked ? 'true' : 'false';
      (myElement as InputElement).status = VeronaResponseStatus.VALUE_CHANGED;
      this.valueChange.emit();
    }
  }

  comingIntoView(id: string) {
    const myElement = this.elements.find(e => (e as InputElement).id === id);
    if (myElement && (myElement as InputElement).status === VeronaResponseStatus.NOT_REACHED) {
      (myElement as InputElement).status = VeronaResponseStatus.DISPLAYED;
      this.valueChange.emit();
    }
  }
}

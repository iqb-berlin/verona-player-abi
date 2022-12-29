import {
  Component, Input, OnDestroy, OnInit
} from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ElementComponent } from './element.component';
import { CheckboxBlock, CheckboxElement, ErrorElement } from '../classes';
import { InputElement } from '../classes/elements/input-element.class';

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
                          (ngModelChange)="valueChanged(element.id, $event)"
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
  localFormId = Math.floor(Math.random() * 20000000 + 10000000).toString();
  elements: (CheckboxElement | ErrorElement)[] = [];
  textBefore = '';

  @Input()
  set elementData(value: CheckboxBlock) {
    this.textBefore = value.textBefore;
    this.elements = [];
    value.elements.forEach(checkboxElement => {
      if (checkboxElement instanceof CheckboxElement) {
        const formControl = new FormControl();
        this.localForm.addControl(checkboxElement.id, formControl, { emitEvent: false });
        this.elements.push(checkboxElement);
        formControl.setValue(checkboxElement.value === 'true', { emitEvent: false });
      } else if (checkboxElement instanceof ErrorElement) {
        this.elements.push(checkboxElement);
      }
    });
  }

  ngOnInit() {
    setTimeout(() => {
      this.parentForm.addControl(this.localFormId, this.localForm);
    });
  }

  ngOnDestroy(): void {
    this.parentForm.removeControl(this.localFormId);
  }

  valueChanged(id: string, $event: boolean) {
    const myElement = this.elements.find(e => (e as InputElement).id === id);
    if (myElement) {
      (myElement as InputElement).value = $event ? 'true' : 'false';
      this.valueChange.emit();
    }
  }
}

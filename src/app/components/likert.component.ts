import {
  Component, OnDestroy, OnInit, ViewEncapsulation, input, inject, signal
} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {BreakpointObserver, Breakpoints} from '@angular/cdk/layout';
import { ElementComponent } from './element.component';
import { ErrorElement, LikertBlock, LikertElement } from '../classes';
import { InputElement } from '../classes/elements/input-element.class';
import { VeronaResponseStatus } from '../verona/verona.interfaces';
import { MatRadioChange } from "@angular/material/radio";

@Component({
  selector: 'player-likert',
  standalone: false,
  template: `
    <mat-card class="fx-column-start-stretch">
      @if (!this.matchBreakpoint()) {
        <div class="fx-row-space-between-center likert-header">
          <div [style.flex]="'40'">&nbsp;</div>
          <div [style.flex]="'60'" class="fx-row-space-around-center">
            @for (header of headerList; track header) {
              <div class="fx-row-center-center">{{header}}</div>
            }
            @if (this.elementData().enableReset) {
              <button style="visibility:hidden">Reset</button>
            }
          </div>
        </div>
      }
      <mat-card-content class="fx-column-start-stretch" [formGroup]="localForm">
        @for (element of elements; track element) {
          <div class="likert-row">
            @if (element.type === fieldType.SCRIPT_ERROR) {
              <div>
                {{element.text}} {{element.parameter}}
              </div>
            }
            @if (element.type === fieldType.LIKERT_ELEMENT) {
              <div
                class="fx-row-space-around-center" IsInViewDetection (intersecting)="comingIntoView(element.id)">
                <div [style.flex]="'40'" [matTooltip]="element.helpText">{{element.textBefore}}</div>
                <mat-radio-group [formControlName]="element.id" [style.flex]="'60'"
                  class="fx-row-space-around-center" (change)="valueChanged(element.id, $event)">
                  @for (header of headerList; track header; let i = $index) {
                    <mat-radio-button [value]="(i + 1).toString()" [aria-label]="header">
                      @if (this.matchBreakpoint()) {
                        {{header}}
                      }
                    </mat-radio-button>
                  }
                  @if (this.elementData().enableReset) {
                    <button (click)="resetControl(element.id, $event)">Reset</button>
                  }
                </mat-radio-group>
              </div>
            }
          </div>
        }
      </mat-card-content>
    </mat-card>
  `,
  styles: [
    '.likert-header {min-height: 40px}',
    '.likert-row:nth-child(even) {background-color: #F5F5F5;}',
    '.likert-row:nth-child(odd) {background-color: lightgrey;}',
    '.likert-row {padding: 2px 10px}',
    'button {margin: 10px}',
    '@media only screen and (max-width:600px) {mat-card-content.fx-column-start-stretch, .fx-row-space-around-center {flex-direction: column}}'
  ],
  encapsulation: ViewEncapsulation.None
})

export class LikertComponent extends ElementComponent implements OnInit, OnDestroy {
  localForm = new FormGroup({});
  localFormId = Math.floor(Math.random() * 20000000 + 10000000).toString();
  headerList: string[];
  elementData = input<LikertBlock>();
  matchBreakpoint = signal<boolean>(false);
  elements: (LikertElement | ErrorElement)[];

  constructor() {
    super();
    inject(BreakpointObserver)
      .observe([
        Breakpoints.XSmall
      ])
      .subscribe(result => {
        this.matchBreakpoint.set(result.matches);
      });
  }

  ngOnInit() {
    this.elements = [];
    this.headerList = this.elementData().headerList;
    const required = this.elementData().required;
    this.elementData().elements.forEach(likertElement => {
      if (likertElement instanceof LikertElement) {
        const formControl = new FormControl();
        if (required) {
          formControl.setValidators(Validators.requiredTrue);
        }
        formControl.setValue(likertElement.value, { emitEvent: false });
        this.localForm.addControl(likertElement.id, formControl);
        this.elements.push(likertElement);
      } else if (likertElement instanceof ErrorElement) {
        this.elements.push(likertElement);
      }
    });
    this.parentForm().addControl(this.localFormId, this.localForm);
  }

  ngOnDestroy(): void {
    this.parentForm().removeControl(this.localFormId);
  }

  resetControl(id: string, $event: any) {
    const myControl = this.localForm.controls[id];
    if (myControl) myControl.setValue(null);
    const myElement= this.elements.find(e => (e as InputElement).id === id);
    if (myElement) {
      (myElement as InputElement).value = undefined;
      (myElement as InputElement).status = VeronaResponseStatus.VALUE_CHANGED;
      this.valueChange.emit();
    }
  }

  valueChanged(id: string, $event: MatRadioChange) {
    const myElement = this.elements.find(e => (e as InputElement).id === id);
    if (myElement) {
      (myElement as InputElement).value = $event.value;
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

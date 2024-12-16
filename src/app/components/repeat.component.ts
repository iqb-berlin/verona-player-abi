import {
  Component, OnDestroy, OnInit, input } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { ElementComponent } from './element.component';
import { RepeatBlock } from '../classes';
import {VeronaResponseStatus} from "../verona/verona.interfaces";

@Component({
  selector: 'player-repeat',
  standalone: false,
  template: `
    <div class="fx-row-space-between-center" IsInViewDetection (intersecting)="comingIntoView()">
      @if (elementData().numberOfSubFormsPrompt) {
        <div [style.flex]="'50'" [matTooltip]="elementData().helpText">
          {{elementData().numberOfSubFormsPrompt}}
        </div>
      }
      @if (elementData().numberOfSubFormsPrompt) {
        <div [style.flex]="'50'"
          class="fx-row-center-center">
          <mat-form-field [style.flex]="'30'">
            <input matInput type="number" [formControl]="numberInputControl" autocomplete="off"/>
            @if (numberInputControl.errors) {
              <mat-error>
                {{numberInputControl.errors | errorTransform}}
              </mat-error>
            }
          </mat-form-field>
          <button type="button" mat-raised-button matTooltip="Neue Anzahl anwenden"
            [disabled]="numberInputControl.invalid || elementData().numberOfSubForms === numberInputControl.value || !numberInputControl.value"
            (click)="applyRepeatNumber()">
            Anwenden
          </button>
        </div>
      }
    </div>
    @if (elementData().elements.length > 0) {
      <mat-accordion class="fx-column-start-stretch"
        multi="false">
        @for (elementList of elementData().elementsAsSimpleBlocks; track elementList; let i = $index) {
          <mat-expansion-panel
            (afterExpand)="scrollRepeatContent(elementData().id + '_title_' + i)">
            <mat-expansion-panel-header class="fx-row-space-between-center">
              <mat-panel-title [id]="elementData().id + '_title_' + i">
                {{ elementData().headerText }} {{i + 1}}
              </mat-panel-title>
            </mat-expansion-panel-header>
            <ng-template matExpansionPanelContent>
              @for (e of elementList.elements; track e) {
                <div>
                  <player-sub-form [elementData]="e" [parentForm]="parentForm()"
                    (valueChange)="valueChange.emit()">
                  </player-sub-form>
                </div>
              }
            </ng-template>
          </mat-expansion-panel>
        }
      </mat-accordion>
    }
  `,
  styles: ['mat-panel-title {font-size: larger}', 'button {margin: 10px}']
})

export class RepeatComponent extends ElementComponent implements OnInit, OnDestroy {
  elementData = input<RepeatBlock>();
  numberInputControl = new FormControl();

  ngOnInit(): void {
    if (this.elementData() instanceof RepeatBlock) {
      const myValidators = [];
      myValidators.push(Validators.min(1));
      if (this.elementData().maxNumberOfSubForms) myValidators.push(Validators.max(this.elementData().maxNumberOfSubForms));
      this.numberInputControl.setValidators(myValidators);
      if (this.elementData().numberOfSubForms) this.numberInputControl.setValue(this.elementData().numberOfSubForms);
      this.parentForm().addControl(this.elementData().id, this.numberInputControl);
    }
  }

  applyRepeatNumber(): void {
    const valueNumberTry = Number(this.numberInputControl.value);
    if (!Number.isNaN(valueNumberTry)) {
      this.elementData().numberOfSubForms = valueNumberTry;
      this.elementData().status = VeronaResponseStatus.VALUE_CHANGED;
      this.valueChange.emit();
    }
  }

  // eslint-disable-next-line class-methods-use-this
  scrollRepeatContent(targetElementId: string): void {
    const elementToScroll = document.getElementById(targetElementId);
    elementToScroll.scrollIntoView({ block: 'center', behavior: 'smooth' });
  }

  ngOnDestroy(): void {
    this.parentForm().removeControl((this.elementData() as RepeatBlock).id);
  }

  comingIntoView() {
    if (this.elementData().status === VeronaResponseStatus.NOT_REACHED) {
      this.elementData().status = VeronaResponseStatus.DISPLAYED;
      this.valueChange.emit();
    }
  }
}

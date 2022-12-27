import {
  Component, Input, OnDestroy, OnInit
} from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { ElementComponent } from './element.component';
import { RepeatBlock } from '../classes';

@Component({
  selector: 'player-repeat',
  template: `
    <div class="fx-row-space-between-center">
      <div [style.flex]="'50'" *ngIf="elementData.numberOfSubFormsPrompt" [matTooltip]="elementData.headerText">
        {{elementData.numberOfSubFormsPrompt}}
      </div>
      <div [style.flex]="'50'" *ngIf="elementData.numberOfSubFormsPrompt"
           class="fx-row-center-center">
        <mat-form-field [style.flex]="'30'">
          <input matInput type="number" [formControl]="numberInputControl" autocomplete="off"/>
          <mat-error *ngIf="numberInputControl.errors">
            {{numberInputControl.errors | errorTransform}}
          </mat-error>
        </mat-form-field>
        <button type="button" mat-raised-button matTooltip="Neue Anzahl anwenden"
                [disabled]="numberInputControl.invalid || elementData.numberOfSubForms === numberInputControl.value"
                (click)="applyRepeatNumber()">
          Anwenden
        </button>
      </div>
    </div>
    <mat-accordion class="fx-column-start-stretch"
                   multi="false" *ngIf="elementData.elements.length > 0">
      <mat-expansion-panel *ngFor="let elementList of elementData.elementsAsSimpleBlocks; let i = index;"
                           (afterExpand)="scrollRepeatContent(elementData.id + '_title_' + i)">
        <mat-expansion-panel-header class="fx-row-space-between-center">
          <mat-panel-title [id]="elementData.id + '_title_' + i">
            {{ elementData.headerText }} {{i + 1}}
          </mat-panel-title>
        </mat-expansion-panel-header>
        <ng-template matExpansionPanelContent>
          <div *ngFor="let e of elementList.elements">
            <player-sub-form [elementData]="e" [parentForm]="parentForm"
                             (elementDataChange)="elementDataChange.emit($event)">
            </player-sub-form>
          </div>
        </ng-template>
      </mat-expansion-panel>
    </mat-accordion>
  `,
  styles: ['mat-panel-title {font-size: larger}', 'button {margin: 10px}']
})

export class RepeatComponent extends ElementComponent implements OnInit, OnDestroy {
  @Input() elementData: RepeatBlock;
  numberInputControl = new FormControl();

  ngOnInit(): void {
    if (this.elementData instanceof RepeatBlock) {
      const myValidators = [];
      myValidators.push(Validators.min(1));
      if (this.elementData.maxNumberOfSubForms) myValidators.push(Validators.max(this.elementData.maxNumberOfSubForms));
      this.numberInputControl.setValidators(myValidators);
      if (this.elementData.numberOfSubForms) this.numberInputControl.setValue(this.elementData.numberOfSubForms);
      this.parentForm.addControl(this.elementData.id, this.numberInputControl);
    }
  }

  applyRepeatNumber(): void {
    const valueNumberTry = Number(this.numberInputControl.value);
    if (!Number.isNaN(valueNumberTry)) {
      this.elementData.numberOfSubForms = valueNumberTry;
      this.valueChange.emit();
    }
  }

  // eslint-disable-next-line class-methods-use-this
  scrollRepeatContent(targetElementId: string): void {
    const elementToScroll = document.getElementById(targetElementId);
    elementToScroll.scrollIntoView({ block: 'center', behavior: 'smooth' });
  }

  ngOnDestroy(): void {
    this.parentForm.removeControl((this.elementData as RepeatBlock).id);
  }
}

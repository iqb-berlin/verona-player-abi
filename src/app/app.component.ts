import {
  Component, ElementRef, OnDestroy, OnInit, ViewChild, ViewEncapsulation
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { debounceTime, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ParserService } from './parser.service';
import { VeronaService } from './verona/verona.service';
import {
  ProgressValue, UnitNavigationTarget, VeronaResponseStatus
} from './verona/verona.interfaces';
import { SimpleBlock } from './classes';

@Component({
  selector: 'app-root',
  template: `
    <player-toolbar *ngIf="isStandalone" [parentForm]="form"></player-toolbar>
    <form #playerContent [formGroup]="form">
      <div *ngFor="let element of rootBlock.elements" [style.margin]="'0px 30px'">
        <player-sub-form [elementData]="element" [parentForm]="form"
                         (valueChange)="valueChangesHappening.next($event)"
                         (navigationRequested)="navigationRequested($event);">
        </player-sub-form>
      </div>
    </form>
  `,
  encapsulation: ViewEncapsulation.None
})

export class AppComponent implements OnInit, OnDestroy {
  @ViewChild('playerContent', { static: false }) playerContent: ElementRef;

  rootBlock = new SimpleBlock('');
  form = new FormGroup({});
  private ngUnsubscribe = new Subject<void>();
  isStandalone: boolean = window === window.parent;
  valueChangesHappening = new Subject();
  lastPresentationProgress: ProgressValue = ProgressValue.UNSET;
  lastResponseProgress: ProgressValue = ProgressValue.UNSET;

  constructor(private veronaService: VeronaService) {
    this.veronaService.navigationDenied
      .pipe(takeUntil(this.ngUnsubscribe))
      // to evaluate reason, subscribe with param
      .subscribe(() => this.form.markAllAsTouched());
    this.veronaService.startCommand
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(startCommandData => {
        const tmpRootBlock = ParserService.parseUnitDefinition(startCommandData.unitDefinition.split(/\r?\n/g));
        if (startCommandData.unitState) {
          startCommandData.unitState.forEach(chunk => {
            tmpRootBlock.check(chunk.variables);
          });
        }
        this.rootBlock = tmpRootBlock;
      });
    this.valueChangesHappening
      .pipe(
        takeUntil(this.ngUnsubscribe),
        debounceTime(200)
      )
      .subscribe(() => {
        this.formValueChanged();
      });
  }

  formValueChanged(): void {
    const allValues = this.rootBlock.getValues();
    this.rootBlock.check(allValues);
    let newResponseProgress = this.form.valid ? ProgressValue.COMPLETE : ProgressValue.NONE;
    if (newResponseProgress !== this.lastResponseProgress) {
      this.lastResponseProgress = newResponseProgress;
    } else {
      newResponseProgress = undefined;
    }
    const firstNotPresentedVariable = allValues.find(v => v.status === VeronaResponseStatus.NOT_REACHED);
    let newPresentationProgress = (allValues.length > 0 && firstNotPresentedVariable) ?
      ProgressValue.SOME : ProgressValue.COMPLETE;
    if (newPresentationProgress !== this.lastPresentationProgress) {
      this.lastPresentationProgress = newPresentationProgress;
    } else {
      newPresentationProgress = undefined;
    }
    this.veronaService.sendNewUnitState([{
      id: 'allData',
      variables: allValues
    }], newResponseProgress, newPresentationProgress);
  }

  // eslint-disable-next-line class-methods-use-this
  ngOnInit() {
    setTimeout(() => VeronaService.sendReadyNotification());
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  navigationRequested($event: string) {
    this.veronaService.requestUnitNavigation($event as UnitNavigationTarget);
  }
}

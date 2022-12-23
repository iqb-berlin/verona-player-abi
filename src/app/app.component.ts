import {
  Component, ElementRef, EventEmitter, OnDestroy, OnInit, Output, ViewChild, ViewEncapsulation
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ParserService } from './parser.service';
import { RepeatBlock, UIBlock } from './classes/UIBlock';
import { InputElement } from './classes/UIElement';
import { VeronaService } from './verona/verona.service';
import {ProgressValue, UnitNavigationTarget} from './verona/verona.interfaces';

@Component({
  template: `
    <form #playerContent [formGroup]="form">
      <div *ngFor="let element of rootBlock.elements" [style.margin]="'0px 30px'">
        <player-sub-form [elementData]="element" [parentForm]="form"
                         (elementDataChange)="formValueChanged($event)"
                         (navigationRequested)="navigationRequested($event);">
        </player-sub-form>
      </div>
    </form>
  `,
  encapsulation: ViewEncapsulation.None
})

export class AppComponent implements OnInit, OnDestroy {
  @ViewChild('playerContent', { static: false }) playerContent: ElementRef;

  rootBlock = new UIBlock();
  allValues: Record<string, string> = {};
  form = new FormGroup({});
  private ngUnsubscribe = new Subject<void>();

  constructor(public parserService: ParserService,
              private veronaService: VeronaService) {
    this.veronaService.navigationDenied
      .pipe(takeUntil(this.ngUnsubscribe))
      // to evaluate reason, subscribe with param
      .subscribe(() => this.form.markAllAsTouched());
    this.veronaService.scrollY
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((scrolledY: number) => {
        const presentationProgress = this.getPresentationProgress(scrolledY);
        // todo: send presentationProgress
      });
    this.veronaService.startCommand
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(startCommandData => {
        this.rootBlock = this.parserService.parseUnitDefinition(startCommandData.unitDefinition.split(/\r?\n/g));
        this.allValues = {};
        if (startCommandData.unitState) {
          startCommandData.unitState.forEach(chunk => {
            this.rootBlock.check(chunk.variables);
          });
        }
        setTimeout(() => {
          // todo: send presentationProgress on start?
          // todo: derive from responses?
          const presentationProgress = this.getPresentationProgress(window.scrollY);
        });
      });
  }

  private getPresentationProgress(scrolledY: number): ProgressValue {
    const contentYPosition = window.innerHeight + scrolledY;
    const contentHeight = this.playerContent.nativeElement.offsetHeight + this.playerContent.nativeElement.offsetTop;
    if (contentHeight - contentYPosition <= 0) return 'complete';
    return 'some';
  }

  formValueChanged(event: InputElement | RepeatBlock): void {
    this.rootBlock.check({ ...this.allValues, [event.id]: event.value });
    this.allValues = this.rootBlock.getValues();
    // console.log('player: unit responses sent', this.allValues);
    // todo: send vopUnitStateChanged --> this.valueChanged.emit(JSON.stringify(this.allValues));
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

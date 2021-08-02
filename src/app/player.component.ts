import {
  Component, ElementRef, EventEmitter, Input, OnDestroy, Output, ViewChild, ViewEncapsulation
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { StartData } from './classes/interfaces';
import { ParserService } from './parser.service';
import { RepeatBlock, UIBlock } from './classes/UIBlock';
import { InputElement } from './classes/UIElement';
import { EventService } from './event.service';

@Component({
  template: `
    <form #playerContent [formGroup]="form">
      <div *ngFor="let element of rootBlock.elements" [style.margin]="'0px 30px'">
        <player-sub-form [elementData]="element" [parentForm]="form"
                         (elementDataChange)="formValueChanged($event)"
                         (navigationRequested)="this.navigationRequested.emit($event);">
        </player-sub-form>
      </div>
    </form>
  `,
  encapsulation: ViewEncapsulation.None
})

export class PlayerComponent implements OnDestroy {
  @ViewChild('playerContent', { static: false }) playerContent: ElementRef;
  @Output() valueChanged = new EventEmitter<string>();
  @Output() navigationRequested = new EventEmitter<string>();
  @Output() presentationProgress = new EventEmitter<string>();
  // @Output() ready = new EventEmitter(); // TODO bitte prüfen ob nötig, dass der Player ready meldet

  rootBlock: UIBlock;
  allValues: Record<string, string>;
  form: FormGroup;
  private ngUnsubscribe = new Subject<void>();

  constructor(public parserService: ParserService,
              private eventService: EventService) {
    this.initFields();
    this.subscribeForEvents();
  }

  private initFields(): void {
    this.rootBlock = new UIBlock();
    this.allValues = {};
    this.form = new FormGroup({});
  }

  private subscribeForEvents(): void {
    this.eventService.navigationDenied
      .pipe(takeUntil(this.ngUnsubscribe))
      // to evaluate reason, subscribe with param
      .subscribe((): void => this.form.markAllAsTouched());
    this.eventService.scrollY
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((scrolledY: number): void => this.calculatePresentationComplete(scrolledY));
  }

  private calculatePresentationComplete(scrolledY: number): void {
    const contentYPosition = window.innerHeight + scrolledY;
    const contentHeight = this.playerContent.nativeElement.offsetHeight + this.playerContent.nativeElement.offsetTop;
    if (contentHeight - contentYPosition <= 0) {
      this.presentationProgress.emit('complete');
    }
  }

  @Input()
  set startData(startData: StartData) {
    this.initFields();
    if (startData.unitDefinition) {
      let storedResponses = {};
      if (startData.unitStateData) {
        storedResponses = JSON.parse(startData.unitStateData);
        console.log('player: got unit responses', storedResponses);
      }
      this.rootBlock = this.parserService.parseUnitDefinition(startData.unitDefinition.split(/\r?\n/g));
      this.rootBlock.check(storedResponses);
      // check if presentationProgress could be sent (e.g. small pages which hasn't to be scrolled)
      setTimeout((): void => this.calculatePresentationComplete(window.scrollY));
    } else {
      console.warn('player: (setStartData) no unitDefinition is given');
    }
  }

  formValueChanged(event: InputElement | RepeatBlock): void {
    this.rootBlock.check({ ...this.allValues, [event.id]: event.value });
    this.allValues = this.rootBlock.getValues();
    // console.log('player: unit responses sent', this.allValues);
    this.valueChanged.emit(JSON.stringify(this.allValues));
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}

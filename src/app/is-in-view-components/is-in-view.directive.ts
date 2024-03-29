import {
  Directive, ElementRef, EventEmitter, OnDestroy, OnInit, Output
} from '@angular/core';

@Directive({
  selector: '[IsInViewDetection]'
})
export class IsInViewDirective implements OnInit, OnDestroy {
  @Output() intersecting = new EventEmitter();
  private intersectionObserver!: IntersectionObserver;

  constructor(private elementRef: ElementRef) {}

  ngOnInit(): void {
    this.intersectionObserver = new IntersectionObserver(
      (entries: IntersectionObserverEntry[]): void => {
        entries.forEach(entry => {
          if (entry.isIntersecting) this.intersecting.emit();
        });
      }, {
        root: null,
        rootMargin: '0px',
        threshold: 0.8
      }
    );
    this.intersectionObserver.observe(this.elementRef.nativeElement);
  }

  ngOnDestroy(): void {
    this.intersectionObserver.unobserve(this.elementRef.nativeElement);
    this.intersectionObserver.disconnect();
  }
}

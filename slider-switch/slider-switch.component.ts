import { Component, OnInit, HostListener, Input, Output, EventEmitter, OnDestroy, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';
import { fromEvent, Subscription } from 'rxjs';

@Component({
  selector: 'app-slider-switch',
  templateUrl: './slider-switch.component.html',
  styleUrls: ['./slider-switch.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SliderSwitchComponent implements OnInit, OnDestroy {

  @Input() message;
  @Output() valueChange = new EventEmitter();
  private sub$ = new Subscription();
  private moveSessionActive = false;
  @Input() sliderWidth = 100;
  private transition = 0;
  public translateX = `translateX(${this.transition}px)`;
  private initialState = 0;
  public opacity = 1;
  public arrowOpacity = 1;
  public sliderChangeMultiplier = 0.6;

  constructor( private cdr: ChangeDetectorRef ) {}

  public ngOnInit() {
    // this.evaluateWidth();
    this.sub$.add(fromEvent(window, 'mouseup').subscribe(() => {
        this.reset();
    }));
    this.sub$.add(fromEvent(window, 'touchend').subscribe(() => {
      this.reset();
    }));
  }

  public ngOnDestroy() {
    this.sub$.unsubscribe();
  }

// mouseEvent handlers
  public onMouseDown(event: MouseEvent) {
    event.preventDefault();
    this.initialState = event.x;
    this.moveSessionActive = true;
  }

  @HostListener('mousemove', ['$event']) mouseMove(event: MouseEvent) {
    if (event.buttons === 1) {
      this.transition = event.x - this.initialState;
      this.moveLogic();
    }
  }

// touchEvent handlers
  public touchStart(event) {
    this.initialState = event.touches[0].clientX;
    this.moveSessionActive = true;
  }

  @HostListener('touchmove', ['$event']) TouchMove(event) {
    this.transition = event.touches[0].clientX - this.initialState;
    this.moveLogic();
  }

  private moveLogic() {
    this.opacity = (this.sliderWidth - this.transition * 3) / 100;
    this.arrowOpacity = (this.sliderWidth - this.transition * 1.2) / 100;
    this.translateX = `translateX(${this.transition}px)`;
    if (this.transition < 0 || this.transition > this.sliderWidth * this.sliderChangeMultiplier) {
      this.reset();
    }
    if (this.transition > this.sliderWidth * this.sliderChangeMultiplier && this.moveSessionActive) {
      this.valueChange.emit();
      // this.evaluateWidth();
      this.moveSessionActive = false;
    }
  }

  // private evaluateWidth() {
  //   this.sliderWidth = this.message.word.length * 8.4 + 100;
  //   this.cdr.detectChanges();
  // }

  private reset() {
    this.translateX = `translateX(0px)`;
    this.opacity = 1;
    this.arrowOpacity = 1;
    // this.evaluateWidth();
  }

}

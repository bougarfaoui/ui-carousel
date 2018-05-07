import {
    Component,
    OnInit,
    QueryList,
    ContentChildren,
    Input,
    Output,
    HostBinding,
    HostListener,
    EventEmitter,
    ElementRef,
    ViewChild,
    Renderer2,
    ViewContainerRef,
    ComponentFactoryResolver,
    ComponentRef
} from '@angular/core';
import { Subscription, Subject } from 'rxjs';
import { throttleTime, debounceTime, switchMap } from 'rxjs/operators';

import { UICarouselItemComponent } from '../ui-carousel-item/ui-carousel-item.component';
import { SwiperDirective } from '../directives/swiper.directive';
import { timer } from 'rxjs/observable/timer';

@Component({
    selector: 'ui-carousel',
    template: `
    <div (mouseenter)="(autoPlay)?autoPlayFunction(false):null" (mouseleave)="(autoPlay)?autoPlayFunction(true):null">
        <div #carouselTrack class="carousel-track" swiper [threshold]="tWidth">
            <ng-container #front></ng-container>
            <ng-content></ng-content>
            <ng-container #end></ng-container>
        </div>
        <dots *ngIf="isDotsVisible" [dots-count]="items.length" position="middle" [active-dot]="currentItemIndex" (on-click)="goTo($event)"></dots>
        <arrow *ngIf="isArrowsVisible" dir="left" (on-click)="prev()" [disabled]="false"></arrow>
        <arrow *ngIf="isArrowsVisible" dir="right" (on-click)="next()" [disabled]="false"></arrow>
    </div>
    `,
    styles: [`
        :host{
            display: block;
            overflow: hidden;
            position: relative;
        }
        .carousel-track:before, .carousel-track:after {
            display: table;
            content: '';
        }
        .carousel-track:after {
            clear: both;
        }
    `],
})
export class UICarouselComponent implements OnInit {
    private nextSubject: Subject<any> = new Subject<any>();
    private prevSubject: Subject<any> = new Subject<any>();
    private transitionSubject: Subject<any> = new Subject<any>();
    private subscriptions: Subscription = new Subscription();
    @Output() onChange: EventEmitter<any> = new EventEmitter<any>();
    @Input() speed: number = 400;
    @Input() autoPlay: boolean = true;
    @Input() autoPlaySpeed: number = 5000;
    @Input() thresholdFraction: number = 0.25;

    @Input() infinite: boolean = true;
    @Input('dots') isDotsVisible: boolean = true;
    @Input('arrows') isArrowsVisible: boolean = true;

    @ViewChild('front', { read: ViewContainerRef }) front: ViewContainerRef;
    @ViewChild('end', { read: ViewContainerRef }) end: ViewContainerRef;
    @ViewChild('carouselTrack') carouselTrackEl: ElementRef;
    @ViewChild(SwiperDirective) swiper: SwiperDirective;
    @ContentChildren(UICarouselItemComponent) items: QueryList<UICarouselItemComponent>;

    private _width: number;
    private currentItemIndex: number = 0;
    private offsetPosition: number = 0;
    private frontClone: ComponentRef<UICarouselItemComponent>;
    private backClone: ComponentRef<UICarouselItemComponent>;
    private interval: any;
    tWidth: number = 100;

    constructor(
        private el: ElementRef,
        private renderer: Renderer2,
        private resolver: ComponentFactoryResolver
    ) { }

    ngOnInit() {
        if (this.autoPlay) {
            this.autoPlayFunction(true);
        }
        this.subscriptions.add(this.nextSubject.pipe(throttleTime(this.speed)).subscribe(() => {
            this.slideLeft();
        }));
        this.subscriptions.add(this.prevSubject.pipe(throttleTime(this.speed)).subscribe(() => {
            this.slideRight();
        }));
        this.subscriptions.add(this.transitionSubject.pipe(switchMap(() => timer(this.speed))).subscribe(() => {
            this.disableTransition();
        }));
        this.subscriptions.add(this.onChange.subscribe((index: number) => {
            let item = this.getItemByIndex(index);
            item.lazyLoad();
        }));

        this.carouselTrackEl = this.carouselTrackEl.nativeElement;
        this._width = this.el.nativeElement.offsetWidth;
        this.tWidth = this._width * this.thresholdFraction;
    }

    ngAfterViewInit() {
        this.renderer.setStyle(this.carouselTrackEl, 'width', `${(this.items.length * 2) * this._width}px`);

        if (this.items && this.items.length > 0) {
            this.onChange.emit(0);
            if (this.items.length > 1 && this.infinite) {
                const factory = this.resolver.resolveComponentFactory(UICarouselItemComponent);
                this.frontClone = this.end.createComponent(factory);
                this.backClone = this.front.createComponent(factory);
                this.frontClone.instance.el.nativeElement.innerHTML = this.items.first.el.nativeElement.innerHTML;
                this.backClone.instance.el.nativeElement.innerHTML = this.items.last.el.nativeElement.innerHTML;
                this.renderer.setStyle(this.frontClone.instance.el.nativeElement, 'width', this._width + "px");
                this.renderer.setStyle(this.backClone.instance.el.nativeElement, 'width', this._width + "px");
                this.offsetPosition = -this._width;
                this.moveTo(0);
            }
            this.items.map(item => {
                this.renderer.setStyle(item.el.nativeElement, 'width', this._width + "px");
            })
        }

        let totalDistanceSwiped = 0;
        let shortDistanceSwiped = 0;
        this.subscriptions.add(this.swiper.onSwipeLeft.subscribe((distance: number) => {
            totalDistanceSwiped += distance;
            if ((this.currentItemIndex === 0 || (this.currentItemIndex == this.items.length - 1 && totalDistanceSwiped < 0)) && !this.infinite) {
                shortDistanceSwiped += distance / Math.pow(Math.abs(totalDistanceSwiped), .4);
                this.moveTo((this.currentItemIndex * -this._width) + shortDistanceSwiped);
            } else {
                this.moveTo((this.currentItemIndex * -this._width) + totalDistanceSwiped);
            }
        }));

        this.subscriptions.add(this.swiper.onSwipeRight.subscribe((distance: number) => {
            totalDistanceSwiped += distance;
            if ((this.currentItemIndex === this.items.length - 1 || (this.currentItemIndex === 0 && totalDistanceSwiped > 0)) && !this.infinite) {
                shortDistanceSwiped += distance / Math.pow(Math.abs(totalDistanceSwiped), .4);
                this.moveTo((this.currentItemIndex * -this._width) + shortDistanceSwiped);
            } else {
                this.moveTo((this.currentItemIndex * -this._width) + totalDistanceSwiped);
            }
        }));

        this.subscriptions.add(this.swiper.swipeLeft.subscribe(() => {
            totalDistanceSwiped = 0;
            shortDistanceSwiped = 0;
            this.slideLeft();
        }));

        this.subscriptions.add(this.swiper.swipeRight.subscribe(() => {
            totalDistanceSwiped = 0;
            shortDistanceSwiped = 0;
            this.slideRight();
        }));

        this.subscriptions.add(this.swiper.onSwipeEnd.subscribe(() => {
            totalDistanceSwiped = 0;
            shortDistanceSwiped = 0;
            this.slideToPrevPosition();
        }));

        this.subscriptions.add(this.swiper.onSwipeStart.subscribe(() => {
            totalDistanceSwiped = 0;
            shortDistanceSwiped = 0;
            // this.disableTransition();
        }));
    }

    next() {
        this.prevSubject.next();
    }

    prev() {
        this.nextSubject.next();
    }

    goTo(index: number) {
        this.slideTo(index);
    }

    slideTo(index: number) {
        this.enableTransition();

        this.onChange.emit((index + this.items.length) % this.items.length);
        this.moveTo(index * -this._width);
        this.currentItemIndex = (index + this.items.length) % this.items.length;
    }

    slideLeft() {
        this.enableTransition();

        if (!this.infinite) {
            if (this.currentItemIndex === 0) {
                this.slideToPrevPosition();
                return;
            }
        }
        this.currentItemIndex -= 1;
        if (this.currentItemIndex === -1) {
            this.moveTo(this.currentItemIndex * -this._width);
            this.currentItemIndex = this.items.length - 1;
            this.onChange.emit(this.currentItemIndex);
            timer(this.speed - 50).subscribe(() => {
                this.disableTransition();
                timer(50).subscribe(() => {
                    this.moveTo(this.currentItemIndex * -this._width);
                })
            })
        } else {
            this.onChange.emit(this.currentItemIndex);
            this.moveTo(this.currentItemIndex * -this._width);
        }
    }

    slideRight() {
        this.enableTransition();

        if (!this.infinite) {
            if (this.currentItemIndex === this.items.length - 1) {
                this.slideToPrevPosition();
                return;
            }
        }
        this.currentItemIndex += 1;
        if (this.currentItemIndex === this.items.length) {
            this.moveTo(this.currentItemIndex * -this._width);
            this.currentItemIndex = 0;
            this.onChange.emit(this.currentItemIndex);
            timer(this.speed - 50).subscribe(() => {
                this.disableTransition();
                timer(50).subscribe(() => {
                    this.moveTo(this.currentItemIndex * -this._width);
                })
            })
        } else {
            this.onChange.emit(this.currentItemIndex);
            this.moveTo(this.currentItemIndex * -this._width);
        }
    }

    moveTo(pos: number) {
        let position = pos + this.offsetPosition;
        this.renderer.setStyle(this.carouselTrackEl, 'transform', 'translate3d(' + position + 'px, 0px, 0px)');
        this.renderer.setStyle(this.carouselTrackEl, '-webkit-transform', 'translate3d(' + position + 'px, 0px, 0px)');
        this.renderer.setStyle(this.carouselTrackEl, '-moz-transform', 'translate3d(' + position + 'px, 0px, 0px)');
        this.renderer.setStyle(this.carouselTrackEl, '-o-transform', 'translate3d(' + position + 'px, 0px, 0px)');
        this.renderer.setStyle(this.carouselTrackEl, '-ms-transform', 'translate3d(' + position + 'px, 0px, 0px)');
    }

    slideToPrevPosition() {
        this.enableTransition();
        this.moveTo(this.currentItemIndex * -this._width);
    }

    disableTransition() {
        this.renderer.removeStyle(this.carouselTrackEl, "transition");
        this.renderer.removeStyle(this.carouselTrackEl, "-moz-transition");
        this.renderer.removeStyle(this.carouselTrackEl, "-webkit-transition");
        this.renderer.removeStyle(this.carouselTrackEl, "-o-transition");
        this.renderer.removeStyle(this.carouselTrackEl, "-ms-transition");
    }

    enableTransition() {
        this.transitionSubject.next();
        this.renderer.setStyle(this.carouselTrackEl, "transition", `transform ${this.speed}ms ease`);
        this.renderer.setStyle(this.carouselTrackEl, "-moz-transition", `transform ${this.speed}ms ease`);
        this.renderer.setStyle(this.carouselTrackEl, "-webkit-transition", `transform ${this.speed}ms ease`);
        this.renderer.setStyle(this.carouselTrackEl, "-o-transition", `transform ${this.speed}ms ease`);
        this.renderer.setStyle(this.carouselTrackEl, "-ms-transition", `transform ${this.speed}ms ease`);
    }

    getItemByIndex(index: number) {
        return this.items.find((item, i) => {
            return i === index;
        });
    }

    @HostListener('window:resize', ['$event'])
    onResize(event: any) {
        this.rePosition();
    }

    rePosition() {
        if (this.items && this.items.length > 0) {
            this._width = this.el.nativeElement.offsetWidth;
            this.tWidth = this._width * this.thresholdFraction;
            this.renderer.setStyle(this.carouselTrackEl, 'width', `${(this.items.length * 2) * this._width}px`);
            if (this.items.length > 1 && this.infinite) {
                this.offsetPosition = -this._width;
                this.renderer.setStyle(this.frontClone.instance.el.nativeElement, 'width', this._width + "px");
                this.renderer.setStyle(this.backClone.instance.el.nativeElement, 'width', this._width + "px");
            }
            this.items.map(item => {
                this.renderer.setStyle(item.el.nativeElement, 'width', this._width + "px");
            });
            this.disableTransition();
            this.moveTo(this.currentItemIndex * -this._width);
        }
    }

    ngOnDestroy() {
        this.subscriptions.unsubscribe();
    }

    autoPlayFunction(boolean: boolean) {
        if (this.autoPlay) {
            if (boolean) {
                this.interval = setInterval(() => {
                    this.next();
                }, this.autoPlaySpeed);
            } else {
                clearInterval(this.interval);
            }
        }
    }
}


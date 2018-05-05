import { ViewChild, ContentChildren, ViewContainerRef, QueryList, ElementRef, Component } from '@angular/core';

import { UILazyloadDirective } from '../directives/ui-lazy-load.directive';

@Component({
    selector: 'ui-carousel-item',
    template: `
        <div #carouselItem class="ui-carousel-item" tabindex="-1" style="outline: none;">
            <div #container></div>
            <ng-content></ng-content>
        </div>
   `,
    styles: [`
        .ui-carousel-item{
            user-select: none;
            -moz-user-select: none;
            -khtml-user-select: none;
            -webkit-user-select: none;
            -o-user-select: none;
            -ms-user-select: none;
        }
        
        .ui-carousel-item {
            background: lightgray;
            float: left;
            box-sizing: border-box;
        }
    `]
})
export class UICarouselItemComponent {
    @ViewChild("carouselItem") el: ElementRef;
    @ViewChild("container", { read: ViewContainerRef }) container: ViewContainerRef;
    @ContentChildren(UILazyloadDirective) lazyLoadedImages: QueryList<UILazyloadDirective>;

    constructor() { }

    ngOnInit() {
    }

    lazyLoad() {
        this.lazyLoadedImages
            .forEach((img) => {
                img.load();
            });
    }

}
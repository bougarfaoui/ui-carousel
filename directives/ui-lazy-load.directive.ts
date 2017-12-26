import { Directive, Input, ElementRef, Renderer2 } from '@angular/core';
import { UICarouselItemComponent } from "../ui-carousel-item/ui-carousel-item.component";
@Directive({ selector: '[ui-lazy-load]' })
export class UILazyloadDirective {
    @Input("ui-lazy-load") uiLazyLoad: string;
    constructor(
        private el: ElementRef,
        private renderer: Renderer2,
    ) { }

    load() {
        let img = this.el.nativeElement;
        if (img.src)
            return;
        img.src = this.uiLazyLoad;
        // this.renderer.listen(img, "load", (event) => { });
    }
}

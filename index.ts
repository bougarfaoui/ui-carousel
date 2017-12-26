import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UICarouselComponent } from './ui-carousel/ui-carousel.component';
import { UICarouselItemComponent } from './ui-carousel-item/ui-carousel-item.component';
import { SwiperDirective } from './directives/swiper.directive';
import { UILazyloadDirective } from './directives/ui-lazy-load.directive';
import { DotsComponent } from './dots/dots.component';
import { ArrowComponent } from './arrow/arrow.component';

@NgModule({
    imports: [
        CommonModule
    ],
    exports: [
        UICarouselComponent,
        UICarouselItemComponent,
        UILazyloadDirective
    ],
    declarations: [
        UICarouselComponent,
        UICarouselItemComponent,
        DotsComponent,
        ArrowComponent,
        SwiperDirective,
        UILazyloadDirective
    ],
    providers: [
    ],
})
export class UICarouselModule { }

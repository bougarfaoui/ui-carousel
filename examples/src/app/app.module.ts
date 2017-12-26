import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent,  } from './app.component';
import { InfiniteCarouselComponent } from "./infinite-carousel/infinite-carousel.component";
import { FadeCarouselComponent } from "./fade-carousel/fade-carousel.component";
import { FiniteCarouselComponent } from "./finite-carousel/finite-carousel.component";
import { CustomDotsComponent } from "./custom-dots/custom-dots.component";
import { CustomArrowsComponent } from "./custom-arrows/custom-arrows.component";
import { LazyLoadingComponent } from './lazyloading/lazyloading.component';
import { SelectModule } from 'ng-select'
import { UICarouselModule } from "ui-carousel";

@NgModule({
  declarations: [
    AppComponent,
    InfiniteCarouselComponent,
    FiniteCarouselComponent,
    FadeCarouselComponent,
    CustomDotsComponent,
    CustomArrowsComponent,
    LazyLoadingComponent
  ],
  imports: [
    BrowserModule,
    UICarouselModule,
    SelectModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

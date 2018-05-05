# 🌀ui-carousel 

✨  Carousel component for angular 4 and 5

## 💥 Features :
- 👌 Supports touch events
- ⚡️ Image lazy loading
- 😈 No third party library
- 😎 Easy to use API
## Install
``` npm install ui-carousel --save ```

## Demo :

## [Demo](https://bougarfaoui.github.io/ui-carousel/)

## Example :
```html
    <ui-carousel [infinite]="true" [speed]="200" >
        <ui-carousel-item *ngFor="let item of items">
            <img [ui-lazy-load]="item.img">
        </ui-carousel-item>
    </ui-carousel>
```
## API

### Inputs 

Inputs              | Type            | Description                                                  
------------------- | --------------- | -----------                                           
`infinite`          | `boolean`       | Infinite carousel (Defaults to true)               
`arrows`            | `boolean`       | Show/hide Arrows (Defaults to true)                                                            
`dots`              | `boolean`       | Show/hide Dots (Defaults to true)       
`speed`             | `number`        | Speed (in milliseconds) (Defaults to 400)             
`autoPlay`          | `boolean`       | Enable autoplay (Defaults to true) 
`autoPlaySpeed`     | `number`        | Autoplay interval (in milliseconds) (Defaults to 5000)
`thresholdFraction` | `number`        | Swipe distance to trigger slide change

### Directives : 

```[ui-lazy-load]``` : used to lazy load images in the carousel :
```html
  <ui-carousel-item>
     <img [ui-lazy-load]="src">
  </ui-carousel-item>
```

### Licence : 

MIT

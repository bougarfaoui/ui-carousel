# ui-carousel

Carousel component for angular 4 and 5

## 💥 Features :
- 👌 Support touch events
- ⚡️Image lazy loading
- 😎Easy to use API
## Install
``` npm install ui-carousel --save ```

## Demo :
***[Demo](http://socket.io/)***

## Example :

    <ui-carousel [infinite]="true" [fade]="false" [speed]="200" >
        <ui-carousel-item *ngFor="let item of items">
            <img [ui-lazy-load]="item.img">
        </ui-carousel-item>
    </ui-carousel>

## API

### Inputs 

Inputs           | Type            | Description                                                  
---------------- | --------------- | -----------                                           
`infinite`       | `boolean`       | Infinite carousel                     
`arrows`         | `boolean`       | Show/hide Arrows                                                            
`dots`           | `boolean`       | Show/hide Dots       
`speed`          | `number`        | Speed (in milliseconds)       
`fade`           | `bool`          | Enable fade mode                                                             
`height`         | `string`        | Height of the carousel (in px or %)             
`width`          | `string`        | Width of the carousel (in px or %)

### Directives : 

```[ui-lazy-load]``` : used to lazy load images in the carousel :
```
  <ui-carousel-item>
     <img [ui-lazy-load]="src">
  </ui-carousel-item>
```

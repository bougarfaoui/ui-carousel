import { Component, OnInit, Input, Output, EventEmitter, HostBinding } from '@angular/core';

@Component({
    selector: 'arrow',
    template: `
        <div class="arrow" (click)="onClick()" 
        [ngClass]="{ left : dir === 'left', right : dir === 'right', disabled  : disabled}"></div>
    `,
    styles: [`
        .arrow{
            position: absolute;
            height: 50px;
            width: 30px;
            opacity: .6;
            user-select: none;
            -moz-user-select: none;
            -khtml-user-select: none;
            -webkit-user-select: none;
            -o-user-select: none;
            z-index: 1000;
        }
        .arrow.right{
            right: 5px;
            top: 50%;
         
            transform: scaleX(-1) translateY(-50%);
            -moz-transform: scaleX(-1) translateY(-50%);
            -o-transform: scaleX(-1) translateY(-50%);
            -webkit-transform: scaleX(-1) translateY(-50%);
            -ms-transform: scaleX(-1) translateY(-50%);
            filter: FlipH;
            -ms-filter: "FlipH";
        }
        
        .arrow.left{
            left: 5px;
            top: 50%;
            transform: translateY(-50%);
            -moz-transform: translateY(-50%);
            -webkit-transform: translateY(-50%);
            -o-transform: translateY(-50%);
            -ms-transform: translateY(-50%);
        }
        .arrow:hover{
            opacity: .8;
            cursor: pointer;
        }
        
        .arrow:before{
            content: "";
            height: 3px;
            width: 30px;
            background: #fff;
            display: block;
            position: absolute;
            top: 14px;
            transform: rotate(-45deg);
            -moz-transform: rotate(-45deg);
            -webkit-transform: rotate(-45deg);
            -o-transform: rotate(-45deg);
            -ms-transform: rotate(-45deg);
        }
        .arrow:after{
            content: "";
            height: 3px;
            width: 30px;
            background: #fff;
            display: block;
            transform: rotate(45deg);
            -moz-transform: rotate(45deg);
            -webkit-transform: rotate(45deg);
            -o-transform: rotate(45deg);
            -ms-transform: rotate(45deg);
            position: absolute;
            bottom: 14px;
        }
        .arrow.disabled{
            opacity: .4;
        }
        .arrow.disabled:hover{
            opacity: .4;
            cursor: pointer;
        }
    `]
})

export class ArrowComponent {
    @Input() dir: string;

    @Input("disabled")
    disabled: boolean = true;

    @Output('on-click') click: EventEmitter<any> = new EventEmitter<any>();


    constructor() { }

    onClick() {
        if (!this.disabled)
            this.click.emit();
    }
}
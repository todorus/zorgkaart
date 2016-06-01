import {Component, Input, PipeTransform, Pipe} from 'angular2/core';
import {Pagination, PaginationItem} from "../model/Pagination";

@Component({
    selector: 'pagination',
    template: `
    <ul class="pagination">
        <li *ngFor="#item of items" (click)="select(item)" [class.selected]="item.selected">
            {{item.page}}
        </li>
    </ul>
  `,
    styles: [`
        p, input {
            margin: 0;
        }
        
        ul.pagination {
            display: flex;
            justify-content: center;
        }
        ul.pagination li {
            display: inline-block;
            cursor: pointer;
            
            width: auto;
            min-width: 38px;
            
            border: solid 1px #CED1D2;
            
            text-align: center;
        }
        ul.pagination li:hover {
            color: #FFF;
            border: 1px solid #35886F;
            background: #43AA8B;
        }
        ul.pagination li.selected, ul.pagination li.selected:hover {
            background: #2D755F;
            border: solid 1px #FFF;
            color: #FFF;
            
            cursor: default;
        }
    `]
})
export class PaginationComponent {

    @Input("pagination")
    items:PaginationItem[];

    ngOnInit(){
        this.items = [];
    }

    select(item:PaginationItem):void {
        console.log("paginationItem", item);
    }

}

@Pipe({name: 'pages'})
export class PagesPipe implements PipeTransform {

     private static MAX_RANGE = 5;

    transform(value:any, args:any[]):PaginationItem[] {

        if(!value){
            return [];
        }

        let halfRange = 0.5 * PagesPipe.MAX_RANGE;
        var bottom:Number;
        var top:Number;

        var pagenationItems:PaginationItem[] = [];
        var current = value.current + 1;

        if(current < halfRange) {
            bottom = 1;
            top = PagesPipe.MAX_RANGE;
        } else {
            bottom = current - halfRange;
            top = current + halfRange;
        }
        top = Math.min(value.total, top);

        for (var i:Number = bottom; i <= top; i++) {
            pagenationItems.push(new PaginationItem(i, i == current))
        }

        return pagenationItems;
    }

}
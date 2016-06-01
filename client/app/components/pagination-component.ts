import {Component, Input, PipeTransform, Pipe} from 'angular2/core';
import {Pagination, PaginationItem} from "../model/Pagination";

@Component({
    selector: 'pagination',
    template: `
    <h3>paging</h3>
    <ul class="pagination">
        <li *ngFor="#item of pagination.items" (click)="select(item)">
            page {{item.page}}
        </li>
    </ul>
  `,
    styles: [`
        p, input {
            margin: 0;
        }    
    `]
})
export class PaginationComponent {

    @Input("pagination")
    pagination:Pagination;

    ngOnInit(){
        this.pagination = new Pagination();
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
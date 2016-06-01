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

    transform(value:any, args:any[]):any {

        if(!value){
            return [];
        }

        console.log("PaginationPipe", value, args);

        var pagenationItems:PaginationItem[] = [];
        for(var i:Number = 1; i <= value.total ; i ++){
            pagenationItems.push(new PaginationItem(i, i == value.current))
        }

        console.log("PaginationPipe.paginationItems", pagenationItems);

        return pagenationItems;
    }

}
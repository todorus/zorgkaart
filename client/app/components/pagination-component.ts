import {Component, Input} from 'angular2/core';
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
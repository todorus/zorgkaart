/**
 * Created by todorus on 10/05/16.
 */
export class Pagination {

    current:Number;
    total:Number;

    items:PaginationItem[] = [];

    process():void {
        for (var i:Number = 0; i < this.total; i++) {
            this.items.push(new PaginationItem(i, i == this.current));
        }
    }
}
export class PaginationItem {

    page:Number;
    selected:Boolean;

    constructor(page:Number, selected:Boolean) {
        this.page = page;
        this.selected = selected;
    }
}
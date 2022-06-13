import { Rect } from "./Rect";

export class QuadTreeItem {
    x: number;
    y: number;
    data: any;

    constructor(x: number, y: number, data: any) {
        this.x = x;
        this.y = y;
        this.data = data;
    }

}

/*
* Private class.
* A spatial region of a QuadTree containing 0 or more `QuadTreeItem` instances and 0 or more other `QuadTreeBin` instances.
*/
class QuadTreeBin {

    rect: Rect;
    bins: QuadTreeBin[] | any;
    maxDepth: number;
    maxItemsPerBin: number;
    items: QuadTreeItem[] | any;
    depth: number;


    constructor(maxDepth: number, maxItemsPerBin: number, extent: Rect, depth = 0) {
        this.rect = extent.copy();
        this.bins = null;
        this.maxDepth = maxDepth;
        this.maxItemsPerBin = maxItemsPerBin;
        this.items = [];
        this.depth = depth;
    }

    
    checkWithinExtent(x: number, y: number, range = 0) {
    return x >= this.rect.x - range && x < this.rect.x + this.rect.width + range &&
            y >= this.rect.y - range && y < this.rect.y + this.rect.height + range;
    }

    /*
    * Adds an item to the `QuadTreeBin`.
    * @param item An instance of `QuadTreeItem`.
    */
    addItem(item: QuadTreeItem) {
        if (this.bins === null) {
            this.items.push(item);
            if (this.depth < this.maxDepth && this.items !== null && this.items.length > this.maxItemsPerBin)
                this.subDivide();
        } else {
            const binIndex = this._getBinIndex(item.x, item.y);
            if (binIndex != -1)
                this.bins[binIndex].addItem(item);
        }
    }

    /*
    * Returns a list of items from the bin within the specified radius of the coordinates provided.
    */
    getItemsInRadius(x: number, y: number, radius: number, maxItems: number) {
        const radiusSqrd = radius ** 2;
        let items = [];

        if (this.bins) {
            for (let b of this.bins)
                if (b.checkWithinExtent(x, y, radius))
                    items.push(...b.getItemsInRadius(x, y, radius, maxItems));
        } else {
            for (let item of this.items) {
                const distSqrd = (item.x - x) ** 2 + (item.y - y) ** 2;
                if (distSqrd <= radiusSqrd)
                    items.push({ distSqrd: distSqrd, data: item.data });
            }
        }

        return items;
    }

    /*
    * Split a `QuadTreeBin` into 4 smaller `QuadTreeBin`s.
    * Removes all `QuadTreeItem`s from the bin and adds them to the appropriate child bins.
    */
    subDivide() {
        if (this.bins !== null) return;
        
        this.bins = [];
        let w = this.rect.width * 0.5, h = this.rect.height * 0.5;
        for (let i = 0; i < 4; ++i)
            this.bins.push(new QuadTreeBin(this.maxDepth, this.maxItemsPerBin, new Rect(this.rect.x + i % 2 * w, this.rect.y + Math.floor(i * 0.5) * h, w, h), this.depth + 1));

        for (let item of this.items) {
            const binIndex = this._getBinIndex(item.x, item.y);
            if (binIndex != -1)
                this.bins[binIndex].addItem(item);
        }

        this.items = null;
    }

    
    /*
    * Private.
    */
    _getBinIndex(x: number, y: number, range = 0) {
    if (!this.checkWithinExtent(x, y)) return -1;
    let w = this.rect.width * 0.5, h = this.rect.height * 0.5;
    let xx = Math.floor((x - this.rect.x) / w);
    let yy = Math.floor((y - this.rect.y) / h);
    return xx + yy * 2;
    }

}



/*
* A public class representing a QuadTree structure.
*/
export class QuadTree {

    
    maxDepth: number;
    maxItemsPerBin: number;
    extent: Rect
    rootBin: QuadTreeBin | any;

    constructor(maxDepth: number, maxItemsPerBin: number, extent: Rect) {
        this.extent = extent.copy();
        this.maxDepth = maxDepth;
        this.maxItemsPerBin = maxItemsPerBin;
        this.clear();
    }

    /*
    * Remove all `QuadTreeItem`s and `QuadTreeBin`s from the QuadTree leaving it completely empty.
    */
    clear() {
        this.rootBin = new QuadTreeBin(this.maxDepth, this.maxItemsPerBin, new Rect(0, 0, this.extent.width, this.extent.height));
    }

    /*
    * Add an item at a specified position in the `QuadTree`.
    * @param x The x coordinate of the item.
    * @param y The y coordinate of the item.
    * @param item The user-defined data structure to store in the `QuadTree`.
    */
    addItem(x: number, y: number, item: any) {
        this.rootBin.addItem(new QuadTreeItem(x, y, item));
    }

    /*
    * Returns a list of items within the specified radius of the specified coordinates.
    */
    getItemsInRadius(x: number, y: number, radius: number, maxItems: number | any = null) {
        if (maxItems === null) {
            return this.rootBin.getItemsInRadius(x, y, radius);
        } else {
            return this.rootBin.getItemsInRadius(x, y, radius)
            .sort((a: any, b: any) => a.distSqrd - b.distSqrd)
            .slice(0, maxItems)
            .map((v:any) => v.data);
        }
    }
}
import {ItemPrices} from "./ItemPrices.ts";

export interface IItemDescription {
    id: number;
    name: string;
    pageUrl: string;
    threshold: number;
    quantity: number;
    tags: string[];
}

export class ItemDescription {
    id: number;
    name: string;
    pageUrl: string;
    threshold: number;
    quantity: number;
    tags: string[];
    prices: ItemPrices;

    constructor(description?: IItemDescription) {
        this.id = description?.id ?? 0;
        this.name = description?.name ?? '';
        this.pageUrl = description?.pageUrl ?? '';
        this.threshold = description?.threshold ?? 0;
        this.quantity = description?.quantity ?? 1;
        this.tags = description?.tags ?? [];
        this.prices = new ItemPrices();
    }

    toInterface(): IItemDescription {
        return {
            id: this.id,
            name: this.name,
            pageUrl: this.pageUrl,
            threshold: this.threshold,
            quantity: this.quantity,
            tags: this.tags,
        };
    }

    addPricesHistoryEntry(price: number): void {
        this.prices.addHistoryEntry(price);
    }
}

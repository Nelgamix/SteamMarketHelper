export interface IItemPrices {
    id: number;
    history: IItemPricesHistoryEntry[];
}

export interface IItemPricesHistoryEntry {
    price: number;
    date: number;
}

export class ItemPrices {
    history: IItemPricesHistoryEntry[];

    constructor(itemPrices?: IItemPrices) {
        this.history = itemPrices?.history ?? [];
    }

    toInterface(id: number): IItemPrices {
        return {
            id,
            history: this.history,
        };
    }

    addHistoryEntry(price: number): void {
        this.history.push({
            price,
            date: Date.now(),
        });
    }

    getLastEntry(n: number = 0): IItemPricesHistoryEntry | undefined {
        return this.history.length > n ? this.history[this.history.length - 1 - n] : undefined;
    }
}

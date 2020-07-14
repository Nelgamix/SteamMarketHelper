import {IItemDescription, ItemDescription} from "./ItemDescription.ts";
import {IItemPrices, ItemPrices} from "./ItemPrices.ts";

export class Items {
    private descriptions: ItemDescription[] = [];

    constructor(itemDescriptions: IItemDescription[], itemPrices?: IItemPrices[]) {
        for (const itemDescription of itemDescriptions) {
            let description: ItemDescription;
            try {
                description = this.addDescription(itemDescription);
            } catch (e) {
                console.warn('Could not add item', itemDescription, 'Reason', e);
                continue;
            }

            if (!itemPrices || !description.id) {
                continue;
            }

            const prices = itemPrices.find(item => item.id === description.id);
            if (prices) {
                description.prices = new ItemPrices(prices);
            }
        }
    }

    addDescription(itemDescription: IItemDescription): ItemDescription {
        if (!itemDescription.name) {
            throw new Error('No name defined');
        }

        if (this.descriptions.find(value => value.name === itemDescription.name)) {
            throw new Error('Name is already found');
        }

        if (itemDescription.id && this.descriptions.find(value => value.id && value.id === itemDescription.id)) {
            throw new Error('ID is already found');
        }

        const item = new ItemDescription(itemDescription);
        this.descriptions.push(item);
        return item;
    }

    getDescriptions(): ItemDescription[] {
        return this.descriptions;
    }

    getInterfaces(): { descriptions: IItemDescription[], prices: IItemPrices[] } {
        const descriptions = this.getDescriptions();
        return {
            descriptions: descriptions.map(d => d.toInterface()),
            prices: descriptions.map(d => d.prices.toInterface(d.id)),
        };
    }
}

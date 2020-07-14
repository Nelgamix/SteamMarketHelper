import {ItemDescription} from "../model/ItemDescription.ts";
import {logger, network, configuration} from "../utils.ts";

async function getPrice(item: ItemDescription): Promise<void> {
    const data = await network.fetchSteamMarketItemPage(item.id);
    const lowest_sell_order = parseInt(data.lowest_sell_order);
    // const price_suffix = data.price_suffix;

    item.addPricesHistoryEntry(lowest_sell_order);
    console.log('Price is', lowest_sell_order);

    if (!item.threshold) {
        item.threshold = lowest_sell_order;
        console.log('Threshold set', item.threshold + 1);
    }

    if (!item.quantity) {
        item.quantity = 1;
        console.log('Quantity set', item.quantity);
    }
}

export async function getPrices(items: ItemDescription[]): Promise<number> {
    logger.logTitle('Get prices');

    const itemsToProcess = [];
    for (const item of items) {
        if (item.id && configuration.haveToProcess(item)) {
            itemsToProcess.push(item);
        }
    }

    console.log(itemsToProcess.length, 'items to process,', items.length - itemsToProcess.length, 'will be skipped');
    let i = 0;
    for (const item of itemsToProcess) {
        logger.logProgress(++i, itemsToProcess.length, item.name);
        await getPrice(item);
    }

    return itemsToProcess.length;
}

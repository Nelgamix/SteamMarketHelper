import {ItemDescription} from "../model/ItemDescription.ts";
import {configuration, logger, network} from "../utils.ts";

const pageUrlRegex = /<a class="market_listing_row_link" href="(.*)" id="resultlink_0">/;

async function addPageUrl(item: ItemDescription): Promise<void> {
    const pageSource = await network.fetchSteamMarketSearch(item.name);
    const regExpExecArray = pageSource.match(pageUrlRegex);

    if (regExpExecArray && regExpExecArray.length >= 1) {
        const pageUrl = regExpExecArray[1];
        item.pageUrl = pageUrl;
        console.log('Page URL set', pageUrl);
    } else {
        console.warn('Page URL not found');
    }
}

export async function addPageUrls(items: ItemDescription[]): Promise<number> {
    logger.logTitle('Add page URLS');

    const itemsToProcess = [];
    for (const item of items) {
        if (!item.pageUrl && item.name && configuration.haveToProcess(item)) {
            itemsToProcess.push(item);
        }
    }

    console.log(itemsToProcess.length, 'items to process,', items.length - itemsToProcess.length, 'are already compliant');
    let i = 0;
    for (const item of itemsToProcess) {
        logger.logProgress(++i, itemsToProcess.length, item.name);
        await addPageUrl(item);
    }

    return itemsToProcess.length;
}

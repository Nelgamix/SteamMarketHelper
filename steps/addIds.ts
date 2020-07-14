import {ItemDescription} from "../model/ItemDescription.ts";
import {configuration, logger, network} from "../utils.ts";

const idRegex = /Market_LoadOrderSpread\( ([0-9]+) \);/;

async function addId(item: ItemDescription): Promise<void> {
    const pageSource = await network.fetchText(item.pageUrl);
    const regExpExecArray = pageSource.match(idRegex);

    if (regExpExecArray && regExpExecArray.length >= 1) {
        const id = regExpExecArray[1];
        item.id = parseInt(id, 10);
        console.log('ID set', item.id);
    }
}

export async function addIds(items: ItemDescription[]): Promise<number> {
    logger.logTitle('Add ids');

    const itemsToProcess = [];
    for (const item of items) {
        if (!item.id && item.pageUrl && configuration.haveToProcess(item)) {
            itemsToProcess.push(item);
        }
    }

    console.log(itemsToProcess.length, 'items to process,', items.length - itemsToProcess.length, 'are already compliant');
    let i = 0;
    for (const item of itemsToProcess) {
        logger.logProgress(++i, itemsToProcess.length, item.name);
        await addId(item);
    }

    return itemsToProcess.length;
}

import {parse} from "https://deno.land/std/flags/mod.ts";
import {disk, configuration} from "./utils.ts";
import {IItemDescription} from "./model/ItemDescription.ts";
import {IItemPrices} from "./model/ItemPrices.ts";
import {Items} from "./model/Items.ts";
import {addPageUrls} from "./steps/addPageUrls.ts";
import {addIds} from "./steps/addIds.ts";
import {getPrices} from "./steps/getPrices.ts";
import {recap} from "./steps/recap.ts";

async function save(items: Items): Promise<void> {
    const interfaces = items.getInterfaces();
    await disk.writeItemsFile(interfaces.descriptions);
    await disk.writePricesFile(interfaces.prices);
    console.log('Saved json files');
}

async function stepAddPageUrls(items: Items): Promise<void> {
    const numberProcessed = await addPageUrls(items.getDescriptions());
    if (numberProcessed > 0) {
        await save(items);
    }
}

async function stepAddIds(items: Items): Promise<void> {
    const numberProcessed = await addIds(items.getDescriptions());
    if (numberProcessed > 0) {
        await save(items);
    }
}

async function stepGetPrices(items: Items): Promise<void> {
    const numberProcessed = await getPrices(items.getDescriptions());
    if (numberProcessed > 0) {
        await save(items);
    }
}

function stepRecap(items: Items): void {
    recap(items.getDescriptions());
}

try {
    const iConfiguration = await disk.readConfigurationFile();
    configuration.fromInterface(iConfiguration);
} catch (e) {
    console.warn('Config file does not exist');
    await disk.writeConfigurationFile(configuration);
}

// Command line arguments
const args = parse(Deno.args);
console.log('Arguments', args);

const marketItems: IItemDescription[] = await disk.readItemsFile();
let itemPrices: IItemPrices[];
try {
    itemPrices = await disk.readPricesFile();
} catch (e) {
    console.warn('Prices file does not exist');
    itemPrices = [];
}

const items = new Items(marketItems, itemPrices);
console.log('Number of items', marketItems.length);
if (args.filter?.tags) {
    configuration.filters.tags = args.filter.tags.split(',');
}

if (configuration.steps.addPageUrls) {
    await stepAddPageUrls(items);
}

if (configuration.steps.addIds) {
    await stepAddIds(items)
}

if (configuration.steps.getPrices) {
    await stepGetPrices(items);
}

if (configuration.steps.recap) {
    stepRecap(items);
}

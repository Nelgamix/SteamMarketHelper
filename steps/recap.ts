import {ItemDescription} from "../model/ItemDescription.ts";
import {configuration, logger} from "../utils.ts";

const columnNameLen = 50;
const columnQuantityLen = 12;
const columnAmountLen = 12;

const formatName = (name: string): string => (name.length > columnNameLen ? name.substr(0, columnNameLen - 3) + '...' : name).padEnd(columnNameLen, ' ');
const formatQuantity = (quantity: number): string => String(quantity).padStart(columnQuantityLen, ' ');
const formatAmount = (amount?: number): string => (amount ? String((amount / 100).toFixed(2)) : '-').padStart(columnAmountLen, ' ');
const formatPercentage = (percentage?: number): string => (percentage ? (percentage > 0 ? '+' : '-') + String(Math.round(Math.abs(percentage) * 100)) + '%' : '-').padStart(columnAmountLen, ' ');
const formatPercentageColored = (percentage?: number): string => (!percentage ? '' : percentage < 0 ? '\x1b[31m' : '\x1b[32m') + formatPercentage(percentage) + '\x1b[0m';

function printHeader(): void {
    console.log(
        '\x1b[34m' +
        formatName('Name'),
        'Quantity'.padStart(columnQuantityLen, ' '),
        'Price N-1'.padStart(columnAmountLen, ' '),
        'Price N'.padStart(columnAmountLen, ' '),
        'Evolution'.padStart(columnAmountLen, ' '),
        'Threshold'.padStart(columnAmountLen, ' '),
        'Difference'.padStart(columnAmountLen, ' '),
        '\x1b[0m'
    );
}

function printBody(items: ItemDescription[]): void {
    for (const item of items) {
        const entryN = item.prices.getLastEntry();
        const entryN1 = item.prices.getLastEntry(1);
        if (!entryN) {
            continue;
        }

        console.log(
            formatName(item.name),
            formatQuantity(item.quantity),
            formatAmount(entryN1?.price),
            formatAmount(entryN.price),
            formatPercentageColored(entryN && entryN1 && entryN1.price ? entryN.price / entryN1.price - 1 : 0),
            formatAmount(item.threshold),
            formatAmount(item.threshold - entryN.price)
        );
    }
}

function printFooter(items: ItemDescription[]): void {
    const sumPricesN = items.reduce((previousValue, currentValue) => previousValue + (currentValue.prices.getLastEntry()?.price ?? 0) * currentValue.quantity, 0);
    const sumPricesN1 = items.reduce((previousValue, currentValue) => previousValue + (currentValue.prices.getLastEntry(1)?.price ?? 0) * currentValue.quantity, 0);
    console.log(
        '\x1b[1m' +
        formatName('Total'),
        formatQuantity(items.reduce((previousValue, currentValue) => previousValue + currentValue.quantity, 0)),
        formatAmount(sumPricesN1),
        formatAmount(sumPricesN),
        formatPercentage(sumPricesN1 ? sumPricesN / sumPricesN1 - 1 : 0),
        formatAmount(items.reduce((previousValue, currentValue) => previousValue + currentValue.threshold * currentValue.quantity, 0)),
        formatAmount(items.reduce((previousValue, currentValue) => previousValue + (currentValue.threshold - (currentValue.prices.getLastEntry()?.price ?? 0)) * currentValue.quantity, 0)),
        '\x1b[0m'
    );
}

export function recap(items: ItemDescription[]): void {
    logger.logTitle('Recap');

    const itemsToProcess = [];
    for (const item of items) {
        if (configuration.haveToProcess(item)) {
            itemsToProcess.push(item);
        }
    }

    printHeader();
    printBody(itemsToProcess);
    printFooter(itemsToProcess);
}

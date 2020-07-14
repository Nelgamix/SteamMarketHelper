import {IItemDescription} from "./ItemDescription.ts";
import {IItemPrices} from "./ItemPrices.ts";
import {IConfiguration} from "./Configuration.ts";

export interface FilePaths {
    items: string;
    prices: string;
    configuration: string;
}

export class Disk {
    private readonly filePaths: FilePaths;

    constructor(filePaths?: FilePaths) {
        this.filePaths = filePaths ?? {items: 'items.json', prices: 'prices.json', configuration: 'config.json'};
    }

    async readTextFile(path: string): Promise<string> {
        return Deno.readTextFile(path);
    }

    async writeTextFile(path: string, data: string): Promise<void> {
        return Deno.writeTextFile(path, data);
    }

    readItemsFile(): Promise<IItemDescription[]> {
        return this.readTextFile(this.filePaths.items).then(JSON.parse);
    }

    readPricesFile(): Promise<IItemPrices[]> {
        return this.readTextFile(this.filePaths.prices).then(JSON.parse);
    }

    readConfigurationFile(): Promise<IConfiguration> {
        return this.readTextFile(this.filePaths.configuration).then(JSON.parse);
    }

    writeItemsFile(data: IItemDescription[]): Promise<void> {
        return this.writeTextFile(this.filePaths.items, JSON.stringify(data, null, 4));
    }

    writePricesFile(data: IItemPrices[]): Promise<void> {
        return this.writeTextFile(this.filePaths.prices, JSON.stringify(data, null, 4));
    }

    writeConfigurationFile(data: IConfiguration): Promise<void> {
        return this.writeTextFile(this.filePaths.configuration, JSON.stringify(data, null, 4));
    }
}

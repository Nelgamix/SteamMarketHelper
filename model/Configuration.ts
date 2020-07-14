import {FilePaths} from "./Disk.ts";
import {NetworkStrategy, SteamOptions} from "./Network.ts";
import {ItemDescription} from "./ItemDescription.ts";
import {configuration} from "../utils.ts";

export interface StepsEnabled {
    addPageUrls: boolean;
    addIds: boolean;
    getPrices: boolean;
    recap: boolean;
}

export interface Filters {
    tags: string[];
}

export interface IConfiguration {
    steps: StepsEnabled;
    filePaths: FilePaths;
    filters: Filters;
    networkStrategy: NetworkStrategy;
    steamOptions: SteamOptions;
}

export class Configuration implements IConfiguration {
    steps: StepsEnabled = {
        addPageUrls: true,
        addIds: true,
        getPrices: true,
        recap: true,
    };
    filePaths: FilePaths = {
        items: 'items.json',
        prices: 'prices.json',
        configuration: 'config.json',
    };
    filters: Filters = {
        tags: [],
    };
    networkStrategy: NetworkStrategy = {
        rateLimiter: {
            delay: 12500,
        },
        rateLimiterPerDomain: {},
        delays: {
            tooManyRequests: 30000,
            networkError: 15000,
        },
    };
    steamOptions: SteamOptions = {
        language: 'french',
        currency: 3,
    };

    fromInterface(conf: IConfiguration): void {
        Object.assign(this.steps, conf.steps);
        Object.assign(this.filePaths, conf.filePaths);
        Object.assign(this.filters, conf.filters);
        Object.assign(this.networkStrategy, conf.networkStrategy);
        Object.assign(this.steamOptions, conf.steamOptions);
    }

    haveToProcess(item: ItemDescription): boolean {
        if (configuration.filters.tags && configuration.filters.tags.length > 0) {
            // Must have the tag
            if (item.tags.length === 0 || !item.tags.some(value => configuration.filters.tags.indexOf(value) >= 0)) {
                return false;
            }
        }

        return true;
    }
}

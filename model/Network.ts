function delay(delay: number): Promise<void> {
    return delay && delay > 0 ? new Promise<void>(resolve => {
        console.log('Delaying', delay, 'ms');
        setTimeout(resolve, delay);
    }) : Promise.resolve();
}

function getUrlQuery(s: string): string {
    return encodeURIComponent(s);
}

function extractDomainFromUrl(url: string): string | null {
    const matchResult = url.match(/https?:\/\/(?:www)?(.*?)\/(?:.*)?/);
    return matchResult && matchResult.length > 0 ? matchResult[1] : null;
}

interface RateLimiter {
    delay: number;
    hard?: number; // Soft by default
    lastRequest?: number;
}

export interface NetworkStrategy {
    rateLimiter?: RateLimiter;
    rateLimiterPerDomain: RateLimiterPerDomain;
    delays: {
        tooManyRequests: number;
        networkError: number;
    };
}

export interface SteamOptions {
    language: string;
    currency: number;
}

type RateLimiterPerDomain = { [domain: string]: RateLimiter };

export class Network {
    private readonly networkStrategy: NetworkStrategy;
    private readonly steamOptions: SteamOptions;

    constructor(networkStrategy?: NetworkStrategy, steamOptions?: SteamOptions) {
        this.networkStrategy = networkStrategy ?? {rateLimiter: undefined, rateLimiterPerDomain: {}, delays: {tooManyRequests: 30000, networkError: 15000}};
        this.steamOptions = steamOptions ?? {language: 'english', currency: 1};
    }

    applyRateLimiter(rateLimiter: RateLimiter): number {
        let delay;
        const now = Date.now();

        if (rateLimiter.hard) {
            delay = rateLimiter.delay;
        } else {
            if (rateLimiter.lastRequest) {
                delay = Math.max(rateLimiter.delay - (now - rateLimiter.lastRequest), 0);
            } else {
                delay = 0;
            }
        }

        rateLimiter.lastRequest = now + delay;

        return delay;
    }

    getRateLimiterDelay(url?: string): number {
        // For domain
        if (url) {
            const domain = extractDomainFromUrl(url);
            if (domain && this.networkStrategy.rateLimiterPerDomain[domain]) {
                return this.applyRateLimiter(this.networkStrategy.rateLimiterPerDomain[domain]);
            }
        }

        // For global
        if (this.networkStrategy.rateLimiter) {
            return this.applyRateLimiter(this.networkStrategy.rateLimiter);
        }

        // No rate limiter defined
        return 0;
    }

    async fetch(url: string, headers?: any): Promise<any> {
        let response: Response | undefined;

        console.log('Request to', url);
        do {
            try {
                let date = Date.now();
                response = await fetch(url, {headers});
                console.log('Took', Date.now() - date, 'ms');
            } catch (e) {
                console.error(e);
            }

            if (!response) {
                // Network error
                console.warn('Network problem, retrying in', this.networkStrategy.delays.networkError);
                await delay(this.networkStrategy.delays.networkError);
            } else if (response.status === 429) {
                // TooManyRequests
                console.warn('TooManyRequests, retrying in', this.networkStrategy.delays.tooManyRequests);
                await delay(this.networkStrategy.delays.tooManyRequests);
            }
        } while (!response || response.status === 429);

        return response;
    }

    async fetchRateLimited(url: string, headers?: any): Promise<any> {
        await delay(this.getRateLimiterDelay(url));
        return this.fetch(url, headers);
    }

    async fetchJson(url: string, headers?: any, rateLimited = true): Promise<any> {
        const response = await (rateLimited ? this.fetchRateLimited(url, headers) : this.fetch(url, headers));
        return response.json();
    }

    async fetchText(url: string, headers?: any, rateLimited = true): Promise<string> {
        const response = await (rateLimited ? this.fetchRateLimited(url, headers) : this.fetch(url, headers));
        return response.text();
    }

    fetchSteamMarketItemPage(itemId: number): Promise<any> {
        const currency = this.steamOptions.currency;
        const language = this.steamOptions.language;
        return this.fetchJson(`https://steamcommunity.com/market/itemordershistogram?country=FR&language=${language}&currency=${currency}&item_nameid=${itemId}&two_factor=0#`);
    }

    fetchSteamMarketSearch(searchQuery: string): Promise<string> {
        const query = getUrlQuery(searchQuery);
        const language = this.steamOptions.language;
        return this.fetchText(`https://steamcommunity.com/market/search?q=${query}`, {'Cookie': `Steam_Language=${language}`});
    }
}

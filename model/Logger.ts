export class Logger {
    logProgress(current: number, total: number, ...args: any): void {
        console.log(`[${current} / ${total}]`, ...args);
    }

    logTitle(title: string): void {
        console.log();
        console.log(''.padStart(title.length + 12, '-'));
        console.log(''.padStart(5, '-'), title.toLocaleUpperCase(), ''.padStart(5, '-'));
        console.log(''.padStart(title.length + 12, '-'));
    }
}

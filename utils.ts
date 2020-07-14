import {Configuration} from "./model/Configuration.ts";
import {Network} from "./model/Network.ts";
import {Disk} from "./model/Disk.ts";
import {Logger} from "./model/Logger.ts";

export const configuration = new Configuration();
export const network = new Network(configuration.networkStrategy, configuration.steamOptions);
export const disk = new Disk(configuration.filePaths);
export const logger = new Logger();

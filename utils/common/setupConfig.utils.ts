import * as dotenv from 'dotenv'
import { Logger } from './logger.utils'

const logger = Logger.loggerSetup();
export class SetupConfig {
    public static setPathForConfigFile(){
        const dirname = __dirname.replace("utils/common", "");
        if(process.env.CONFIG){
            dotenv.config({
                path: dirname + `/config/.config.${process.env.CONFIG}`
            })
        } else{
            process.env.CONFIG = 'development',
            dotenv.config({
                path: dirname + `/config/.config.${process.env.CONFIG}`,
                override: false,
            })
        }
        logger.info(`Set Up Testing Environment: ${process.env.CONFIG}`)
    }
}
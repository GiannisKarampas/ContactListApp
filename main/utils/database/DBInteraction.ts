import * as dbDriver from './DBDriver';

/**
 * Keeping this to facilitate the creation of the driver to communicate with the db
 * But according to the official Mircosoft playwright repo, Singletons are not supported
 * in Playwright https://github.com/microsoft/playwright/discussions/12114
 */
export class DBInteraction {

    private static instance: DBInteraction;
    readonly driver: dbDriver.DBDriver;

    /**
     * Here we need to create the object for the DBDriver based on the database used
     * For more information check  
     * {@link https://eu.github.chubb.com/CHUBB/WV_Global_Common.UI_TestAutomation/tree/tmp-ui-main-updates#database-interaction|DatabaseInteraction} 
     */
    private constructor() {
        this.driver = new dbDriver.DB2Driver("");
    }

    public static getInstance() {
        
        if(DBInteraction.instance == null) {
            DBInteraction.instance = new DBInteraction();  
        }

        return DBInteraction.instance;
    }

    async getDriver() {
        return this.driver;
    }
}


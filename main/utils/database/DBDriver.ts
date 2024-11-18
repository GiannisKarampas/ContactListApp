import * as mongoDB from "mongodb";
import {Db} from "mongodb";
import * as sqlServer from "mssql";
import {config} from "mssql";
import * as ibmdb from "ibm_db";
import {logger} from "@main/GlobalSetup";

export abstract class DBDriver {
    dbName?: string;
    dbConCreds: string | config;
    db?: any;
    client?: any;
    dbInfo?: string;

    readonly connectionMessage: string = "Connected to database";
    readonly diconnectionMessage: string = "Disconnected from database";

    constructor(dbConCreds: config);
    constructor(dbConCreds: string);
    constructor(dbConCreds: string, dbName: string);
    constructor(...args: any[]) {
        this.dbConCreds = args[0];

        if (args.length == 2) {
            this.dbName = args[1];
        }
        this.dbInfo = getDBInfo(this);
    }

    abstract connect(): any;

    abstract closeConnection(): void;
}

export abstract class RelationalDBDriver extends DBDriver {
    abstract create(query: string): any;

    abstract read(query: string): any;

    abstract update(query: string): any;

    abstract delete(query: string): any;
}

export abstract class NoSQLDBDriver extends DBDriver {
    abstract create(table: string, data: any): any;

    abstract read(table: string, filter: any): any;

    abstract update(table: string, filter: any, updateValue: any): any;

    abstract delete(table: string, filter: any): any;
}

export class SQLServerDBDriver extends RelationalDBDriver {
    /**
     * constructor to initialize an object to connect to SQLServer
     * @param {config} dbConCreds the configuration needed to connect to the database
     * @example
     * const config: config = {
     *   user: <username>,
     *   server: <server url>,
     *   database: <database name>,
     *   domain: <domain if exists, e.g. ACEINA>,
     *   password: <password>,
     *       options: {
     *           trustedConnection: true,
     *           trustServerCertificate: true
     *       }
     *   }
     */
    constructor(dbConCreds: config) {
        super(dbConCreds);
    }

    /**
     * connects to the database
     * @returns a Promise with the ConnectionPool
     */
    async connect(): Promise<sqlServer.ConnectionPool> {
        this.client = await sqlServer.connect(this.dbConCreds as config);

        logger.info(this.connectionMessage + " " + this.dbInfo);
        return this.client;
    }

    /**
     * closes the connection to the database
     */
    closeConnection(): void {
        this.client.close();
        logger.info(this.diconnectionMessage + " " + this.dbInfo);
    }

    /**
     * creates a record in the database a.k.a insert
     * @param {string} query
     * @returns the result of the insert action
     * @example insert into table (Name) values('X')
     */
    create(query: string): any {
        return this.execute(query);
    }

    /**
     * reads records from the database
     * @param {string} query
     * @returns the result of the read action
     * @example 'select * from table'
     */
    read(query: string): any {
        return this.execute(query);
    }

    /**
     * updates records in the database
     * @param {string} query
     * @returns the result of the update action
     * @example update table set Name = 'A' where Name = 'X'
     */
    update(query: string): any {
        return this.execute(query);
    }

    /**
     * deletes records in the database
     * @param {string} query
     * @returns the result of the delete action
     * @example delete from table where Name = 'X'
     */
    delete(query: string): any {
        return this.execute(query);
    }

    /**
     * encapsulates the database action for all CRUD methods
     * @param {string} query
     * @returns the result of the action
     */
    private execute(query: string): any {
        if (process.env.LOG_SQL === "true") {
            logger.info(query);
        }
        return this.client.query(query);
    }
}

export class DB2Driver extends RelationalDBDriver {
    /**
     * constructor to initialize an object to connect to DB2
     * @param {string} dbConCreds
     * The credentials should be in the following format DATABASE=<database>;HOSTNAME=<hostname>;UID=<username>;PWD=<password>;PORT=<port>;
     * @example ```DATABASE=EUCLUW2;HOSTNAME=UK01DRS6175;UID=eustvui1;PWD=red1234#;PORT=50018;```
     */
    constructor(dbConCreds: string) {
        super(dbConCreds as string);
    }

    /**
     * connects to the database
     * @returns a Promise with the Database connection
     */
    async connect(): Promise<ibmdb.Database> {
        this.client = await ibmdb.open(this.dbConCreds as string);

        logger.info(this.connectionMessage + " " + this.dbInfo);
        return this.client;
    }

    /**
     * closes the connection to the database
     */
    closeConnection(): void {
        this.client.close();
        logger.info(this.diconnectionMessage + " " + this.dbInfo);
    }

    /**
     * creates a record in the database a.k.a insert
     * @param {string} query
     * @returns the result of the insert action
     * @example insert into table (Name) values('X')
     */
    create(query: string) {
        return this.execute(query);
    }

    /**
     * reads records from the database
     * @param {string} query
     * @returns the result of the read action
     * @example 'select * from table'
     */
    read(query: string): any {
        return this.execute(query);
    }

    /**
     * updates records in the database
     * @param {string} query
     * @returns the result of the update action
     * @example update table set Name = 'A' where Name = 'X'
     */
    update(query: string) {
        return this.execute(query);
    }

    /**
     * deletes records in the database
     * @param {string} query
     * @returns the result of the delete action
     * @example delete from table where Name = 'X'
     */
    delete(query: string): any {
        return this.execute(query);
    }

    /**
     * encapsulates the database action for all CRUD methods
     * @param {string} query
     * @returns the result of the action
     */
    private execute(query: string): any {
        if (process.env.LOG_SQL === "true") {
            logger.info(query);
        }
        return this.client.query(query);
    }
}

export class MongoDBDriver extends NoSQLDBDriver {
    /**
     * constructor to initialize an object to connect to MongoDb
     * @param {string} dbConCreds
     * @param {string} dbName
     * The credentials should be in the following format mongodb://<database>:<password>@<server with aceins.com in the end>/<username>
     * Specials characters in the password should be url escaped
     * @example ```mongodb://euuwddev:foobar@eugbd-lapp0014.aceins.com:27017/euuwddev```
     */
    constructor(dbConCreds: string, dbName: string) {
        super(dbConCreds as string, dbName as string);
    }

    /**
     * connects to the database
     * @returns a Promise with the DB connection
     */
    async connect(): Promise<Db> {
        this.client = new mongoDB.MongoClient(this.dbConCreds as string);
        await this.client.connect();
        this.db = this.client.db(this.dbName);

        logger.info(this.connectionMessage + " " + this.dbInfo);
        return this.db;
    }

    /**
     * closes the connection to the database
     */
    closeConnection(): void {
        this.client.close();
        logger.info(this.diconnectionMessage + " " + this.dbInfo);
    }

    /**
     * creates a record in the database a.k.a insert
     * @param {string} document the name of the mongoDB document
     * @param {OptionalId<mongoDB.BSON.Document>} obj a mongoDB obj to insert
     * @returns the result of the insert action
     * @example
     * let obj = {
     *   key: 'foobar',
     *   value: 1
     *  }
     */
    create(document: string, obj: mongoDB.OptionalId<mongoDB.BSON.Document>): any {
        let collection = this.db?.collection(document);
        return collection?.insertOne(obj);
    }

    /**
     * reads records from the database
     * @param {string} document the name of the mongoDB document
     * @param {Filter<mongoDB.BSON.Document>} filter criteria if any
     * @returns the result of the read action
     * @example
     * {
     *    '_id' : new ObjectId("6201566ecb5debe83fb9b27d")
     * }
     */
    read(document: string, filter: mongoDB.Filter<mongoDB.BSON.Document>): any {
        let collection = this.db?.collection(document);
        return collection?.findOne(filter);
    }

    /**
     * updates records in the database
     * @param {string} document the name of the mongoDB document
     * @param {Filter<mongoDB.BSON.Document>} filter the criteria to select which records to update
     * @param {UpdateFilter<mongoDB.BSON.Document>} updateValue the new value to set
     * @returns the result of the update action
     * @example
     * let filter =  { '_id' : new ObjectId("5d36e68683f4fe3be0d587db") };
     * let updateValue = { $set : {'createdDateTime' : '2019-07-23 10:50:45.004Z'} };
     */
    update(document: string, filter: mongoDB.Filter<mongoDB.BSON.Document>, updateValue: mongoDB.UpdateFilter<mongoDB.BSON.Document>): any {
        let collection = this.db?.collection(document);
        return collection?.updateOne(filter, updateValue);
    }

    /**
     * deletes records in the database
     * @param {string} document the name of the mongoDB document
     * @param {Filter<mongoDB.BSON.Document>} filter criteria to delete
     * @returns the result of the delete action
     * @example
     * let obj = {
     *    '_id' : new ObjectId("6201566ecb5debe83fb9b27d")
     * }
     */
    delete(document: string, filter: mongoDB.Filter<mongoDB.BSON.Document>): any {
        let collection = this.db?.collection(document);
        return collection?.deleteOne(filter);
    }
}

/**
 * fetches the information to which database we are connected
 * @param driver the DBDriver used for the current connection
 * @returns the details of the database connection
 */
function getDBInfo(driver: DBDriver): string {
    let dbInfo = "";

    if (driver instanceof SQLServerDBDriver) {
        let creds = driver.dbConCreds as config;
        dbInfo = creds.server + " - " + creds.database;
    } else if (driver instanceof DB2Driver) {
        let creds = driver.dbConCreds as string;
        let dbInstance: string = creds.split(";")[0].split("=")[1];
        let hostName: string = creds.split(";")[1].split("=")[1];
        dbInfo = dbInstance + " - " + hostName;
    } else if (driver instanceof MongoDBDriver) {
        let creds = driver.dbConCreds as string;
        let dbInstance: string = creds.split("//")[1].split(":")[0];
        let hostName: string = creds.split("@")[1].split(":")[0];
        dbInfo = dbInstance + " - " + hostName;
    }

    return dbInfo;
}

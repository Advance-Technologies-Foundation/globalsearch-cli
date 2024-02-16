import * as mssql from 'mssql';
import { Client } from 'pg'
import {MSSQL_SET_FEATURES, MSSQL_SYS_SETTINGS} from "mssql";
import {PSQL_SET_FEATURES} from "./postgres";
import {PSQL_SYS_SETTINGS} from "./postgres";

export type DbType = 'mssql' | 'postgres' | 'oracle';

export function connectionCheck(databaseType: DbType, connectionString: string): Promise<void> {
    switch (databaseType) {
        case "mssql":
            return checkMssql(connectionString);
        case "postgres":
            return checkPostgres(connectionString);
        case "oracle":
            return checkOracle(connectionString);
    }
}

export async function setFeatures(databaseType: DbType, connectionString: string): Promise<void> {
    switch (databaseType) {
        case "mssql":
            await executeMssql(connectionString, MSSQL_SET_FEATURES);
            break;
        case "postgres":
            await executePostgres(connectionString, PSQL_SET_FEATURES);
            break;
        case "oracle":
            await executeOracle(connectionString, PSQL_SET_FEATURES);
            break;
        console.log(`UPDATE GS features has been success`);
    }
}

export async function updateSysSettings(
    databaseType: DbType,
    connectionString: string,
    gsUrl: string,
    webApiUrl: string,
    webIndexingUrl: string,
): Promise<void> {
    switch (databaseType) {
        case "mssql":
            let sql = MSSQL_SYS_SETTINGS.replace('{{GlobalSearchUrl}}', gsUrl);
            sql = MSSQL_SYS_SETTINGS.replace('{{GlobalSearchConfigServiceUrl}}', webApiUrl);
            sql = MSSQL_SYS_SETTINGS.replace('{{GlobalSearchIndexingApiUrl}}', webIndexingUrl);
            await executeMssql(connectionString, sql);
            break;
        case "postgres":
            let sql2 = PSQL_SYS_SETTINGS.replace('{{GlobalSearchUrl}}', gsUrl);
            sql2 = MSSQL_SYS_SETTINGS.replace('{{GlobalSearchConfigServiceUrl}}', webApiUrl);
            sql2 = MSSQL_SYS_SETTINGS.replace('{{GlobalSearchIndexingApiUrl}}', webIndexingUrl);
            await executePostgres(connectionString, sql2);
            break;
        case "oracle":
            await executeOracle(connectionString, PSQL_SET_FEATURES);
            break;
            console.log(`UPDATE GS features has been success`);
    }
}


async function checkMssql(connectionString: string) {
    await mssql.connect(`${connectionString};Connection Timeout=10;TrustServerCertificate=true`);
    await mssql.query`SELECT TOP 1 "Id" FROM "Feature";`;
}

async function executeMssql(connectionString: string, sql: string) {
    await mssql.connect(`${connectionString};Connection Timeout=10;TrustServerCertificate=true`);
    await mssql.query`${sql}`;
}

async function executePostgres(connectionString: string, sql: string) {
    const { parseConnectionString } = require('@tediousjs/connection-string');
    const config = parseConnectionString(connectionString);
    const { server, host, password, port, database } = config;
    const client = new Client({
        user: config['user id'],
        host: host ?? server,
        database: database,
        password: password,
        port: port,
    })
    await client.connect();
    await client.query(sql);
    await client.end();
}

async function checkPostgres(connectionString: string) {
    const { parseConnectionString } = require('@tediousjs/connection-string');
    const config = parseConnectionString(connectionString);
    const { server, host, password, port, database } = config;
    const client = new Client({
        user: config['user id'],
        host: host ?? server,
        database: database,
        password: password,
        port: port,
    })
    // const client = new Client({ connectionString, });
    await client.connect();
    await client.query(`SELECT "Id" FROM "Feature" LIMIT 1;`);
    await client.end();
}

async function checkOracle(connectionString: string) {
    const oracledb = require('oracledb');
    const connection = await oracledb.getConnection ({
        connectString: connectionString
    });
    await connection.execute(`SELECT TRUNC(CURRENT_DATE) AS current_date FROM dual;`);
    await connection.close();
}

async function executeOracle(connectionString: string, sql: string) {
    const oracledb = require('oracledb');
    const connection = await oracledb.getConnection ({
        connectString: connectionString
    });
    await connection.execute(sql);
    await connection.close();
}


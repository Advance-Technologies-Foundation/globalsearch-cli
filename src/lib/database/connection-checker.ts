import * as mssql from 'mssql';
import { Client } from 'pg'

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

async function checkMssql(connectionString: string) {
    await mssql.connect(connectionString);
    await mssql.query`SELECT TOP 1 "Id" FROM "Feature";`;
}

async function checkPostgres(connectionString: string) {
    const client = new Client({ connectionString, });
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


import axios from 'axios';
import {DbType} from "./database";

export type AddSite = {
    siteName: string,
    dbType: DbType,
    connectionString: string,
    webApiUrl: string,
};
export type AddSearch = {
    siteName: string,
    webApiUrl: string,
};

export async function addSite(config: AddSite): Promise<void> {
    const url = `${config.webApiUrl}/sites/${config.siteName}`;
    try {
        await axios.post(url, {
            databaseType: config.dbType === 'postgres' ? 'postgresql' : config.dbType,
            databaseConnectionString: config.connectionString,
        });
        console.log(`Success add site for ${config.siteName}`);
    } catch (e: any) {
        console.error(`Fail add site for ${config.siteName}`);
        const err = `Fail connect to ${url}. \n ${e.toString()}`
        throw new Error(err);
    }
}

export async function addSearch(config: AddSearch): Promise<string> {
    const url = `${config.webApiUrl}/sites/${config.siteName}/search`;
    try {
        const response = await axios.post(url, {
            numberOfShards: 1,
            numberOfReplicas: 0,
        });
        console.log(`Success add search for ${config.siteName}`);
        console.log(`ES index name: ${response.data.message}`);
        return response.data.message;
    } catch (e: any) {
        console.error(`Fail add search for ${config.siteName}`);
        const err = `Fail connect to ${url}. \n ${e.toString()}`
        throw new Error(err);
    }
}


import * as inquirer from "inquirer";
import {connectionCheck, DbType, setFeatures, updateSysSettings} from "../../../lib/database";
import {liveness} from "../../../lib/webservice";
import {addSearch, addSite} from "../../../lib/webapi";

const colors = require('colors/safe');

export const run = async () => {
	const webApiUrl = await getWebApiUrl();
	const searchService = await getSearchServiceUrl();
	const webIndexingService = await getWebIndexingServiceUrl();

	const databaseType = await getDatabaseType();
	const connectionString = await getDatabaseConnectionString(databaseType);
	const siteName = await getSiteName(connectionString);

	console.log(`databaseType: ${colors.green(databaseType)}`);
	console.log(`connectionString: ${colors.green(connectionString)}`);
	console.log(`webApiUrl: ${colors.green(webApiUrl)}`);
	console.log(`searchService: ${colors.green(searchService)}`);
	console.log(`webIndexingService: ${colors.green(webIndexingService)}`);
	console.log(`siteName: ${colors.green(siteName)}`);

	await addSite({
		connectionString: connectionString,
		dbType: databaseType,
		webApiUrl: webApiUrl,
		siteName: siteName,
	});
	const esIndexName = await addSearch({
		siteName: siteName,
		webApiUrl: webApiUrl
	});
	const creatioGsUrl = `${searchService}/${esIndexName}`;

	await setFeatures(connectionString, databaseType);
	await updateSysSettings(
		databaseType,
		connectionString,
		creatioGsUrl,
		webApiUrl,
		webIndexingService,
	);
	process.exit(-1);

	/**
	 1. Resolve type os database connection string
	 2. Check database connection with connection string
	 3. Add site to web-api
	 4. Add search to web-api
	 5. Enable features in creatio
	 6. Set sys setting in creatio
	 7. Run anonymus send configs from creatio
    */
}

async function getDatabaseType(): Promise<DbType> {
	const answer: any = await inquirer.prompt([
		{
			type: "list",
			name: "databaseType",
			message: "Creatio database type?",
			choices: ['mssql', 'postgres', 'oracle'],
			default: 'mssql'
		},
	]);
	return answer.databaseType as DbType;
}

async function getDatabaseConnectionString(databaseType: DbType): Promise<any> {
	const answer: any = await inquirer.prompt([
		{
			type: "input",
			name: "connectionString",
			message: "PLase provide connection string to creatio database:",
			validate: value => value.toString().trim() !== '',
		},
	]);
	const connectionString = answer.connectionString;
	try {
		await connectionCheck(databaseType, connectionString);
	} catch (e) {
		console.error(e);
		// todo: check on input in db
		return getDatabaseConnectionString(databaseType);
	}
	return connectionString;
}

async function getSiteName(connectionString: string): Promise<string> {
	const { parseConnectionString } = require('@tediousjs/connection-string');
	const { server, database } = parseConnectionString(connectionString);
	const answer: any = await inquirer.prompt([
		{
			type: "input",
			name: "siteName",
			message: "PLase provide site name",
			default: database ?? server,
			validate: value => Boolean(value),
		},
	]);
	return answer.siteName;
}

async function getWebApiUrl(): Promise<string> {
	const answer: any = await inquirer.prompt([
		{
			type: "input",
			name: "webApiUrl",
			message: "PLase provide WEB-API URL",
			default: 'https://gs-api-stage.bpmonline.com',
			validate: value => value.toString().trim().startsWith('http'),
		},
	]);
	const webApiUrl = normalizeUrl(answer.webApiUrl);
	try {
		await liveness(webApiUrl);
	} catch (e) {
		console.error(e);
		return getWebApiUrl();
	}
	return webApiUrl;
}

async function getWebIndexingServiceUrl(): Promise<string> {
	const answer: any = await inquirer.prompt([
		{
			type: "input",
			name: "webIndexingService",
			default: 'https://gs-index-stage.bpmonline.com',
			message: "PLase provide WEB-INDEXING-SERVICE URL",
			validate: value => value.toString().trim().startsWith('http'),
		}
	]);
	const webIndexingService = normalizeUrl(answer.webIndexingService);
	try {
		await liveness(webIndexingService);
	} catch (e) {
		console.error(e);
		return getWebIndexingServiceUrl();
	}
	return webIndexingService;
}

async function getSearchServiceUrl(): Promise<string> {
	const answer: any = await inquirer.prompt([
		{
			type: "input",
			name: "searchService",
			message: "PLase provide SEARCH-SERVICE URL",
			default: 'https://gs-search-stage.bpmonline.com',
			validate: value => value.toString().trim().startsWith('http'),
		},
	]);
	const searchService = normalizeUrl(answer.searchService);
	try {
		await liveness(searchService);
	} catch (e) {
		console.error(e);
		return getSearchServiceUrl();
	}
	return searchService;
}

function normalizeUrl(url: string): string {
	return url.trim().replace(/\/\/$/g, '/');
}

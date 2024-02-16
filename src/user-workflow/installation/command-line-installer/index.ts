import * as inquirer from "inquirer";
import {connectionCheck, DbType} from "../../../lib/database";

const colors = require('colors/safe');

export const run = async () => {

	const databaseType = await getDatabaseType();
	const connectionString = await getDatabaseConnectionString(databaseType);

	const questions = [
		{
			type: "input",
			name: "webApiUrl",
			message: "PLase provide WEB-API URL (http://localhost:81):",
			validate: value => value.toString().trim().startsWith('http'),
		},
		{
			type: "input",
			name: "searchService",
			message: "PLase provide SEARCH-SERVICE URL (http://localhost:82):",
			validate: value => value.toString().trim().startsWith('http'),
		},
		{
			type: "input",
			name: "webIndexingService",
			message: "PLase provide WEB-INDEXING-SERVICE URL (http://localhost:83):",
			validate: value => value.toString().trim().startsWith('http'),
		}
	];
	const answer = await getAnswers(questions);

	const webApiUrl = answer.webApiUrl;
	const searchService = answer.searchService;
	const webIndexingService = answer.webIndexingService;

	console.log(colors.gray(databaseType));
	console.log(colors.gray(connectionString));
	console.log(colors.gray(webApiUrl));
	console.log(colors.gray(searchService));
	console.log(colors.gray(webIndexingService));

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

async function getAnswers(questions): Promise<any> {
	const answers = await inquirer.prompt(questions);
	console.log(answers)
	return answers;
}


import * as inquirer from "inquirer";
import * as postgres from "./postgres";

let databaseType = 'postgresql';

export const run = async () => {
	let answer = await inquirer
		.prompt([
			{
				type: "list",
				name: "databaseType",
				message: "Choose database type of the creatio",
				choices: [databaseType, 'mssql', 'oracle'],
				default: databaseType
			}
		]) as any;
	databaseType = answer.databaseType;
	if (databaseType === 'postgresql') {
		await postgres.run();
	}
}

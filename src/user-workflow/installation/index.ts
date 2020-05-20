import * as inquirer from "inquirer";
import * as elasticsearch from './elasticsearch'
import * as services from './services'
import SystemRequirements from "../../lib/system-requirements";

export const run = async () => {
	SystemRequirements.check()
	const setupEs = "Install and run elasticsearch";
	const setupGsServices = "Install and configure Global Search services";
	let answer = await inquirer
		.prompt([
			{
				type: "list",
				name: "action",
				message: "What would you like to do?",
				choices: [setupEs, setupGsServices],
				default: setupEs,
			}
		]) as any;
	const action = answer.action;
	if (action === setupEs) {
		await elasticsearch.run();
	}
	if (action === setupGsServices) {
		await services.run();
	}
}

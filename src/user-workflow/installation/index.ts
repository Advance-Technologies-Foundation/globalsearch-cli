import * as inquirer from "inquirer";
import * as elasticsearch from './elasticsearch'
import * as services from './services'
import * as webInterfaceInstall from './web interface-installer'
import * as commandLineInstaller from './command-line-installer'

export const run = async () => {
	const commandLine = "Only configure Global Search (without installation)";
	const webInterface = "Installation using the web interface";
	const setupEs = "Install and run elasticsearch";
	const setupGsServices = "Install and configure Global Search services";
	let answer = await inquirer
		.prompt([
			{
				type: "list",
				name: "action",
				message: "What would you like to do?",
				choices: [commandLine, webInterface/*, setupEs, setupGsServices*/],
				default: commandLine,
			}
		]) as any;
	const action = answer.action;
	if (action === commandLine) {
		await commandLineInstaller.run();
	}
	if (action === webInterface) {
		await webInterfaceInstall.run();
	}
	if (action === setupEs) {
		await elasticsearch.run();
	}
	if (action === setupGsServices) {
		await services.run();
	}
}

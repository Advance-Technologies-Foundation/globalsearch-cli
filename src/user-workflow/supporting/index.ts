import * as inquirer from "inquirer";
import * as makeLogs from "./make-logs";
import * as showSearchTemplate from "./show-search-template";

export const run = async () => {
	try {
		const showSearchTemplateMessage = "Show search template";
		const makeLogsMessage = "Make logs of the docker containers";
		let answer = await inquirer
			.prompt([
				{
					type: "list",
					name: "action",
					message: "What would you like to do?",
					choices: [makeLogsMessage, showSearchTemplateMessage],
					default: makeLogsMessage
				}
			]) as any;
		const action = answer.action;
		if (action === makeLogsMessage) {
			await makeLogs.run();
		}
		if (action === showSearchTemplateMessage) {
			await showSearchTemplate.run();
		}
	} catch (e) {
		console.error(e);
		return
	}
}

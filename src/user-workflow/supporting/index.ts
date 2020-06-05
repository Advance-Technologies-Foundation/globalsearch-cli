import * as inquirer from "inquirer";
import * as makeLogs from "./make-logs";

export const run = async () => {
	try {
		const makeLogsMessage = "Make logs of the docker containers";
		let answer = await inquirer
			.prompt([
				{
					type: "list",
					name: "action",
					message: "What would you like to do?",
					choices: [makeLogsMessage],
					default: makeLogsMessage
				}
			]) as any;
		const action = answer.action;
		if (action === makeLogsMessage) {
			await makeLogs.run();
		}
	} catch (e) {
		console.error(e);
		return
	}
}

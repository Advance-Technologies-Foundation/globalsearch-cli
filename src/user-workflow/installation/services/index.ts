import * as inquirer from "inquirer";

export const run = async () => {
	let answer = await inquirer
		.prompt([
			{
				type: "confirm",
				name: "esInstalled",
				message: "You have already installed elasticsearch?",
				default: true,
			}
		]) as any;
	if (!answer.esInstalled) {
		throw new Error('First you need to install elasticsearch');
	}
}

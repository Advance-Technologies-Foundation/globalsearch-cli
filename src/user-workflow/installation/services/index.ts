import * as inquirer from "inquirer";
import ElasticsearchRequirements from "../../../lib/elasticsearch-requirements";

let dockerTagVersion = '2.0.2';
let elasticsearchUrl = '';

export const run = async () => {
	await checkInstalledGs();
	await selectDockerTag();
	await setElasticsearchUrl();
}

const checkInstalledGs = async () => {
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

const selectDockerTag = async () => {
	let answer = await inquirer
		.prompt([
			{
				type: "list",
				name: "dockerTagVersion",
				message: "Select version of the global search to installation",
				choices: ['2.0.1', '2.0.2'],
				default: dockerTagVersion
			}
		]) as any;
	dockerTagVersion = answer.dockerTagVersion;
}


const setElasticsearchUrl = async () => {
	let answer = await inquirer
		.prompt([
			{
				type: "input",
				name: "elasticsearchUrl",
				message: "Specify http elasticsearch path, example http://192.168.10.150:9200",
				validate: value => /^https?:\/\/.+$/.test(value),
			}
		]) as any;
	elasticsearchUrl = answer.elasticsearchUrl;
	await ElasticsearchRequirements.checkVersion(elasticsearchUrl);
}

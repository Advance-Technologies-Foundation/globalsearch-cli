import * as inquirer from "inquirer";
import * as database from './database'
import ElasticsearchRequirements from "../../../lib/elasticsearch-requirements";
import UrlChecker from "../../../lib/url-checker";

let dockerTagVersion = '2.0.2';
let elasticsearchUrl = '';
let creatioUrl = '';

export const run = async () => {
	await checkInstalledGs();
	await selectDockerTag();
	await setElasticsearchUrl();
	await setCreatioUrl();
	await database.run();
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

const setCreatioUrl = async () => {
	let answer = await inquirer
		.prompt([
			{
				type: "input",
				name: "creatioUrl",
				message: "Specify http or https creatio path, example https://192.168.10.20",
				validate: value => /^https?:\/\/.+$/.test(value),
			}
		]) as any;
	creatioUrl = answer.creatioUrl;
	await UrlChecker.checkUrl(creatioUrl);
}

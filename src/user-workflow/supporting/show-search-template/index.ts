import Docker from "../../../lib/docker";
import * as inquirer from "inquirer";

export const run = async () => {
	try {
		const sites = await Docker.getSites();
		if (sites.length === 0) {
			console.log(`Not found any registered sites...`);
			return;
		}
		const firstSite = sites.find(x => Boolean(x)) || {name: null};
		let answer = await inquirer
			.prompt([
				{
					type: "list",
					name: "action",
					message: "Please select the site for which you want to know the search template",
					choices: sites.map(x => x.name),
					default: firstSite.name
				}
			]) as any;
		const siteName = answer.action;
		const selectedSite = sites.find(x => x.name === siteName) || {id: 0};
		await Docker.showSearchTemplate(selectedSite.id);
	} catch (e) {
		console.error(e);
		return
	}
}

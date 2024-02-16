import SystemRequirements from "../../../lib/system-requirements";

const colors = require('colors/safe');

const helperAPI = [
	'docker run -d --network gs-helper',
	'--rm -it',
	'--name gs-helper-api',
	'-v /var/run/docker.sock:/var/run/docker.sock',
	'-v /usr/bin/docker:/usr/bin/docker',
	'-e ONLY_INSTALL=1',
	`-e SERVER_IP=${process.env.SERVER_IP}`,
	`bpmonlinebuild/gs-helper-api:d40ae359c7a8eaf0b4dd6b35e522f2862e80596a`,
];

const helperUi = [
	'docker run -d --network gs-helper',
	'--rm -it',
	'--name gs-helper-ui',
	'-p 4000:81',
	'bpmonlinebuild/gs-helper-ui-with-proxy:cb118d0c4c11daa42ab3719b75764625842c7d52',
];

export const run = async () => {
	SystemRequirements.check();
	console.log(colors.gray(`Please wait...!`));

	safeRunShell('docker create network gs-helper');
	safeRunShell('docker rm -f gs-helper-api');
	safeRunShell('docker rm -f gs-helper-ui');

	runShell('docker pull bpmonlinebuild/gs-helper-api:d40ae359c7a8eaf0b4dd6b35e522f2862e80596a')
	runShell('docker pull bpmonlinebuild/gs-helper-ui-with-proxy:cb118d0c4c11daa42ab3719b75764625842c7d52')

	runShell(helperAPI.join(' \\'));
	runShell(helperUi.join(' \\'));
	runShell('docker ps | grep gs-helper-');

	const link = colors.green(`http://${process.env.SERVER_IP}:4000/#/setup`)
	console.log(
		colors.yellow(`Please open `),
		link,
		colors.yellow(`in your browser on your PC and follow the instructions.`)
	);
}

function safeRunShell(cmd: string): void {
	try {
		const childProcess = require('child_process');
		childProcess.execSync(cmd, {
			stdio: 'ignore',
			shell: true,
		});
	} catch (e) {}
}

function runShell(cmd: string): void {
	const childProcess = require('child_process');
	childProcess.execSync(cmd, {
		stdio: 'inherit',
		shell: true,
	});
}

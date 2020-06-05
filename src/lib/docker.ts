export default abstract class Docker {

	private static async _getContainers(): Promise<string[]> {
		const command = `docker ps --filter "label=service=gs" -a --format "table {{.Names}}"`;
		const childProcess = require('child_process');
		const out = childProcess.execSync(command);
		return out.toString()
			.split("\n")
			.filter(x => x !== 'NAMES')
			.filter(x => x);
	}

	private static async _saveLogs(containers: string[]): Promise<string[]> {
		containers.forEach(container => {
			const command = `docker logs ${container} >& ${container}.log`;
			const childProcess = require('child_process');
			childProcess.execSync(command);
		});
		return containers.map(container => `${container}.log`);
	}

	private static async _zipFiles(): Promise<string> {
		const zipFileName = `${new Date().getTime()}_containers.logs.zip`
		const command = `zip ${zipFileName} *.log`;
		const childProcess = require('child_process');
		childProcess.execSync(command);
		childProcess.execSync(`rm -rf gs-*.log`);
		return zipFileName;
	}

	public static async zipLogs() {
		const containers = await Docker._getContainers();
		await Docker._saveLogs(containers);
		await Docker._zipFiles();
	}
}

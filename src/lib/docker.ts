export default abstract class Docker {

	private static async _getContainers(): Promise<string[]> {
		const command = `docker ps --filter "label=service=gs" -a --format "table {{.Names}}"`;
		const childProcess = require('child_process');
		childProcess.execSync(`docker ps --filter "label=service=gs" -a --format "table {{.Names}}\t{{.Ports}}\t{{.Status}}\t{{.RunningFor}}" >> out/gs-CONTAINERS.log`);
		const out = childProcess.execSync(command);
		return out.toString()
			.split("\n")
			.filter(x => x !== 'NAMES')
			.filter(x => x);
	}

	private static async _saveLogs(containers: string[]): Promise<string[]> {
		containers.forEach(container => {
			const command = `docker logs ${container} > out/${container}.log`;
			const childProcess = require('child_process');
			childProcess.execSync(command);
		});
		return containers.map(container => `out/${container}.log`);
	}

	private static async _saveEnv(containers: string[]): Promise<string[]> {
		containers.forEach(container => {
			const command = `docker exec ${container} env > out/${container}.env`;
			const childProcess = require('child_process');
			childProcess.execSync(command);
		});
		return containers.map(container => `out/${container}.env`);
	}

	private static async _zipFiles(): Promise<string> {
		const zipFileName = `${new Date().getTime()}_containers.logs.zip`
		const command = `zip out/${zipFileName} out/*.log out/*.env`;
		const childProcess = require('child_process');
		childProcess.execSync(command);
		childProcess.execSync(`rm -rf out/gs-*`);
		return zipFileName;
	}

	/**
	 * @return Path of the zip logs file.
	 */
	public static async zipLogs(): Promise<string> {
		const containers = await Docker._getContainers();
		await Docker._saveLogs(containers);
		await Docker._saveEnv(containers);
		return await Docker._zipFiles();
	}
}

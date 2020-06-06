export default abstract class Docker {

	private static async _getContainers(): Promise<string[]> {
		const command = `docker ps --filter "label=service=gs" -a --format "table {{.Names}}"`;
		const childProcess = require('child_process');
		childProcess.execSync(`docker ps --filter "label=service=gs" -a --format "table {{.Names}}\t{{.Ports}}\t{{.Status}}\t{{.RunningFor}}\t{{.Image}}" >> out/gs-CONTAINERS.log`, {
			stdio: 'inherit',
			shell: true,
		});
		const out = childProcess.execSync(command);
		return out.toString()
			.split("\n")
			.filter(x => x !== 'NAMES')
			.filter(x => x);
	}

	private static async _saveLogs(containers: string[]): Promise<void> {
		containers.forEach(container => {
			const command = `docker logs ${container} > out/${container}.log`;
			const childProcess = require('child_process');
			childProcess.execSync(command, {
				stdio: 'inherit',
				shell: true,
			});
		});
	}

	private static async _saveEnv(containers: string[]): Promise<void> {
		try {
			containers.forEach(container => {
				const command = `docker exec ${container} env > out/${container}.env.log`;
				const childProcess = require('child_process');
				childProcess.execSync(command, {
					stdio: 'inherit',
					shell: true,
				});
			});
		} catch (e) {
			// console.error(e.message);
		}
	}

	private static async _saveSqlQueries() {
		const postgresCommand = 'docker exec gs-postgres';
		const siteQuery = `psql -c 'SELECT * FROM "Site"' -Upostgres;`;
		const columns = [
			`"SiteId"`,
			`"EntityName"`,
			`"IndexEntityName"`,
			`"ParentEntityName"`,
			`"TrackingColumnName"`,
			`"IndexingType"`,
			`"LastIndexedOn"`,
			`"InProcess"`,
			`"ScheduledIndexingEnabled"`,
			`"SingleIndexingEnabled"`,
		];
		const indexingEntityQuery = `psql -c 'SELECT ${columns.join(',')} FROM "IndexingEntity"' -Upostgres;`;
		const searchTemplateQuery = `psql -c 'SELECT * FROM "SearchTemplate"' -Upostgres;`;
		try {
			const childProcess = require('child_process');
			childProcess.execSync(`(${postgresCommand} ${siteQuery}) >> out/gs-postgres-site.log`, {
				shell: true,
			});
			childProcess.execSync(`(${postgresCommand} ${indexingEntityQuery}) >> out/gs-postgres-indexing-entity.log`, {
				shell: true,
			});
			childProcess.execSync(`(${postgresCommand} ${searchTemplateQuery}) >> out/gs-postgres-search-template.log`, {
				shell: true,
			});
		} catch (e) {
			// console.error(e.message);
		}
	}

	private static async _zipFiles(): Promise<string> {
		const zipFileName = `${new Date().getTime()}_containers.logs.zip`
		const command = `zip --encrypt out/${zipFileName} out/*.log`;
		const childProcess = require('child_process');
		childProcess.execSync(command, {
			stdio: 'inherit',
			shell: true,
		});
		childProcess.execSync(`rm -rf out/*.log`);
		return zipFileName;
	}

	/**
	 * @return Path of the zip logs file.
	 */
	public static async zipLogs(): Promise<string> {
		const containers = await Docker._getContainers();
		if (!containers || containers.length === 0) {
			throw new Error('Any containers not found...');
		}
		await Docker._saveLogs(containers);
		await Docker._saveEnv(containers);
		await Docker._saveSqlQueries();
		return await Docker._zipFiles();
	}
}

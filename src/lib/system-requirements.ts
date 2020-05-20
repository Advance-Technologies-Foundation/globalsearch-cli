export default abstract class SystemRequirements {

	public static check() {
		SystemRequirements._checkDocker();
		SystemRequirements._checkDockerCompose();
	}

	private static _checkDocker() {
		const execSync = require('child_process').execSync;
		const errorMessage = `To continue, you must install the dependent program: docker`;
		try {
			const version = execSync(`docker version --format '{{.Server.Version}}'`);
			const versionFloat = parseFloat(version);
			if (isNaN(versionFloat)) {
				throw new Error(errorMessage);
			}
		} catch (e) {
			throw new Error(errorMessage);
		}
	}

	private static _checkDockerCompose() {
		const execSync = require('child_process').execSync;
		const errorMessage = `To continue, you must install the dependent program: docker-compose`;
		try {
			const version = execSync(`docker-compose version --short`);
			const versionFloat = parseFloat(version);
			if (isNaN(versionFloat)) {
				throw new Error(errorMessage);
			}
		} catch (e) {
			throw new Error(errorMessage);
		}
	}
}

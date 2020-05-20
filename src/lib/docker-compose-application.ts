import {GsServicesConfig} from "./model/gs-services-config.model";
import * as clone from 'git-clone'

const binaryFolder = './binary';
const githubBinaryUrl = 'https://github.com/Advance-Technologies-Foundation/gs-docker-compose.git';

export default abstract class DockerComposeApplication {

	public static async runGsServices(config: GsServicesConfig) {
		console.info('please wait: cloning docker-compose binary repository...');
		await DockerComposeApplication.fetchInstallationBinary();
	}

	private static async fetchInstallationBinary() {
		return new Promise(resolve => {
			clone(githubBinaryUrl, binaryFolder, {}, resolve);
		});
	}
}

import {GsServicesConfig} from "./model/gs-services-config.model";
import * as clone from 'git-clone'
import * as path from "path";

const binaryFolder = './binary';
const githubBinaryUrl = 'https://github.com/Advance-Technologies-Foundation/gs-docker-compose.git';

export default abstract class DockerCompose {

	public static async runGsServices(config: GsServicesConfig) {
		await DockerCompose.fetchInstallationBinary();
		await DockerCompose.callRunGsServices(config);
	}

	public static async runElasticsearch() {
		await DockerCompose.fetchInstallationBinary();
		await DockerCompose.callRunElasticsearch();
	}

	private static async fetchInstallationBinary() {
		await new Promise(resolve => {
			console.info('please wait: cloning installation binary files...');
			clone(githubBinaryUrl, binaryFolder, {}, resolve);
		});
		console.info('cloning installation binary files successful');
	}

	private static async callRunGsServices(config: GsServicesConfig) {
		try {
			const absolutePath = path.resolve(binaryFolder, 'services');
			const childProcess = require('child_process');
			childProcess.execSync(`docker-compose down`, {
				cwd: absolutePath
			});
			childProcess.execSync(`docker-compose up -d`, {
				env: {
					'DOCKER_TAG': config.dockerTagVersion,
					'GS_ES_URL': config.esUrl,
				},
				cwd: absolutePath
			});
		} catch (e) {
			throw e;
		}
	}

	private static async callRunElasticsearch() {
		try {
			const absolutePath = path.resolve(binaryFolder, 'elasticsearch');
			const childProcess = require('child_process');
			childProcess.execSync(`docker-compose down`, {
				cwd: absolutePath
			});
			childProcess.execSync(`docker-compose up -d`, {
				cwd: absolutePath
			});
		} catch (e) {
			throw e;
		}
	}
}

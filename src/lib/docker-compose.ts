import {GsServicesConfig} from "./model/gs-services-config.model";
import * as clone from 'git-clone'
import * as path from "path";

const binaryFolder = './binary';
const githubBinaryUrl = 'https://github.com/Advance-Technologies-Foundation/gs-docker-compose.git';

export default abstract class DockerCompose {

	public static async runGsServices(config: GsServicesConfig) {
		console.info('please wait: cloning docker-compose binary repository...');
		await DockerCompose.fetchInstallationBinary();
		await DockerCompose.callRunGsServices();
	}

	public static async runElasticsearch() {
		console.info('please wait: cloning docker-compose binary repository...');
		await DockerCompose.fetchInstallationBinary();
		await DockerCompose.callRunElasticsearch();
	}

	private static async fetchInstallationBinary() {
		return new Promise(resolve => {
			clone(githubBinaryUrl, binaryFolder, {}, resolve);
		});
	}

	private static async callRunGsServices() {
		try {
			const absolutePath = path.resolve(binaryFolder, 'services');
			const childProcess = require('child_process');
			childProcess.execSync(`cd ${absolutePath} && docker-compose down`);
			childProcess.execSync(`cd ${absolutePath} && docker-compose up -d`);
		} catch (e) {
			throw e;
		}
	}

	private static async callRunElasticsearch() {
		try {
			const absolutePath = path.resolve(binaryFolder, 'elasticsearch');
			const childProcess = require('child_process');
			childProcess.execSync(`cd ${absolutePath} && docker-compose down`);
			childProcess.execSync(`cd ${absolutePath} && docker-compose up -d`);
		} catch (e) {
			throw e;
		}
	}
}

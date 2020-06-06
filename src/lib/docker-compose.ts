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

	public static async uninstallServices() {
		await DockerCompose.fetchInstallationBinary();
		const servicesPath = path.resolve(binaryFolder, 'services');
		const elasticsearchPath = path.resolve(binaryFolder, 'elasticsearch');
		const childProcess = require('child_process');
		childProcess.execSync(`docker-compose down`, {
			cwd: servicesPath,
			stdio: 'inherit',
			shell: true,
		});
		childProcess.execSync(`docker-compose down`, {
			cwd: elasticsearchPath,
			stdio: 'inherit',
			shell: true,
		});
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
			console.info('removing previous docker-compose containers if presents...');
			const absolutePath = path.resolve(binaryFolder, 'services');
			const childProcess = require('child_process');
			childProcess.execSync(`docker-compose down`, {
				cwd: absolutePath,
				stdio: 'inherit',
				shell: true,
			});
			console.info('removing previous docker-compose containers successful');
			console.info('running new docker-compose containers, please wait...');
			const command = process.env.RUN_IN_DOCKER
				? `/usr/bin/docker-compose up -d`
				: `docker-compose up -d`;
			childProcess.execSync(command, {
				env: {
					'DOCKER_TAG': config.dockerTagVersion,
					'GS_ES_URL': config.esUrl,
				},
				cwd: absolutePath,
				stdio: 'inherit',
				shell: true,
			});
			console.info('running new docker-compose containers successful');
		} catch (e) {
			throw e;
		}
	}

	private static async callRunElasticsearch() {
		try {
			const absolutePath = path.resolve(binaryFolder, 'elasticsearch');
			const childProcess = require('child_process');
			childProcess.execSync(`docker-compose down`, {
				cwd: absolutePath,
				stdio: 'inherit',
				shell: true,
			});
			childProcess.execSync(`docker-compose up -d`, {
				cwd: absolutePath,
				stdio: 'inherit',
				shell: true,
			});
		} catch (e) {
			throw e;
		}
	}
}

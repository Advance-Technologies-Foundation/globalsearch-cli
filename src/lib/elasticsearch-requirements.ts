import axios from 'axios';

export default abstract class ElasticsearchRequirements {

	public static async checkVersion(esUrl: string): Promise<void> {
		const response = await axios.get(esUrl, {
			auth: {
				username: 'user',
				password: 'password'
			}
		});
		const data = response.data;
		if (!data.version) {
			throw new Error(`Unable to establish a connection to the elasticsaerch service at ${esUrl}`);
		}
		const esVersion = data.version.number;
		if (esVersion === '5.6.9' || esVersion === '5.6.10') {
			return;
		}
		throw new Error(`Elasticsaerch version ${esVersion} not supported. Supported only '5.6.9' or '5.6.10' versions.`);
	}
}

import axios from 'axios';

export default abstract class UrlChecker {

	public static async checkUrl(url: string) {
		let response;
		try {
			response = await axios.get(url);
			if (response.status >= 200 && response.status < 400) {
				return;
			}
		} catch (e) {
			throw new Error(`Check ${url} failed. ${e.message}`);
		}
		throw new Error(`Check url failed. ${url} return status ${response.status}`);
	}
}

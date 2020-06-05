import Docker from "../../../lib/docker";

export const run = async () => {
	const zipFilePath = await Docker.zipLogs();
	console.info(`Log zip saved in /tmp/gs-out/${zipFilePath} successful!`);
	console.info(`You can run command: "ls -la /tmp/gs-out" for listing files`);
}

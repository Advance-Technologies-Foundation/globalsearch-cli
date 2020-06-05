import Docker from "../../../lib/docker";

export const run = async () => {
	await Docker.zipLogs()
}

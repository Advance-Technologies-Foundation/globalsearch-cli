import DockerCompose from "../../lib/docker-compose";

export const run = async () => {
	await DockerCompose.uninstallServices();
}

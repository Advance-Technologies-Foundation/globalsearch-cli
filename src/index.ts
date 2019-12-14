import {DockerComposeGenerator} from "./generators/docker-compose";
(async () => {
    const instance = new DockerComposeGenerator();
    await instance.run();
})();


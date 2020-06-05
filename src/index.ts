import * as yosay from 'yosay';
import * as inquirer from "inquirer";
import * as setupGs from './user-workflow/installation';
import * as healthCheckGs from './user-workflow/health-check';
import * as supportingGs from './user-workflow/supporting';

(async () => {
    try {
        const message = yosay(`Hello, I’m a global search helper assistant! Follow the instructions!`);
        console.log(message);
        const setup = "Setup global search";
        const check = "Check global search";
        const supporting = "Supporting";
        let answer = await inquirer
            .prompt([
                {
                    type: "list",
                    name: "action",
                    message: "What would you like to do?",
                    choices: [setup, check, supporting],
                    default: setup
                }
            ]) as any;
        const action = answer.action;
        if (action === setup) {
            await setupGs.run();
        }
        if (action === check) {
            await healthCheckGs.run();
        }
        if (action === supporting) {
            await supportingGs.run();
        }
    } catch (e) {
        console.error(e);
        return
    }
})();

import * as yosay from 'yosay';
import * as inquirer from "inquirer";
import * as setupGs from './user-workflow/installation';
import * as healthCheckGs from './user-workflow/health-check';

(async () => {
    try {
        const message = yosay(`Greetings, I’m a global search tuning assistant! Follow the instructions!`);
        console.log(message);
        const setup = "Setup global search for creatio";
        const check = "Check global search settings";
        let answer = await inquirer
            .prompt([
                {
                    type: "list",
                    name: "action",
                    message: "What would you like to do?",
                    choices: [setup, check],
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
    } catch (e) {
        console.error(e);
        return
    }
})();

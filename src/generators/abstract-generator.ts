export abstract class AbstractGenerator {
    protected answers: any;

    constructor() {
        this.answers = {};
    }

    abstract async run(): Promise<void>

    protected setAnswers(answers: any) {
        this.answers = {
            ...this.answers,
            ...answers,
        }
    }
}

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Command {
    constructor() {
        this.command = 'sign-up [OPTIONS]';
        this.describe = 'Create an account for Jamkit';
        this.builder = (args) => args
            .showHelpOnFail(true)
            .positional('email', { alias: 'e', type: 'string', desc: 'E-mail to use for sign-up' });
    }
    async handler(argv) {
        console.log({ argv });
    }
}
module.exports = new Command();

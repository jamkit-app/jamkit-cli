"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const anonymous_1 = require("../../../lib/anonymous");
class Command {
    constructor() {
        this.command = 'login [user] [OPTIONS]';
        this.describe = 'Login to Jamkit';
        this.builder = (args) => args
            .showHelpOnFail(true)
            .positional('user', { type: 'string', desc: 'Username or email', demandOption: false });
    }
    async handler(argv) {
        try {
            await anonymous_1.getData();
        }
        catch (e) {
            console.log({ error: e });
        }
    }
}
module.exports = new Command();

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Command {
    constructor() {
        this.command = 'push [file] [OPTIONS]';
        this.describe = 'Push file(s) to Jamkit. Will push the entire working directory by default';
        this.builder = (args) => args
            .showHelpOnFail(true)
            .positional('file', { type: 'string', desc: 'File to push' })
            .option('files', { type: 'string', desc: 'The template name to be used to create a new project.' });
    }
    async handler(argv) {
        console.log({ argv });
    }
}
module.exports = new Command();

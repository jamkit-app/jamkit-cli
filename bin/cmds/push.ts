import yargs from 'yargs'

class Command implements yargs.CommandModule {
  public readonly command = 'push [file] [OPTIONS]';
  public readonly describe = 'Push file(s) to jamkit. Will push the entire working directory by default';
  public readonly builder = (args: yargs.Argv) => args
    .showHelpOnFail(true)
    .positional('file', { type: 'string', desc: 'File to push' })
    .option('files', { type: 'string', desc: 'The template name to be used to create a new project.' })

  public async handler(argv: any) {
    console.log({argv})
  }
}

module.exports = new Command()
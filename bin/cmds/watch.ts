import yargs from 'yargs'

class Command implements yargs.CommandModule {
  public readonly command = 'watch [pattern] [OPTIONS]';
  public readonly describe = 'Watches current directory recursively by default';
  public readonly builder = (args: yargs.Argv) => args
    .showHelpOnFail(true)
    .positional('pattern', { type: 'string', desc: 'Watch pattern' })

  public async handler(argv: any) {
    console.log({argv})
  }
}

module.exports = new Command()
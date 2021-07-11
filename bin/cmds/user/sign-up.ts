import yargs from 'yargs'

class Command implements yargs.CommandModule {
  public readonly command = 'sign-up [OPTIONS]';
  public readonly describe = 'Create an account for Jamkit';
  public readonly builder = (args: yargs.Argv) => args
    .showHelpOnFail(true)
    .positional('email', { alias: 'e', type: 'string', desc: 'E-mail to use for sign-up' })

  public async handler(argv: any) {
    console.log({argv})
  }
}

module.exports = new Command()
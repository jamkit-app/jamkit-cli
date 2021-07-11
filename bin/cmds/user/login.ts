import yargs from 'yargs'
import { getData } from '../../../lib/anonymous'

class Command implements yargs.CommandModule {
  public readonly command = 'login [user] [OPTIONS]';
  public readonly describe = 'Login to jamkit';
  public readonly builder = (args: yargs.Argv) => args
    .showHelpOnFail(true)
    .positional('user', { type: 'string', desc: 'Username or email', demandOption: false })

  public async handler(argv: any) {
    try {
      await getData()
    } catch(e) {
      console.log({error: e})
    }
  }
}

module.exports = new Command()
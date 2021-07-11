exports.command = 'user <command>'
exports.desc = 'Manage login / sign up for jamkit'
exports.builder = function (yargs: any) {
  return yargs.commandDir('user')
}
exports.handler = function (argv: any) {}
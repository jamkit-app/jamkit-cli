"use strict";
exports.command = 'user <command>';
exports.desc = 'Manage login / sign up for Jamkit';
exports.builder = function (yargs) {
    return yargs.commandDir('user');
};
exports.handler = function (argv) { };

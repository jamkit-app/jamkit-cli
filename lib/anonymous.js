"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getData = void 0;
const aws_amplify_1 = __importStar(require("aws-amplify"));
// import { Credentials } from '@aws-amplify/core'
const node_localstorage_1 = require("node-localstorage");
const os_1 = require("os");
const path = __importStar(require("path"));
const aws_amplify_2 = require("aws-amplify");
const form_data_1 = __importDefault(require("form-data"));
const archiver_1 = __importDefault(require("archiver"));
const stream_buffers_1 = require("stream-buffers");
const ulid_1 = require("ulid");
aws_amplify_1.default.Logger.LOG_LEVEL = 'DEBUG';
aws_amplify_1.default.configure({
    // OPTIONAL - if your API requires authentication
    Auth: {
        // REQUIRED - Amazon Cognito Identity Pool ID
        identityPoolId: 'eu-central-1:6e900eb6-d539-464b-808b-8ac8f9be823a',
        // REQUIRED - Amazon Cognito Region
        region: 'eu-central-1',
        // // OPTIONAL - Amazon Cognito User Pool ID
        userPoolId: 'eu-central-1_I377Q1cC6',
        // // OPTIONAL - Amazon Cognito Web Client ID (26-char alphanumeric string)
        userPoolWebClientId: '2ujk673t3vg0liqhl9292ir05n',
        mandatorySignIn: false
    },
    API: {
        endpoints: [
            {
                name: "MyAPIGatewayAPI",
                endpoint: "https://z9qx8mbcra.execute-api.eu-central-1.amazonaws.com",
                region: 'eu-central-1'
            }
        ]
    }
});
aws_amplify_1.Auth.configure({
    storage: new node_localstorage_1.LocalStorage(path.join(os_1.homedir(), '.Jamkit', 'local-storage')),
});
const zipDirectory = (source) => {
    const archive = archiver_1.default('tar', { gzip: true });
    const stream = new stream_buffers_1.WritableStreamBuffer();
    return new Promise((resolve, reject) => {
        archive
            .directory(source, false)
            .on('error', err => reject(err))
            .on('end', () => resolve(stream.getContents()))
            .pipe(stream);
        archive.finalize();
    });
};
const upload = async (result) => {
    console.log({ result });
    const stream = await zipDirectory(path.join(__dirname, 'uploads'));
    if (!stream)
        throw new Error('no uploads');
    return new Promise((ok, ko) => {
        const form = new form_data_1.default();
        Object.entries(result.fields).forEach(([field, value]) => {
            form.append(field, value);
        });
        form.append('Content-Type', 'application/gzip');
        form.append("file", stream, {
            filepath: `${ulid_1.ulid()}.zip`,
            contentType: 'application/gzip',
            knownLength: stream.length
        });
        form.submit(result.url, (err, res) => {
            console.log({ err, res });
            if (err) {
                ko(err);
            }
            ok(res);
        });
    });
};
const getData = async () => {
    const apiName = 'MyAPIGatewayAPI';
    const apiPath = '/unauthenticated/bar';
    const result = await aws_amplify_1.API.get(apiName, apiPath, {});
    try {
        await upload(result);
    }
    catch (e) {
        console.log({ e });
    }
    return result;
};
exports.getData = getData;
const logger = new aws_amplify_2.Logger('My-Logger');
const listener = (data) => {
    switch (data.payload.event) {
        case 'signIn':
            logger.info('user signed in');
            break;
        case 'signUp':
            logger.info('user signed up');
            break;
        case 'signOut':
            logger.info('user signed out');
            break;
        case 'signIn_failure':
            logger.error('user sign in failed');
            break;
        case 'tokenRefresh':
            logger.info('token refresh succeeded');
            break;
        case 'tokenRefresh_failure':
            logger.error('token refresh failed');
            break;
        case 'configured':
            logger.info('the Auth module is configured');
    }
};
aws_amplify_2.Hub.listen('auth', listener);

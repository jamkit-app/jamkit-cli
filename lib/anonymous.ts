import Amplify, { API, Auth } from 'aws-amplify';
// import { Credentials } from '@aws-amplify/core'
import { LocalStorage } from 'node-localstorage';
import { homedir } from 'os'
import * as path from 'path'

import { Hub, Logger } from 'aws-amplify';

import FormData from "form-data";

import archiver from 'archiver';
import { WritableStreamBuffer } from 'stream-buffers';

import { ulid } from 'ulid'

Amplify.Logger.LOG_LEVEL = 'DEBUG'

Amplify.configure({
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

Auth.configure({
    storage: new LocalStorage(path.join(homedir(), '.jamkit', 'local-storage')),
});

const zipDirectory = (source: string): Promise<Buffer | false> => {
  const archive = archiver('tar', { gzip: true });
  const stream = new WritableStreamBuffer()

  return new Promise((resolve, reject) => {
    archive
      .directory(source, false)
      .on('error', err => reject(err))
      .on('end', () => resolve(stream.getContents()))
      .pipe(stream)
      ;
    archive.finalize();
  });
}


const upload = async (result: any) =>{
    console.log({result})

    const stream = await zipDirectory(path.join(__dirname, 'uploads'));
    if (!stream) throw new Error('no uploads')

    return new Promise((ok, ko) => {
        const form = new FormData();
        Object.entries(result.fields).forEach(([field, value]) => {
            form.append(field, value);
        });

        form.append('Content-Type', 'application/gzip')
        form.append("file", stream, {
            filepath: `${ulid()}.zip`,
            contentType: 'application/gzip',
            knownLength: stream.length
        });

        form.submit(result.url, (err, res) => {
            console.log({err, res})

            if (err) {
                ko(err)
            }

            ok(res)
        });

    })
}

export const getData = async () => {
  const apiName = 'MyAPIGatewayAPI';
  const apiPath = '/unauthenticated/bar';

  const result = await API.get(apiName, apiPath, {});
    try {
        await upload(result)
    } catch(e) {
        console.log({e})
    }
    return result
}

const logger = new Logger('My-Logger');

const listener = (data: any) => {
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
}

Hub.listen('auth', listener);
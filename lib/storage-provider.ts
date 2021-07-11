// import { Storage } from 'aws-amplify';
// import { StorageProvider } from '@aws-amplify/storage'

// export default class JamkitProvider implements StorageProvider {
//     // category and provider name
//     static category = 'Storage';
//     static providerName = 'JamkitProvider';

//     // you need to implement these seven methods
//     // configure your provider
//     configure(config: object): object {
//       return {}
//     }

//     // get object/pre-signed url from storage
//     get(key: string, options?): Promise<String|Object> {
//       return
//     }

//     // upload storage object
//     put(key: string, object, options?): Promise<Object> {

//     }

//     // remove object
//     remove(key: string, options?): Promise<any> {

//     }

//     // list objects for the path
//     list(path, options?): Promise<any> {

//     }

//     getCategory(): string {
//       return JamkitProvider.category
//     }

//     getProviderName(): string {
//       return JamkitProvider.providerName
//     }
// }

// // add the plugin
// Storage.addPluggable(new JamkitProvider());

// // send configuration into Amplify
// Storage.configure({
//     [JamkitProvider.providerName]: {
//         // My Storage provider configuration
//     }
// });
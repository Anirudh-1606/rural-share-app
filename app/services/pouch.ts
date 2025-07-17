import PouchDB from 'pouchdb-react-native';

// Export a single database instance that the rest of the app can share.
// You can change the name (`ruralshare`) or add sync/replication options here.
const db = new PouchDB('ruralshare');

export default db;

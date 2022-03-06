import FirestoreAdapter from 'emberfire/adapters/firestore';

export default class ApplicationAdapter extends FirestoreAdapter {
  enablePersistence = true;
  persistenceSettings = { synchronizeTabs: true };
}

/*
import RealtimeDatabaseAdapter from 'emberfire/adapters/realtime-database';

export default class ApplicationAdapter extends  RealtimeDatabaseAdapter{}*/

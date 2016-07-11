import firebase from 'firebase';

/**
 * Offline references maintain a local cache of their data and can respond to
 * value lookups and queries. We set fixture data at the root level of the
 * reference, so that the entire data structure is "known" in the local cache.
 *
 * While the reference is in offline mode, any `set`, `update` or `remove`
 * operations would usually not fire their completion callbacks. Ordinarily
 * these callbacks would wait until the reference has gone online and
 * synchronized with the server. For testing, we know that all data will be in
 * the local cache so we shortcut this process with `stubFirebase()` and invoke
 * the callbacks immediately.
 */
export default function stubFirebase() {
  // check for existing stubbing
  if (!firebase._unStub) {
    var originalSet = firebase.database.Reference.prototype.set;
    var originalUpdate = firebase.database.Reference.prototype.update;
    var originalRemove = firebase.database.Reference.prototype.remove;

    firebase._unStub = function () {
      firebase.database.Reference.prototype.set = originalSet;
      firebase.database.Reference.prototype.update = originalUpdate;
      firebase.database.Reference.prototype.remove = originalRemove;
    };

    firebase.database.Reference.prototype.set = function(data, cb) {
      originalSet.call(this, data);
      if (typeof cb === 'function') {
        setTimeout(cb, 0);
      }
    };

    firebase.database.Reference.prototype.update = function(data, cb) {
      originalUpdate.call(this, data);
      if (typeof cb === 'function') {
        setTimeout(cb, 0);
      }
    };

    firebase.database.Reference.prototype.remove = function(cb) {
      originalRemove.call(this);
      if (typeof cb === 'function') {
        setTimeout(cb, 0);
      }
    };
  }
}

import firebase from 'firebase';

/**
 * When a reference is in offline mode it will not call any callbacks
 * until it goes online and resyncs. The ref will have already
 * updated its internal cache with the changed values so we shortcut
 * the process and call the supplied callbacks immediately (asynchronously).
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

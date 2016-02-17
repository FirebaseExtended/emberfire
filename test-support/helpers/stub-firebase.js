import Firebase from 'firebase';

/**
 * When a reference is in offline mode it will not call any callbacks
 * until it goes online and resyncs. The ref will have already
 * updated its internal cache with the changed values so we shortcut
 * the process and call the supplied callbacks immediately (asynchronously).
 */
export default function stubFirebase() {

  // check for existing stubbing
  if (!Firebase._unStub) {

    var originalSet = Firebase.prototype.set;
    var originalUpdate = Firebase.prototype.update;
    var originalRemove = Firebase.prototype.remove;

    Firebase._unStub = function () {
      Firebase.prototype.set = originalSet;
      Firebase.prototype.update = originalUpdate;
      Firebase.prototype.remove = originalRemove;
    };

    Firebase.prototype.set = function(data, cb) {
      originalSet.call(this, data);
      if (typeof cb === 'function') {
        setTimeout(cb, 0);
      }
    };

    Firebase.prototype.update = function(data, cb) {
      originalUpdate.call(this, data);
      if (typeof cb === 'function') {
        setTimeout(cb, 0);
      }
    };

    Firebase.prototype.remove = function(cb) {
      originalRemove.call(this);
      if (typeof cb === 'function') {
        setTimeout(cb, 0);
      }
    };

  }
}

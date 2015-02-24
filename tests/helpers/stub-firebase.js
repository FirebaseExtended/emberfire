import Firebase from 'firebase';
import sinon from 'sinon';

export default function stubFirebase() {

  var originalSet = Firebase.prototype.set;
  var originalUpdate = Firebase.prototype.update;

  // check for existing stubbing
  if (!Firebase.prototype.set.restore) {
    sinon.stub(Firebase.prototype, 'set', function(data, afterSet) {
      originalSet.call(this, data);
      if (typeof afterSet === 'function') {
        setTimeout(afterSet, 0); // maintain async
      }
    });

    sinon.stub(Firebase.prototype, 'update', function(data, afterUpdate) {
      originalUpdate.call(this, data);
      if (typeof afterUpdate === 'function') {
        setTimeout(afterUpdate, 0);
      }
    });
  }
}

import Ember from 'ember';

export default Ember.Mixin.create({

  init() {
    this._super.apply(this, arguments);
    // unresolved requests, used in testing
    this._reasons = 0;

    if (Ember.testing) {
      this._registerWaiter();
    }
  },


  _incrementWaiters() {
    this._reasons++;
  },


  _decrementWaiters() {
    this._reasons--;
  },


  /**
   * The waiter calls this to determine if testing should wait. Override in
   * the implementing class if needed.
   *
   * @return {Boolean}
   * @private
   */
  _shouldWait() {
    return this._reasons === 0;
  },


  /**
   * Wire up a waiter for this instance.
   *
   * @private
   */
  _registerWaiter: function() {
    this._waiter = () => {
      return this._shouldWait();
    };
    Ember.Test.registerWaiter(this._waiter);
  },

});

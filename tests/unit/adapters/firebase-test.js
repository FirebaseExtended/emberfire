/* jshint expr:true */
import {
  describeModule,
  it
} from 'ember-mocha';

describeModule('adapter:firebase', 'FirebaseAdapter', {
    // Specify the other units that are required for this test.
    // needs: ['serializer:foo']
  },
  function() {

    describe('#init', function () {

      it('throws an error when the firebase property is not supplied', function() {
        var subject, msg;
        try {
          subject = this.subject();
        } catch (e) {
          msg = e.message;
        }
        expect(msg).to.be.equal('Please set the `firebase` property on the adapter.');
      });

    });
  }
);

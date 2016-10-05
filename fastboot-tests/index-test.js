var expect = require('chai').expect;

describe('index', function() {

  it('renders', function() {
    return this.visit('/')
      .then(function(res) {
        var $ = res.jQuery;
        // var response = res.response;

        // add your real tests here
        expect($('body').length).to.equal(1);
        expect($('h1').text().trim()).to.equal('ember-fastboot-addon-tests');
      });
  });

});
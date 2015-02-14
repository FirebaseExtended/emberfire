import resolver from './helpers/resolver';
import { setResolver } from 'ember-mocha';

/* jshint: redefine */
window.assert = window.chai.assert;

setResolver(resolver);

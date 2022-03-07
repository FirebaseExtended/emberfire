import Mixin from '@ember/object/mixin';
import { subscribe, unsubscribe } from '../services/realtime-listener';
import Model from '@ember-data/model';

// TODO make sure realtime works on findAll
//      handle includes
export default Mixin.create({
  afterModel(model: Model) {
    subscribe(this, model);
    return this._super(model);
  },
  deactivate() {
    unsubscribe(this);
    return this._super();
  },
});

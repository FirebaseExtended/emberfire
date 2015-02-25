import Resolver from 'ember/resolver';
import config from '../../config/environment';

var resolver = Resolver.create();

resolver.namespace = {
  modulePrefix: 'emberfire', //config.modulePrefix,
  podModulePrefix: config.podModulePrefix
};

export default resolver;

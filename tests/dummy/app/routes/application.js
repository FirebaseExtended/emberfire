import AnalyticsRouteMixin from 'emberfire/mixins/analytics-route';
import Route from '@ember/routing/route';

export default Route.extend(AnalyticsRouteMixin, {
  analyticsAppName: 'Something, something, app',
  analyticsAppVersion: '0'
});
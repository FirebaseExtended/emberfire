import Base from 'ember-simple-auth/session-stores/base';
import RSVP from 'rsvp';
declare const _default: Readonly<typeof Base> & (new (properties?: object | undefined) => {
    restoring: boolean;
    persist: typeof RSVP.Promise.resolve;
    clear: typeof RSVP.Promise.resolve;
    restore(): RSVP.Promise<{}>;
} & Base) & (new (...args: any[]) => {
    restoring: boolean;
    persist: typeof RSVP.Promise.resolve;
    clear: typeof RSVP.Promise.resolve;
    restore(): RSVP.Promise<{}>;
} & Base);
export default _default;

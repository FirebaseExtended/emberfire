import StateMachine from 'torii/lib/state-machine';

var transitionTo = StateMachine.transitionTo;

function copyProperties(data, target) {
    for (var key in data) {
        if (data.hasOwnProperty(key)) {
            target[key] = data[key];
        }
    }
}

function transitionToClearing(target, propertiesToClear) {
    return function () {
        for (var i; i < propertiesToClear.length; i++) {
            this[propertiesToClear[i]] = null;
        }
        this.transitionTo(target);
    };
}

export default function (session) {
    var sm = new StateMachine({
        initialState: 'unauthenticated',

        states: {
            unauthenticated: {
                errorMessage: null,
                isAuthenticated: false,
                // Actions
                startOpen: transitionToClearing('opening', ['errorMessage']),
                startFetch: transitionToClearing('fetching', ['errorMessage'])
            },
            authenticated: {
                // Properties
                errorMessage: null,
                currentUser: null,
                isAuthenticated: true,
                startOpen: transitionToClearing('openingCredentials', ['errorMessage']),
                startClose: transitionTo('closing')
            },
            opening: {
                isWorking: true,
                isOpening: true,
                // Actions
                finishOpen: function (data) {
                    copyProperties(data, this.states['authenticated']);
                    this.transitionTo('authenticated');
                },
                failOpen: function (errorMessage) {
                    this.states['unauthenticated'].errorMessage = errorMessage;
                    this.transitionTo('unauthenticated');
                }
            },
            openingCredentials: {
                isWorking: true,
                isOpening: true,
                // Actions
                finishOpen: function (data) {
                    copyProperties(data, this.states['authenticated']);
                    this.transitionTo('authenticated');
                },
                failOpen: function (errorMessage) {
                    this.states['authenticated'].errorMessage = errorMessage;
                    this.transitionTo('authenticated');
                }
            },
            fetching: {
                isWorking: true,
                isFetching: true,
                // Actions
                finishFetch: function (data) {
                    copyProperties(data, this.states['authenticated']);
                    this.transitionTo('authenticated');
                },
                failFetch: function (errorMessage) {
                    this.states['unauthenticated'].errorMessage = errorMessage;
                    this.transitionTo('unauthenticated');
                }
            },
            closing: {
                isWorking: true,
                isClosing: true,
                isAuthenticated: true,
                // Actions
                finishClose: function () {
                    this.transitionTo('unauthenticated');
                },
                failClose: function (errorMessage) {
                    this.states['unauthenticated'].errorMessage = errorMessage;
                    this.transitionTo('unauthenticated');
                }
            }
        }
    });
    sm.session = session;
    return sm;
}

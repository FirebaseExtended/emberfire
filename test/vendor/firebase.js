(function() {

   /**
    * A mock that simulates Firebase operations for use in unit tests.
    *
    * ## Setup
    *
    *     // in windows
    *     MockFirebase.stub(window, 'Firebase'); // replace window.Firebase
    *
    *     // in node.js
    *     var Firebase = require('../lib/MockFirebase');
    *
    * ## Usage Examples
    *
    *     var fb = new Firebase('Mock://foo/bar');
    *     fb.on('value', function(snap) {
    *        console.log(snap.val());
    *     });
    *
    *     // do something async or synchronously...
    *
    *     // trigger callbacks and event listeners
    *     fb.flush();
    *
    *     // spy on methods
    *     expect(fb.on.called).toBe(true);
    *
    * ## Trigger events automagically instead of calling flush()
    *
    *     var fb = new MockFirebase('Mock://hello/world');
    *     fb.autoFlush(1000); // triggers events after 1 second
    *     fb.autoFlush(); // triggers events immediately
    *
    * ## Simulating Errors
    *
    *     var fb = new MockFirebase('Mock://fails/a/lot');
    *     fb.failNext('set', new Error('PERMISSION_DENIED'); // create an error to be invoked on the next set() op
    *     fb.set({foo: bar}, function(err) {
    *         // err.message === 'PERMISSION_DENIED'
    *     });
    *     fb.flush();
    *
    * @param {string} [currentPath] use a relative path here or a url, all .child() calls will append to this
    * @param {Object} [data] specify the data in this Firebase instance (defaults to MockFirebase.DEFAULT_DATA)
    * @param {MockFirebase} [parent] for internal use
    * @param {string} [name] for internal use
    * @constructor
    */
   function MockFirebase(currentPath, data, parent, name) {
      // these are set whenever startAt(), limit() or endAt() get invoked
      this._queryProps = { limit: undefined, startAt: undefined, endAt: undefined };

      // represents the fake url
      this.currentPath = currentPath || 'Mock://';

      // do not modify this directly, use set() and flush(true)
      this.data = _.cloneDeep(arguments.length > 1? data||null : MockFirebase.DEFAULT_DATA);

      // see failNext()
      this.errs = {};

      // null for the root path
      this.myName = parent? name : extractName(currentPath);

      // see autoFlush()
      this.flushDelay = false;

      // stores the listeners for various event types
      this._events = { value: [], child_added: [], child_removed: [], child_changed: [], child_moved: [] };

      // allows changes to be propagated between child/parent instances
      this.parent = parent||null;
      this.children = [];
      parent && parent.children.push(this);

      // stores the operations that have been queued until a flush() event is triggered
      this.ops = [];

      // turn all our public methods into spies so they can be monitored for calls and return values
      // see jasmine spies: https://github.com/pivotal/jasmine/wiki/Spies
      // the Firebase constructor can be spied on using spyOn(window, 'Firebase') from within the test unit
      if( typeof sinon.spy === 'function' ) {
         for(var key in this) {
            if( !key.match(/^_/) && typeof(this[key]) === 'function' ) {
              sinon.spy(this, key);
            }
         }
      }
   }

   MockFirebase.prototype = {
      /*****************************************************
       * Test Unit tools (not part of Firebase API)
       *****************************************************/

      /**
       * Invoke all the operations that have been queued thus far. If a numeric delay is specified, this
       * occurs asynchronously. Otherwise, it is a synchronous event.
       *
       * This allows Firebase to be used in synchronous tests without waiting for async callbacks. It also
       * provides a rudimentary mechanism for simulating locally cached data (events are triggered
       * synchronously when you do on('value') or on('child_added') against locally cached data)
       *
       * If you call this multiple times with different delay values, you could invoke the events out
       * of order; make sure that is your intention.
       *
       * @param {boolean|int} [delay]
       * @returns {MockFirebase}
       */
      flush: function(delay) {
         var self = this, list = self.ops;
         self.ops = [];
         if( _.isNumber(delay) ) {
            setTimeout(process, delay);
         }
         else {
            process();
         }
         function process() {
            list.forEach(function(parts) {
               parts[0].apply(self, parts.slice(1));
            });
            self.children.forEach(function(c) {
               c.flush();
            });
         }
         return self;
      },

      /**
       * Automatically trigger a flush event after each operation. If a numeric delay is specified, this is an
       * asynchronous event. If value is set to true, it is synchronous (flush is triggered immediately). Setting
       * this to false disabled autoFlush
       *
       * @param {int|boolean} [delay]
       */
      autoFlush: function(delay){
         this.flushDelay = _.isUndefined(delay)? true : delay;
         this.children.forEach(function(c) {
            c.autoFlush(delay);
         });
         delay !== false && this.flush(delay);
         return this;
      },

      /**
       * Simulate a failure by specifying that the next invocation of methodName should
       * fail with the provided error.
       *
       * @param {String} methodName currently only supports `set` and `transaction`
       * @param {String|Error} error
       */
      failNext: function(methodName, error) {
         this.errs[methodName] = error;
      },

      /**
       * Returns a copy of the current data
       * @returns {*}
       */
      getData: function() {
         return _.cloneDeep(this.data);
      },


      /*****************************************************
       * Firebase API methods
       *****************************************************/

      toString: function() {
         return this.currentPath;
      },

      child: function(childPath) {
         var ref = this, parts = childPath.split('/');
         parts.forEach(function(p) {
            var v = _.isObject(ref.data) && _.has(ref.data, p)? ref.data[p] : null;
            ref = new MockFirebase(mergePaths(ref.currentPath, p), v, ref, p);
         });
         ref.flushDelay = this.flushDelay;
         return ref;
      },

      set: function(data, callback) {
         var self = this;
         var err = this._nextErr('set');
         data = _.cloneDeep(data);
         this._defer(function() {
            if( err === null ) {
               self._dataChanged(data);
            }
            callback && callback(err);
         });
         return this;
      },

      update: function(data, callback) {
         var self = this;
         var err = this._nextErr('update');
         data = _.cloneDeep(data);
         this._defer(function() {
            if( err === null ) {
               self._dataChanged(data);
            }
            callback && callback(err);
         });
         return this;
      },

      name: function() {
         return this.myName;
      },

      ref: function() {
         return this;
      },

      once: function(event, callback) {
        var self = this;
         function fn(snap) {
            self.off(event, fn);
            callback(snap);
         }
         this.on(event, fn);
      },

      on: function(event, callback) { //todo cancelCallback?
         this._events[event].push(callback);
         var data = this.getData(), self = this;
         if( event === 'value' ) {
            this._defer(function() {
               callback(makeSnap(self, data));
            });
         }
         else if( event === 'child_added' ) {
            this._defer(function() {
               var prev = null;
               _.each(data, function(v, k) {
                  callback(makeSnap(self.child(k), v), prev);
                  prev = k;
               });
            });
         }
      },

      off: function(event, callback) {
         if( !event ) {
            for (var key in this._events)
               if( this._events.hasOwnProperty(key) )
                  this.off(key);
         }
         else if( callback ) {
            this._events[event] = _.without(this._events[event], callback);
         }
         else {
            this._events[event] = [];
         }
      },

      transaction: function(valueFn, finishedFn, applyLocally) {
         var valueSpy = sinon.spy(valueFn);
         var finishedSpy = sinon.spy(finishedFn);
         this._defer(function() {
            var err = this._nextErr('transaction');
            // unlike most defer methods, this will use the value as it exists at the time
            // the transaction is actually invoked, which is the eventual consistent value
            // it would have in reality
            var res = valueSpy(this.getData());
            var newData = _.isUndefined(res) || err? this.getData() : res;
            finishedSpy(err, err === null && !_.isUndefined(res), makeSnap(this, newData));
            this._dataChanged(newData);
         });
         return [valueSpy, finishedSpy, applyLocally];
      },

      /**
       * If token is valid and parses, returns the contents of token as exected. If not, the error is returned.
       * Does not change behavior in any way (since we don't really auth anywhere)
       *
       * @param {String} token
       * @param {Function} [callback]
       */
      auth: function(token, callback) {
         callback && this._defer(callback);
      },

      /**
       * Just a stub at this point.
       * @param {int} limit
       */
      limit: function(limit) {
         this._queryProps.limit = limit;
         //todo
      },

      startAt: function(priority, recordId) {
         this._queryProps.startAt = [priority, recordId];
         //todo
      },

      endAt: function(priority, recordId) {
         this._queryProps.endAt = [priority, recordId];
         //todo
      },

      push: function() {
        var id = "_" + new Date().getTime();
        return makeSnap(this.child(id), {});
      },

      /*****************************************************
       * Private/internal methods
       *****************************************************/

      _childChanged: function(ref, data) {
         if( !_.isObject(this.data) ) {
          this.data = {};
         }
         if (this.data[ref.name()] === undefined) {
          this.data[ref.name()] = _.cloneDeep(data);
          this._trigger('child_added', this.data[ref.name()], this.child(ref.name()));
         }
         else {
          this.data[ref.name()] = _.cloneDeep(data);
          this._trigger('child_changed', data, this);
         }
         this.parent && this.parent._childChanged(this, this.data);
         this._trigger('value', this.data, this);
      },

      _dataChanged: function(data) {
         if( !_.isEqual(data, this.data) ) {
            this.data = _.cloneDeep(data);
            this._trigger('value', this.data, this);
            if( this.parent && _.isObject(this.parent.data) ) {
               this.parent._childChanged(this, this.data);
            }
            if(this.children) {
               _.each(this.children, function(child) {
                  child._dataChanged(extractChildData(child.name(), data));
               });
            }
         }
      },

      _defer: function(fn) {
         this.ops.push(Array.prototype.slice.call(arguments, 0));
         if( this.flushDelay !== false ) { this.flush(this.flushDelay); }
      },

      _trigger: function(event, data, ref) {
         var snap = makeSnap(ref, data), self = this;
         _.each(this._events[event], function(fn) {
            if(_.contains(['child_added', 'child_moved'], event)) {
               fn(snap, getPrevChild(self.data, ref.name()));
            }
            else {
               //todo allow scope by changing fn to an array? for use with on() and once() which accept scope?
               fn(snap);
            }
         });
      },

      _nextErr: function(type) {
         var err = this.errs[type];
         delete this.errs[type];
         return err||null;
      }
   };

   function ref(path, autoSyncDelay) {
      var ref = new MockFirebase();
      ref.flushDelay = _.isUndefined(autoSyncDelay)? true : autoSyncDelay;
      if( path ) { ref = ref.child(path); }
      return ref;
   }

   function mergePaths(base, add) {
      return base.replace(/\/$/, '')+'/'+add.replace(/^\//, '');
   }

   function makeSnap(ref, data) {
      data = _.cloneDeep(data);
      return {
         val: function() { return data; },
         ref: function() { return ref; },
         name: function() { return ref.name() },
         getPriority: function() { return null; }, //todo
         forEach: function(cb, scope) {
            _.each(data, function(v, k, list) {
               var res = cb.call(scope, makeSnap(ref.child(k), v));
               return !(res === true);
            });
         }
      }
   }

   function extractChildData(childName, data) {
      if( !_.isObject(data) || !_.has(data, childName) ) {
         return null;
      }
      else {
         return data[childName];
      }
   }

   function extractName(path) {
      return ((path || '').match(/\/([^.$\[\]#\/]+)$/)||[null, null])[1];
   }

   function getPrevChild(data, key) {
      var keys = _.keys(data), i = _.indexOf(keys, key);
      if( keys.length < 2 || i < 1 ) { return null; }
      else {
         return keys[i];
      }
   }

   MockFirebase.stub = function(obj, key) {
      obj[key] = MockFirebase;
   };

   MockFirebase.ref = ref;
   MockFirebase.DEFAULT_DATA  = {
      'data': {
         'a': {
            hello: 'world',
            aNumber: 1,
            aBoolean: false
         },
         'b': {
            foo: 'bar',
            aNumber: 2,
            aBoolean: true
         }
      }
   };

   window.MockFirebase = MockFirebase;

})();
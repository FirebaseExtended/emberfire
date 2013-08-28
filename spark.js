
function checkType(snapshot, cb, binding) {
  var obj = snapshot.val();
  var type = obj._type;

  switch (type) {
    case "object":
      cb.call(binding, FB.Object.create({ ref: snapshot.ref() }));
      break;
    case "array":
      cb.call(binding, FB.Array.create({ ref: snapshot.ref() }));
      break;
    default:
      cb.call(binding, obj);
  }
}

FB = Ember.Namespace.create();
FB.Object = Ember.ObjectProxy.extend({
  init: function() {
    var object = {};
    this.set('content', object);

    function applyChange(snapshot) {
      var key = snapshot.name();
      checkType(snapshot, function(val) {
        Ember.set(object, key, val);
      }, this);
    }

    this.ref.on("child_added", applyChange, this);

    this.ref.on("child_changed", applyChange, this);

    this.ref.on("child_removed", function(snapshot) {
      this.set(snapshot.name(), null);
    }, this);
    this._super();
  },

  willDestroy: function() {
    // TODO: Clean up refs
  },

  toJSON: function() {
    var json = {},
        object = this.get('content');

    for (var key in object) {
      json[key] = Ember.get(object, key);
    }

    json._type = "object";
    return json;
  },

  setUnknownProperty: function(key, value) {
    if (value instanceof FB.Object) {
      value.ref = this.ref.child(key);
      value.ref.set(value.toJSON());
    } else if (value instanceof FB.Array) {
      // TODO: Implement FB.Array.toJSON
    } else {
      this.ref.child(key).set(value);
      return this._super(key, value);
    }
  },

  ref: null
});

FB.Array = Ember.ArrayProxy.extend({
  init: function() {
    var array = [];

    this.set('content', array);
    this._index = [];

    this.ref.on("child_added", function(snapshot) {
      if (snapshot.name() == "_type") return;
      checkType(snapshot, function(val) {
        this._index.pushObject(snapshot.name());
        array.pushObject(val);
      }, this);
    }, this);

    this.ref.on("child_removed", function(snapshot) {
      var idx = this._index.indexOf(snapshot.name());
      this.replace(idx, 1, []);
    }, this);

    this.ref.on("child_changed", function(snapshot) {

    }, this);
  },

  replace: function(idx, amt, objects) {
    var refs = objects.map(function(object) {
      return this.ref.push(object.toJSON()).name();
    });
    this._index.splice(idx, amt, refs);
    this._super(idx, amt, objects);
  }
});

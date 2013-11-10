"use strict";

var EmberFire = Ember.Namespace.create();

EmberFire._checkType = function(snapshot, cb, binding) {
  var obj = snapshot.val();
  var type = obj._type;

  switch (type) {
  case "object":
    cb.call(binding, EmberFire.Object.create({ ref: snapshot.ref() }));
    break;
  case "array":
    cb.call(binding, EmberFire.Array.create({ ref: snapshot.ref() }));
    break;
  default:
    cb.call(binding, obj);
  }
};

EmberFire.Object = Ember.ObjectProxy.extend({
  init: function() {
    var object = {};
    this.set("content", object);

    function applyChange(snapshot) {
      var key = snapshot.name();
      /*jshint validthis:true */
      EmberFire._checkType(snapshot, function(val) {
        Ember.set(object, key, val);
      }, this);
    }

    this.ref.child("_type").set("object");

    this.ref.on("child_added", applyChange, this);

    this.ref.on("child_changed", applyChange, this);

    this.ref.on("child_removed", function(snapshot) {
      this.set(snapshot.name(), null);
    }, this);

    this._super();
  },

  willDestroy: function() {
    this.ref.off();
  },

  toJSON: function() {
    var json = {},
        object = this.get("content");

    for (var key in object) {
      json[key] = Ember.get(object, key);
    }

    json._type = "object";
    return json;
  },

  setUnknownProperty: function(key, value) {
    if (value instanceof EmberFire.Object || value instanceof EmberFire.Array) {
      value.ref = this.ref.child(key);
      value.ref.set(value.toJSON());
    } else {
      this.ref.child(key).set(value);
      return this._super(key, value);
    }
  },

  ref: null
});

EmberFire.Array = Ember.ArrayProxy.extend({
  type: "array",

  init: function() {
    this._array = Ember.A([]);
    this._index = Ember.A([]);

    this.set("content", this._array);

    this.ref.child("_type").set(this.type);

    this.ref.on("child_added", function(snapshot) {
      if (snapshot.name() != "_type") {
        this.childAdded(snapshot);
      }
    }, this);

    this.ref.on("child_removed", function(snapshot) {
      if (snapshot.name() != "_type") {
        this.childRemoved(snapshot);
      }
    }, this);

    this.ref.on("child_changed", function(snapshot) {
      if (snapshot.name() != "_type") {
        this.childChanged(snapshot);
      }
    }, this);

    this._super();
  },

  childAdded: function(snapshot) {
    EmberFire._checkType(snapshot, function(val) {
      this._index.pushObject(snapshot.name());
      this._array.pushObject(val);
    }, this);
  },

  childRemoved: function(snapshot) {
    var idx = this._index.indexOf(snapshot.name());
    this._index.removeAt(idx);
    this._array.removeAt(idx);
  },

  childChanged: function(snapshot) {
    var idx = this._index.indexOf(snapshot.name());
    this._array.replace(idx, 1, [snapshot.val()]);
  },

  replaceContent: function(idx, amt, objects) {
    for (var i = 0; i < amt; i++) {
      var key = this._index[idx+i];
      this.ref.child(key).remove();
    }
    objects.forEach(function(object) {
      var val = object;
      if (object.toJSON) {
        val = object.toJSON();
      }
      return this.ref.push(val).name();
    }, this);
  },

  toJSON: function() {
    var json = {},
        values = this.get("content");

    for (var i = 0; i < this._index.length; i++) {
      json[this._index[i]] = values[i];
    }

    json._type = this.type;
    return json;
  }
});

EmberFire.ObjectArray = EmberFire.Array.extend({
  type: "objectArray",

  childAdded: function(snapshot) {
    var ref = snapshot.ref(),
        name = snapshot.name(),
        object = EmberFire.Object.create({ ref: ref });

    this._index.pushObject(name);
    this._array.pushObject(object);
  },

  childChanged: function() {
    // the child in an EmberFire.Object
    // no need to do anything
  }
});

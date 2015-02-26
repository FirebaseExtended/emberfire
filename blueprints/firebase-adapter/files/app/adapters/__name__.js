<%= importStatements %>

export default <%= baseClass %>.extend({
  firebase: new Firebase(<%= firebaseUrl %>)
});

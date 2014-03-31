var TestHelpers = {

  getPosts: function(snapshot) {
    var posts = [];
    snapshot.forEach(function(post) {
      posts.push(post.val());
    });
    return posts;
  },

  getModelName: function(modelName) {
    return '%@%@'.fmt(modelName, new Date().getTime());
  }

};
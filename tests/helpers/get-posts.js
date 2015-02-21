export default function(snapshot) {
  var posts = [];
  snapshot.forEach(function(post) {
    posts.push(post.val());
  });
  return posts;
}

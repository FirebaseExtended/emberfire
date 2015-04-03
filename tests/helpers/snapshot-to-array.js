export default function(snapshot) {
  var arr = [];
  snapshot.forEach(function(item) {
    arr.push(item.val());
  });
  return arr;
}

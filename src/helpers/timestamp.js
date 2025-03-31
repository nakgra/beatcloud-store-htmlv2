module.exports = function(options) {
  let date = new Date()
  return options.fn(this) + '?v=' + date.getTime();
}
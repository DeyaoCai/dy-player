module.exports = function execTimeout(conf) {
  setTimeout(conf.fn, conf.time)
}

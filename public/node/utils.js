const cwd =process.cwd();
function resolve(filePath){
  return require(path.join(cwd, './public/node/',filePath))
}
module.exports = {
  resolve
}



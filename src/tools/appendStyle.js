module.exports = function appendStyle(compName, styleStr = '', forceUpdate = false) {
  appendStyle.cacheMap || (appendStyle.cacheMap = {});
  if (forceUpdate || !appendStyle.cacheMap[compName]) {
    const style = document.createElement('style');
    style.innerHTML = styleStr.replace(/<\/?style.*?>/g, '');
    document.head.appendChild(style);
    appendStyle.cacheMap[compName] = styleStr;
  } else {
    console.log(`[style][${compName}] is already exist!`);
  }
}

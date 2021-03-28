export function appendStyle(compName: string, styleStr: string, forceUpdate: boolean = false) {
  // @ts-ignore;
  appendStyle.cacheMap || (appendStyle.cacheMap = {});
  // @ts-ignore;
  if (forceUpdate || !appendStyle.cacheMap[compName]) {
    const style = document.createElement('style');
    style.innerHTML = styleStr.replace(/<\/?style.*?>/g, '');
    document.head.appendChild(style);
    // @ts-ignore;
    appendStyle.cacheMap[compName] = styleStr;
  } else {
    console.log(`[style][${compName}] is already exist!`);
  }
}

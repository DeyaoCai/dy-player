export function MakeThrottle_(fn: Function, time = 300) {
  let prevTime = 0;
  const ret = function () {
    if (Date.now() - prevTime - ret.time > 0) {
      fn.apply(null, [...arguments]);
      prevTime = Date.now();
    }
  }
  ret.time = time;
  return ret;
}

export function MakeThrottle(time = 300) {
  let prevTime = 0;
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const fn = target[propertyKey];
    target[propertyKey] = function () {
      if (Date.now() - prevTime - time > 0) {
        fn.apply(target, [...arguments]);
        prevTime = Date.now();
      }
    }
  }
}

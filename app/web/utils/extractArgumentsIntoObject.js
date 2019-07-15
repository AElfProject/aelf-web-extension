/**
 * @file extractArgumentsIntoObject.js
 * @author atom.young,huangzongzhe
 * 2019.09.19
 */
const isFunction = object => typeof object === 'function';
const isBoolean = object => typeof object === 'boolean';
export default function extractArgumentsIntoObjec(args) {
  const result = {
    callback: () => {},
    isSync: false
  };
  if (args.length === 0) {
    // has no callback, default to be async mode
    return result;
  }
  if (isFunction(args[args.length - 1])) {
    result.callback = args[args.length - 1];
  }
  args.forEach(arg => {
    if (isBoolean((arg.sync))) {
      result.isSync = arg.sync;
    }
  });
  return result;
}

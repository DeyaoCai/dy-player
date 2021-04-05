
export interface IOptions {
  key?: string;
  label?: string;
  compType: string;
  formCompType?: string;
  tableCompType: string;
  usage: []|string[];
  readonly?: []|string[];
  excludeWhenSubmit?: []|string[];
  mapLists?: string[][];
  maps: IIndexObj;
  tableGroupCompType?: string;
  [index: string]: any;
}
export interface IPageConf {
  apiPath?:[]|string[];
  interfaceUrls?:IIndexObj;
  options: []|IOptions[];
  topBtn: []|string[];
  rowBtn: []|string[];
  enableAjax?: boolean;
  formStepConf?: []|[string,string,[]][];
  [index: string]: any;
}

export interface IIndexObj {
  [index: string]: any
}
export interface IIndexFnObj {
  [index: string]: Function
}

/**
 * 查找列表 list 中 键名为 key 且 键值为 val 的第一项
 * @param list 列表
 * @param key 用于删选的键名
 * @param val 用于删选的的键名的键值需要与之相等
 */
export function findEqualByKey(list: IIndexObj = [], key: string, val: any): any {
  // 获取列表中 key === val 的 那一项， 保证返回一个对象（可能导致问题（如果用于vue 监听 可能会出现问题）| 暂时保证返回一个对象更优），TODO
  return list.find((obj: IIndexObj) => obj[key] === val) || {};
}
/**
 * 删除列表 list 中 键名为 key 且 键值为 val 的项， 如果没有 则不处理
 * @param list 列表
 * @param key 用于筛选的字段名
 * @param val 用于筛选的的键名的键值需要与之相等
 */
export function deleteEqualByKey(list: any[], key: string, val: any){
  const index = list.findIndex((item: any) => item[key] === val);
  if (index !== -1) {
    list.splice(index, 1);
  }
}

/**
 * 替换列表 list 中 键名为 key 且 键值为 val 的项， 如果没有 则压人
 * @param list 列表
 * @param key 用于筛选的字段名
 * @param val 用于筛选的的键名的键值需要与之相等
 * @param replacer 用于替换的元素
 */
export function replaceEqualByKey(list: any[], key: string, val: any, replacer: any) {
  const index = list.findIndex((item: any) => item[key] === val);
  if (!key) {
    list.push(replacer)
  } else if (index !== -1) {
    list.splice(index, 1, replacer);
  } else if (replacer) {
    list.push(replacer)
  }
}
/**
 * 合并多个数组到一个新数组， 或者说有条件的数组去重降维
 * @param lists 需要合并的数组的集合
 * @param key 用于去重的字段名
 * @param result 存放结果的数组， 默认空数组
 */
export function concatListEqual(lists: [[] | IIndexObj[] | undefined], key: string, result: IIndexObj[] = []){
  lists.forEach((subLists: []|IIndexObj[]|undefined) => {
    subLists && subLists.forEach(item => {
      replaceEqualByKey(result, key, item[key], item)
    })
  })
  return result;
}
export class ListEqual{
  /**
   * 查找列表 list 中 键名为 key 且 键值为 val 的第一项
   * @param list 列表
   * @param key 用于删选的键名
   * @param val 用于删选的的键名的键值需要与之相等
   */
  public static find(list: IIndexObj = [], key: string, val: any):any {
    return findEqualByKey(list, key, val)
  }
  /**
   * 查找列表 list 中 键名为 key 且 键值为 val 的第一项
   * @param list 列表
   * @param val 用于删选的的键名的键值需要与之相等
   */
  public static findByKey(list: IIndexObj = [], val: any):any {
    return findEqualByKey(list, 'key', val)
  }

  /**
   * 删除列表 list 中 键名为 key 且 键值为 val 的项， 如果没有 则不处理
   * @param list 列表
   * @param key 用于筛选的字段名
   * @param val 用于筛选的的键名的键值需要与之相等
   */
  public static delete(list: any[], key: string, val: any) {
    return deleteEqualByKey(list, key, val);
  }

  /**
   * 删除列表 list 中 键名为 key 且 键值为 val 的项， 如果没有 则不处理
   * @param list 列表
   * @param val 用于筛选的的键名的键值需要与之相等
   */
  public static deleteByKey(list: any[], val: any) {
    return deleteEqualByKey(list, 'key', val);
  }

  /**
   * 替换列表 list 中 键名为 key 且 键值为 val 的项， 如果没有 则压人
   * @param list 列表
   * @param key 用于筛选的字段名
   * @param val 用于筛选的的键名的键值需要与之相等
   * @param replacer 用于替换的元素
   */
  public static replace(list: any[], key: string, val: any, replacer: any) {
    return replaceEqualByKey(list, key, val, replacer);
  }

  /**
   * 替换列表 list 中 键名为 key 且 键值为 val 的项， 如果没有 则压人
   * @param list 列表
   * @param val 用于筛选的的键名的键值需要与之相等
   * @param replacer 用于替换的元素
   */
  public static replaceByKey(list: any[], val: any, replacer: any) {
    return replaceEqualByKey(list, 'key', val, replacer);
  }
  /**
   * 合并多个数组到一个新数组， 或者说有条件的数组去重降维
   * @param lists 需要合并的数组的集合
   * @param key 用于合并的字段名
   * @param result 存放结果的数组， 默认空数组
   */
  public static concat(lists: [[]|IIndexObj[]|IOptions[]|undefined], key: string,result: IIndexObj[] = []) {
    return concatListEqual(lists,key, result)
  }
  /**
   * 合并多个数组到一个新数组， 或者说有条件的数组去重降维
   * @param lists 需要合并的数组的集合
   * @param result 存放结果的数组， 默认空数组
   */
  public static concatByKey(lists: [[]|IIndexObj[]|IOptions[]|undefined], result: IIndexObj[] = []) {
    return concatListEqual(lists,'key', result)
  }
}

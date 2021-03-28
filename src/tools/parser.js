const c_for = require('./c_for.js');
// 匹配 for 循环
// c-for=list:obj,index
const forReg = /c-for *=(.+) *: *(.*)(?: *, *(.*))/;
// tag.className c-if=express ((attrs)) content
const tagReg = /([a-zA-Z]+)(\.[a-zA-z][-_a-zA-z0-9]*)*(?: +c-if=({{.+?}}))*(?: *\(\((.*?)\)\))*( +.+)*/;
// {{express}}
const varReg = /{{(.+?)}}/;

function parseContent(temp) { // {{content}}
  while (varReg.test(temp)) temp = temp.replace(varReg, (a, b) => `\${${b}}`);
  return temp;
}

function parseIfContent(temp, successStr) { // c-if
  while (varReg.test(temp)) {
    temp = temp.replace(varReg, function (a, b) {
      return `\${(${b}) ? \`${successStr}\` : ''}`;
    })
  }
  return temp;
}

/**
 * 关闭所有未关闭的标签
 * @param stack 待关闭标签列表
 * @param currentTag 直到传入的标签的父级
 */
function closeAllTag(stack = [], currentTag) {
  let thisO = stack.pop();
  while (currentTag ? thisO && thisO.indent !== currentTag.indent - 1 : thisO) {
    thisO.fntext = (thisO.fntext || '').replace(/__slot__/, c_for(thisO.fnList, (item) => item()));
    thisO = stack.pop();
  }
  thisO && stack.push(thisO);
}

/**
 * 按行解析
 * 先顺序解析， 确定节点，及节点间关系。但此时并不能确定节点的内容。
 * 解析完成后在逆序确定节点内容
 */
function parser(temp, result = [], context) {
  try {
    const stack = [];
    const indentMap = {};
    let prevObj = null;
    while (temp) {
      temp = temp.replace(/.*\n/, function (a = '') {
        const val = a.split(/\/\//).shift().replace(/ *\n/, '');
        if (val) {
          const thisObj = {};
          val.replace(/^ */, (a) => (thisObj.indent = Math.ceil(a.length / 2)) && '');
          prevObj && (prevObj.fnList || (prevObj.fnList = [])); // 生成节点内容的方法合集；一个子代向里面压如一个方法。
          // thisObj.fntext 父级生成内容时依据该模板生成；__slot__ 子代的内容
          if (forReg.test(val)) { // c-for
            val.replace(forReg, function (fullStr, variable, subVariable, subIndex) {
              thisObj.fntext = `\${c_for(${variable}, (${subVariable}, ${subIndex}) => \`__slot__\`)}`;
            });
          } else if (tagReg.test(val)) {
            val.replace(tagReg, function (fullStr, tag, className = '', cIf = '', attrs = '', content = '') {
              className = className.replace(/^\./, '');
              const ifStr = parseContent(cIf); // c-if
              const fntext = `<${tag}${className ? ` class="${className}"` : ''} ${parseContent(attrs)}>${parseContent(content.replace(/^ /, ''))}__slot__</${tag}>`;
              thisObj.fntext = ifStr ? parseIfContent(cIf, fntext) : fntext;
            })
          }
          const parent = indentMap[thisObj.indent - 1];
          parent && parent.fnList.push(() => thisObj.fntext);
          result.push(thisObj);
          indentMap[thisObj.indent] = thisObj; // 便于查询父级。相同层级同时只会存在一个， 如果被替换， 则说明，上一个同层级的元素已经闭合
          prevObj = thisObj;
          stack.push(thisObj);
        }
        return '';
      });
    }
    closeAllTag(stack);
    return `(() => \`${c_for(result.filter(item => item.indent === 0), (item) => item.fntext)}\`)()`;
  } catch (e) {
    console.error(e)
  }
}

module.exports = parser;

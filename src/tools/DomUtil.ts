import {GetType} from "@/tools/GetType";

export class DomUtil {
  static getBothAncestor(sDom: Node, eDom: Node) {
    let sDom_: undefined | Node = sDom;
    let eDom_: undefined | Node = eDom;
    while (sDom_) {
      if (DomUtil.hasChild(sDom_, eDom)) {
        return sDom_;
      }
      // @ts-ignore;
      sDom_ = sDom_.parentNode;
    }
    while (eDom_) {
      if (DomUtil.hasChild(eDom_, sDom)) {
        return eDom_;
      }
      // @ts-ignore;
      eDom_ = eDom_.parentNode;
    }
    return undefined;
  }

  /**
   * 判断一个节点是否为空节点， 文本节点
   * @param node
   */
  static isEmptyTag(node: Node): boolean {
    if (node.nodeType === 1) {
      if (node.childNodes.length === 0) return true;
      return [...node.childNodes].every(i => DomUtil.isEmptyTag(i))
    } else if (node.nodeType === 3) {
      return !node.textContent;
    }
    return false;
  }

  static isSameTag(a: Node, b: Node): boolean {
    if (!(a && b)) return false;
    if (a.nodeType === 3 && b.nodeType === 3) {
      return true;
    }
    if (a.nodeType === 1 && b.nodeType === 1) {
      // @ts-ignore;
      return DomUtil.isTag(a, b.tagName);
    }
    return false;
  }

  /**
   * parentNode 的子孙中是否包含 child
   * @param parentNode
   * @param child
   */
  static hasChild(parentNode: Node, child: Node): boolean {
    const list = [...parentNode.childNodes];
    // @ts-ignore;
    return list.includes(child) || list.some(item => DomUtil.hasChild(item, child))
  }

  /**
   * 判断child 的祖先中是否包含 parentNode
   * @param parentNode
   * @param child
   */
  static isChildOf(parentNode: ParentNode, child: Node | null) {
    while (child) {
      if (child.parentNode === parentNode) return true;
      child = child.parentNode
    }
    return false;
  }

  static isAncestor(target: Node, dom: Node | null) {
    while (dom && dom.parentNode) {
      if (dom.parentNode === target) return true;
      // @ts-ignore;
      dom = dom.parentNode;
    }
    return false;
  }

  /**
   * 传入节点的父级中最近的指定标签的一项， 直到 ’根节点‘
   * @param node
   * @param targetTagNames
   * @param endAt 若传入该项， 则匹配到该项时会中断查找（此时不会返回值）
   */
  static findNearestTargetParentNodeByTag(node: Node | undefined | null, targetTagNames: string[] = [], endAt?: Node) {
    targetTagNames = targetTagNames.map(i => i.toLowerCase())
    while (node && !(endAt && node !== endAt)) {
      // @ts-ignore;
      const tagName = (node.tagName || '').toLowerCase();
      if (targetTagNames.includes(tagName)) {
        return node;
      }
      node = node.parentNode
    }
    return undefined;
  }

  /**
   * 替换 nodeName， 注意替换后，为新节点， 且原子节点均转移到新节点
   * @param node
   * @param tag
   */
  static changeTag(node: Node, tag: string) {
    const newNode = DomUtil.node(tag);
    [...node.childNodes].forEach(item => {
      newNode.appendChild(item)
    });
    DomUtil.replace(node, newNode);
    return newNode;
  }

  /**
   * 将节点从父节点中移除， 如果有父节点的话
   * @param dom
   */
  static remove(dom: Node) {
    dom.parentNode && dom.parentNode.removeChild(dom);
  }

  /**
   * 判断节点是否为指定标签类型
   * @param dom
   * @param tag
   */
  static isTag(dom: Node, tag: string = ''): boolean {
    return dom.nodeName.toLowerCase() === tag.toLowerCase();
  }

  /**
   * 判断父节点的节点
   * @param dom
   * @param targetType
   */
  static isParentNodeTheTargetType(dom: Node, targetType: string = '') {
    const parentNode = dom.parentNode;
    // @ts-ignore;
    return parentNode && parentNode.tagName.toLowerCase() === targetType.toLowerCase();
  }

  /**
   * 生成 tagName 的空标签
   * @param tagName
   * @param innerHTML
   */
  static node(tagName: string, innerHTML?: string) {
    const node = document.createElement(tagName);
    innerHTML && (node.innerHTML = innerHTML);
    return node;
  }

  /**
   *
   * @param node
   * @param className
   */
  static class(node: Node, className: string) {
    if (node) {
      // @ts-ignore;
      node.classList.contains(className) || node.classList.add(className);
    }
  }

  static removeClass(node: Node, className: string) {
    if (node) {
      // @ts-ignore;
      node.classList.contains(className) || node.classList.remove(className)
    }
  }

  /**
   * 生成文本节点
   * @param text
   */
  static text(text: string) {
    return document.createTextNode(text);
  }

  static list(list: { [index: string]: any }[], template: string) {
  }

  /**
   * 在之前插入， 如果有父节点的话
   * @param oldDom
   * @param newDom
   */
  static insertBefore(oldDom: Node, newDom: Node) {
    const parentNode = oldDom.parentNode;
    if (parentNode) {
      parentNode.insertBefore(newDom, oldDom)
    }
  }

  /**
   * 在最后插入子节点
   * @param parentNode
   * @param child
   */
  static append(parentNode: Node, child: Node): void;
  static append(parentNode: Node, childList: Node[]): void;
  static append(parentNode: Node, child: Node | Node[]) {
    if (GetType.isArray(child)) {
      // @ts-ignore;
      child.forEach((i: Node) => {
        parentNode.appendChild(i);
      })
    } else {
      // @ts-ignore;
      parentNode.appendChild(child);
    }

  }

  /**
   * 在开头插入子节点
   * @param parentNode
   * @param child
   */
  static prepend(parentNode: Node, child: Node) {
    const prev = parentNode.childNodes[0];
    if (prev) {
      DomUtil.insertBefore(prev, child)
    } else {
      parentNode.appendChild(child);
    }
  }

  /**
   * 在节点后插入， 如果有父节点的话
   * @param oldDom
   * @param newDom
   */
  static insertAfter(oldDom: Node, newDom: Node) {
    const parentNode = oldDom.parentNode;
    const nextSibling = oldDom.nextSibling;

    if (!parentNode) return;
    if (nextSibling) {
      parentNode.insertBefore(newDom, nextSibling)
    } else {
      parentNode.appendChild(newDom);
    }
  }

  /**
   * 替换节点， 如果有父节点的话
   * @param oldDom
   * @param newDom
   */
  static replace(oldDom: Node, newDom: Node) {
    const parentNode = oldDom.parentNode;
    if (parentNode) {
      parentNode.insertBefore(newDom, oldDom);
      parentNode.removeChild(oldDom);
    }
  }


  /**
   * 判断是否为标签节点
   * @param node
   */
  static isTagNode(node: Node) {
    return node.nodeType === 1
  }

  /**
   * 根据该节点的 tagName 生成新的同名标签, 忽略属性及子节点， 如传入 <p id="1"></p> => <p></p>
   * @param node
   */
  static copyEmptyTagNode(node: Node): Node {
    if (!DomUtil.isTagNode(node)) return DomUtil.text('');
    // @ts-ignore;
    return DomUtil.node(node.tagName);
  }

  /**
   * 递归查找第一个节点的文本节点，（如果首子节点为标签节点， 则递归查找其首子节点）
   * @param dom
   */
  static findFirstTextNode(dom: Node | undefined) {
    while (dom && dom.nodeType === 1) {
      if (dom.nodeType === 1) {
        return dom
      }
      dom = dom.childNodes[0]
    }

    return undefined;
  }

  /**
   * 递归查找第后一个节点的文本节点，（如果末子节点为标签节点， 则递归查找其末子节点）
   * @param dom
   */
  static findLastTextNode(dom: Node | undefined) {
    while (dom && dom.nodeType === 1) {
      if (dom.nodeType === 1) {
        return dom
      }
      dom = dom.childNodes[dom.childNodes.length - 1]
    }

    return undefined;
  }


  /**
   * 请文本拆分成三份， 中间的五部分未原来的节点
   * @param textNode
   * @param start
   * @param end
   */
  static splitTextNode(textNode: Node, start: number | undefined, end: number | undefined) {
    const textContent = textNode.textContent || '';
    const start_ = textContent.slice(0, start || 0);
    const mid_ = textContent.slice(start || 0, end || undefined);
    const end_ = textContent.slice(end || textContent.length);
    const sDom = start_ && DomUtil.text(start_);
    const eDom = end_ && DomUtil.text(end_);

    sDom && DomUtil.insertBefore(textNode, sDom);
    textNode.nodeValue = mid_;
    eDom && DomUtil.insertAfter(textNode, eDom);
    return [sDom, textNode, eDom];
  }
}


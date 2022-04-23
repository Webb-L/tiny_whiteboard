import { keyMap } from "./utils/keyMap";

// 快捷按键、命令处理类
export default class KeyCommand {
  constructor(app) {
    this.app = app;
    this.shortcutMap = {
      //Enter: [fn]
    };
    this.bindEvent();
  }

  // 绑定事件
  bindEvent() {
    window.addEventListener("keydown", (e) => {
      Object.keys(this.shortcutMap).forEach((key) => {
        if (this.checkKey(e, key)) {
          e.stopPropagation();
          e.preventDefault();
          this.shortcutMap[key].forEach((f) => {
            f.fn.call(f.ctx);
          });
        }
      });
    });
  }

  // 检查键值是否符合
  checkKey(e, key) {
    let o = this.getOriginEventCodeArr(e);
    let k = this.getKeyCodeArr(key);
    if (o.length !== k.length) {
      return false;
    }
    for (let i = 0; i < o.length; i++) {
      let index = k.findIndex((item) => {
        return item === o[i];
      });
      if (index === -1) {
        return false;
      } else {
        k.splice(index, 1);
      }
    }
    return true;
  }

  // 获取事件对象里的键值数组
  getOriginEventCodeArr(e) {
    let arr = [];
    if (e.ctrlKey || e.metaKey) {
      arr.push(keyMap["Control"]);
    }
    if (e.altKey) {
      arr.push(keyMap["Alt"]);
    }
    if (e.shiftKey) {
      arr.push(keyMap["Shift"]);
    }
    if (!arr.includes(e.keyCode)) {
      arr.push(e.keyCode);
    }
    return arr;
  }

  // 获取快捷键对应的键值数组
  getKeyCodeArr(key) {
    let keyArr = key.split(/\s*\+\s*/);
    let arr = [];
    keyArr.forEach((item) => {
      arr.push(keyMap[item]);
    });
    return arr;
  }

  /**
   * 添加快捷键命令
   * Enter
   * Tab | Insert
   * Shift + a
   */
  addShortcut(key, fn, ctx) {
    key.split(/\s*\|\s*/).forEach((item) => {
      if (this.shortcutMap[item]) {
        this.shortcutMap[item].push({
          fn,
          ctx,
        });
      } else {
        this.shortcutMap[item] = [
          {
            fn,
            ctx,
          },
        ];
      }
    });
  }

  // 移除快捷键命令
  removeShortcut(key, fn) {
    key.split(/\s*\|\s*/).forEach((item) => {
      if (this.shortcutMap[item]) {
        if (fn) {
          let index = this.shortcutMap[item].findIndex((f) => {
            return f.fn === fn;
          });
          if (index !== -1) {
            this.shortcutMap[item].splice(index, 1);
          }
        } else {
          this.shortcutMap[item] = [];
          delete this.shortcutMap[item];
        }
      }
    });
  }
}
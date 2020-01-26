const 是否 = { // text inter-representation
    from: (p) => p? "是":"否",
    to: (v) => (v!="否")? true : false
};
function pTime(str) {
    let date = new Date(str);
    return date.toLocaleString();
}

function id(id) { return document.getElementById(id); }
function waitsElement(e, op) {
  const isLoaded = rs => rs == "complete";
  if (e === document.body) {
    if (isLoaded(document.readyState)) return op();
    else document.addEventListener("DOMContentLoaded", op);
  } else {
    e.addEventListener("load", op);
  }
}
function persist(e) {
    waitsElement(document.body, _ev => { if (e.id in localStorage) e.value = localStorage.getItem(e.id); });
    e.oninput = _ev => { localStorage.setItem(e.id, e.value); }
}

Array.prototype.singleOrNull = function() {
    return (this.length == 1)?  this[0] : null;
}

//// PART II

function* filterData(keys, records) {
    // n, m (row, col) map order
    for (let record of records) yield keys.map(k => {
        if (k == "createdAt" || k == "updatedAt") {
            return record[k];
        } else {
            return record.attributes[k];
        }
    });
}
function* translateBy(map, xs) {
    if (! (map instanceof Map)) map = new Map(Object.entries(map));
    for (let x of xs) { yield map.get(x); }
}
function asIterator(x) {
    return x[Symbol.iterator]();
}
function* zipWith(ys, xs) {
    xs = asIterator(xs); ys = asIterator(ys);
    let x, y;
    while ( !(x = xs.next()).done && !(y = ys.next()).done ) {
        yield [x.value, y.value];
    }
}

function element(tagName, init, ...children) {
    let e = document.createElement(tagName); init(e);
    for (child of children) e.appendChild(child);
    return e;
}
const withDefaults = e => {};
const withText = text => e => { e.innerText = text; };

HTMLElement.prototype.removeAllChild = function() {
    while (this.firstChild) { this.removeChild(this.firstChild); }
};

//// Captcha verify():Boolean
class AppCaptcha {
    constructor() {
        this.expr = [...genMathExpr(3)].join("");
    }
    verify() {
        let answer = window.prompt(`请输入 ${this.expr} 的结果`);
        if (answer == null) return null;
        else return Number.parseInt(answer) == eval(this.expr); //TODO compat
    }
}
function randomPick(xs) {
    return xs[Math.floor(xs.length * Math.random())];
};
function* genMathExpr(len) { len = len - 1;
    const atomNum = "123456789".split("");
    const op = "+-*".split("");
    function* genAtomNum() {
        const nDigit = [1, 2];
        for (let _t=0; _t<randomPick(nDigit); _t++)
            { yield randomPick(atomNum); }
    }
    yield* genAtomNum(); //first term "len-1"
    for (let _t=0; _t<len; _t++) {
        yield randomPick(op);
        yield* genAtomNum();
    }
}

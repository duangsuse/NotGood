function getData() {
    return { place: place.value, name: name.value, status: 是否.to(status.value) };
}
async function runSubmit(data) {
    let {place, name, status} = data;
    let defaultD = await findInPlace(place, name);
    let d = defaultD.singleOrNull() || new DataList();
    d.set("place", place); d.set("name", name); d.set("status", status);
    return d.save();
}
function alertChanges(submit_res) {
    const r = submit_res; console.log(r)
    if (r._changing) {
        alert(`${pTime(r.updatedAt)} ${JSON.stringify(r.changed)}`);
    } else {
        alert(`${pTime(r.createdAt)} ${DataList.show(r.attributes)}`);
    }
}

//// PART II

const jsonConv = {
    from: JSON.parse,
    to: JSON.stringify
};
const csvConv = {
    to: xs => xs.map(row => row.join(",")).join("\n")
};

const keyTranslate = {
    位置: "place", 学生: "name", 状态: "status",
    创建时间: "createdAt", 更新时间: "updatedAt"
};
function getFilterKeys() {
    let fmtList = listFmt.value.split(" ");
    let keys = [...translateBy(keyTranslate, fmtList)];
    return keys;
}
function runRefresh(records) {
    let keys = getFilterKeys();
    let rows = [...filterData(keys, records)]; console.log(rows)
    list.removeAllChild();
    list.appendChild(element("thead", withDefaults,
    ...keys.map(k =>
        element("td", withText(k))
    )));
    let shownRows = rows.map(row => [...zipWith(keys, row)].map(vc => { let [v, name] = vc;
        switch (name) {
            case "status": return 是否.from(v);
            case "createdAt": case "updatedAt": return pTime(v);
            case undefined: return "未知";
            default: return v.toString();
        }
    }));
    list.appendChild(element("tbody", withDefaults,
        ...shownRows.map(row => element("tr", withDefaults,
                ...row.map( col => element("td", withText(col)) )
            )
        )
    ));
}

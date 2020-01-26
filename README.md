---
title: 健康状况名单
author: duangsus
---

# 健康状况名单

> 您提交的数据由 [LeanCloud](https://leancloud.cn) 存储，所有人可修改。如有冒改请在更安全的平台重新声明。

## 修改

位置：<input id="place" placeholder="列表的名字" value="襄阳 八中 高三 8班" />

<input id="name" placeholder="名字" />
<select id="status">
<option>否</option>
<option>是</option></select> <button id="do-submit">更新</button> <button id="do-destroy">删除</button>

<script src="https://cdn.jsdelivr.net/npm/superagent"></script>
<script src="//cdn.jsdelivr.net/npm/leancloud-storage@4.2/dist/av-min.js"></script>

<script>
//MultiMap<PlaceID, Map<StudendID, Boolean>>
const { Object: AVObject, Query } = AV;
let leanCfg = {
    appId: "vrkHiVb84rpKhuvE30mNpJ9n-gzGzoHsz",
    appKey: "i1EcieJLk84iKlEQ1zWuBtFC",
    serverURLs: "https://vrkhivb8.lc-cn-n1-shared.com" };
AV.init(leanCfg);

const kDataList = "DataList";
const DataList = AVObject.extend(kDataList);
DataList.show = function(o) {
    return `位置：${o.place}、名：${o.name}、状态：${是否.from(o.status)}`;
};

function findInPlace(place, name) {
    let q = new Query(kDataList);
    q.equalTo("place", place); q.equalTo("name", name);
    return q.find();
}
function findAllInPlace(place) {
    let q = new Query(kDataList);
    q.equalTo("place", place);
    return q.find();
}
</script>

<script src="lib.js"></script>

<script>
const
    place = id("place"),
    name = id("name"),
    status = id("status");
[place, name, status].forEach(persist);
const
    doSubmit = id("do-submit"),
    doDestroy = id("do-destroy");

async function runSubmit(data) {
    let {place, name, status} = data;
    let defaultD = await findInPlace(place, name);
    let d = defaultD.singleOrNull() || new DataList();
    d.set("place", place); d.set("name", name); d.set("status", status);
    return d.save();
}
function getData() {
    return { place: place.value, name: name.value, status: 是否.to(status.value) };
}
doSubmit.onclick = () => {
    runSubmit(getData()).then(alertChanges).catch(alert);
};
doDestroy.onclick = async () => {
    let {place, name} = getData();
    let record = await findInPlace(place, name);
    record.singleOrNull().destroy().catch(alert); //TODO null propga
};
function alertChanges(submit_res) {
    const r = submit_res; console.log(r)
    if (r._changing) {
        alert(`${pTime(r.updatedAt)} ${JSON.stringify(r.changed)}`);
    } else {
        alert(`${pTime(r.createdAt)} ${DataList.show(r.attributes)}`);
    }
}
</script>

## 列表 <button id="do-refresh">刷新</button>

> 可选显示：`位置`、`学生`、`状态`、`创建时间`、`更新时间`

<input id="list-fmt" value="学生 状态" />

<table id="list">
</table>

<script>
const
    listFmt = id("list-fmt"),
    list = id("list"),
    doRefresh = id("do-refresh");

const keyTranslate = {
    位置: "place", 学生: "name", 状态: "status",
    创建时间: "createdAt", 更新时间: "updatedAt"
};

async function runRefresh() {
    let all = await findAllInPlace(place.value); console.log(all)
    let keys = [...translateBy(keyTranslate, listFmt.value.split(" "))];
    list.removeAllChild();
    list.appendChild(element("thead", withDefaults,
    ...keys.map(k =>
        element("td", withText(k))
    )));
    let rows = [...filterData(keys, all)]; console.log(rows)
    let showRows = rows.map(row => [...zipWith(keys, row)].map(vc => { let [v, name] = vc;
        switch (name) {
            case "status": return 是否.from(v);
            case "createdAt": case "updatedAt": return pTime(v);
            default: return v.toString();
        }
    }));
    list.appendChild(element("tbody", withDefaults,
        ...showRows.map(row => element("tr", withDefaults,
                ...row.map( col => element("td", withText(col)) )
            )
        )
    ));
}
doRefresh.onclick = runRefresh;
</script>

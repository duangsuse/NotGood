---
title: 健康状况名单
author: duangsuse
---

# 健康状况名单

> 您提交的数据由 [LeanCloud](https://leancloud.cn) 存储，所有人可修改。如有冒改请在更安全的平台重新声明。

## 修改

位置：<input id="place" placeholder="列表的名字" value="襄阳 八中 高三 8班" />

<input id="name" placeholder="名字" />
<select id="status">
<option>否</option>
<option>是</option></select> <button id="do-submit">更新</button> <button id="do-destroy">删除</button>

<script src="//cdn.jsdelivr.net/npm/leancloud-storage@4.2/dist/av-min.js"></script>

<script src="app_model.js"></script>

<script src="lib.js"></script>
<script src="app.js"></script>

<script>
const
    place = id("place"),
    name = id("name"), status = id("status");
[place, name, status].forEach(persist);
const
    doSubmit = id("do-submit"),
    doDestroy = id("do-destroy");

doSubmit.onclick = () => {
    runSubmit(getData())
    .then(alertChanges).catch(alert);
};
doDestroy.onclick = async () => {
    let challenge = new AppCaptcha();
    if (!await challenge.verify()) return;
    let {place, name} = getData();
    let record = await findInPlace(place, name);
    record.forEach(it => it.destroy()
    .then(r => alert(`已删除 ${DataList.show(r.attributes)}`)).catch(alert) ); //TODO null propga
};
</script>

## 列表 <button id="do-refresh">刷新</button>

> 可选显示：`位置`、`学生`、`状态`、`创建时间`、`更新时间`

<input id="list-fmt" placeholder="显示项目" value="学生 状态" />

> 导入/导出：<button id="do-export-csv">导出CSV</button> <button id="do-export-json">导出JSON</button> <button id="do-import-json">导入JSON</button>

<textarea id="export-data"></textarea>

<table id="list"></table>

<script>
const
    listFmt = id("list-fmt"),
    list = id("list"),
    exportData = id("export-data");
const
    doRefresh = id("do-refresh"),
    doExportCSV = id("do-export-csv"),
    doExportJSON = id("do-export-json"),
    doImportJSON = id("do-import-json");

doRefresh.onclick = async () => {
    let all = await findAllInPlace(place.value); console.log(all)
    let plainRecords = all.map(mergeAVObject);
    runRefresh(plainRecords);
};

let exportDataGetset = [
    () => exportData.textContent,
    v => { exportData.textContent = v }
];
let tableGetset = [
    () => [...list.querySelector("tbody").children].map(tr =>
        [...tr.children].map(td => td.innerText)),
    v => {
        let filterKeys = getFilterKeys();
        runRefresh( [...v.map(row => {
            let converted = [...zipWith(row, filterKeys)].map(vc => { let [v, name] = vc;
                switch (name) {
                    case "status": return 是否.to(v);
                    case "createdAt": case "updatedAt": return new Date(v);
                    case "未知": return undefined;
                    default: return v;
                }
            });
            return Object.fromEntries(converted);
            })
        ] );
    }
];
enableDataConvert(exportDataGetset, tableGetset,
    [jsonConv, [doImportJSON, doExportJSON]],
    [csvConv, [null, doExportCSV]]);
</script>

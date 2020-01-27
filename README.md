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

<input id="list-fmt" placeholder="显示项目" value="学生 状态 更新时间" />

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

let lastRecords; //last records

const csvConv = {
    to: xs => xs.map(it => Object.values(it)).map(row => row.join(",")).join("\n")
};

doRefresh.onclick = async () => {
    let all = await findAllInPlace(place.value); console.log(all)
    let plainRecords = all.map(mergeAVObject);
    lastRecords = plainRecords;
    runRefresh(plainRecords);
};

let exportDataGetset = [
    () => exportData.value,
    v => { exportData.value = v }
];
let tableGetset = [
    () => lastRecords,
    v => runRefresh(v)
];
enableDataConvert(exportDataGetset, tableGetset,
    [jsonConv, [doImportJSON, doExportJSON]],
    [csvConv, [null, doExportCSV]]);
</script>

> 方便 Microsoft Excel 粘贴一列使用的导出方法

还请修改 <a href="#list-fmt">这个</a> 列表格式，再进行刷新。

+ 改为 `学生` 可复制多行学生姓名
+ 改为 `状态` 可复制多行学生状态

在 Excel 里，选择一列，粘贴复制到的多行信息即可批量输入数据。

## 直方统计

<div id="div-histogram">点我刷新</div>

<script>
const
    divHistogram = id("div-histogram");
divHistogram.onclick = () => {
    let hist = histogram(lastRecords, it => it.status);
    divHistogram.innerText = `共有 ${hist.get(false).length} 人正常、${hist.get(true).length} 人有异常\n`;
    let lesser = minBy(it => it[VAL].length, ...hist)[VAL];
    divHistogram.innerText += `人名：${lesser.map(it => it.name).join("、")}`;
};
</script>

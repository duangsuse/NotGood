//Map<PlaceID, Map<StudendID, Boolean>>
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

//map[place][name]
function findInPlace(place, name) {
    let q = new Query(kDataList);
    q.equalTo("place", place); q.equalTo("name", name);
    return q.find();
}
//map[place].entries()
function findAllInPlace(place) {
    let q = new Query(kDataList);
    q.equalTo("place", place);
    return q.find();
}

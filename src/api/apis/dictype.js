import { get , post , postJson} from "../axios"

// 添加字典接口
export function addDictype(params) {
    return postJson("/dictype/save", params);
}

// 删除字典接口
export function deleteDictype(params) {
    return post("/dictype/deleteByIds", params);
}

// 修改字典接口
export function updateDictype(params) {
    return postJson("/dictype/update", params);
}

// 更新字典有效性接口
export function updateDictypeUseful(params) {
    return post("/dictype/updateUsefulByIds", params);
}

// 获取字典列表接口
export function getDictypeList(params) {
    return post("/dictype/list", params);
}

// 分页字典列表接口
export function getDictypePage(params) {
    return post("/dictype/page", params);
}
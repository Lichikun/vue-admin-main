import { get , post , postJson} from "../axios"
// 添加宠物接口
export function addPet(params) {
    return postJson("/pets/save", params);
}

// 删除宠物接口
export function deletePet(params) {
    return post("/pets/deleteByIds", params);
}

// 修改宠物接口
export function updatePet(params) {
    return postJson("/pets/update", params);
}

// 更新宠物有效性接口
export function updatePetUseful(params) {
    return post("/pets/updateUsefulByIds", params);
}

// 获取宠物列表接口
export function getPetList(params) {
    return post("/pets/list", params);
}

// 分页宠物列表接口
export function getPetPage(params) {
    return post("/pets/page", params);
}

// 获得宠物资源接口
export function getPetFile(params) {
    return post("/pets/getPetFile", params);
}

// 获得宠物资源接口
export function getVedioFile(params) {
    return post("/pets/getVideoFile", params);
}
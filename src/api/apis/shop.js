import {get, post, postJson } from "../axios"
// 添加商店接口
export function addShop(params) {
    return postJson("/shop/save", params);
}

// 删除商店接口
export function deleteShop(params) {
    return post("/shop/deleteByIds", params);
}

// 修改商店接口
export function updateShop(params) {
    return postJson("/shop/update", params);
}

// 更新商店有效性接口
export function updateShopUseful(params) {
    return post("/shop/updateUsefulByIds", params);
}

// 获取商店列表接口
export function getShopList(params) {
    return post("/shop/listShop", params);
}

// 分页商店列表接口
export function getShopPage(params) {
    return post("/shop/page", params);
}

// 获取商店数量
export function getShopNum(params) {
    return post("/shop/num", params);
}
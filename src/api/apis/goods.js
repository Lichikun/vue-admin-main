import { get, post, postJson } from "../axios";

// 添加商品接口
export function addGoods(params) {
  return postJson("/goods/save", params);
}

// 删除商品接口
export function deleteGoods(params) {
  return post("/goods/deleteByIds", params);
}

// 修改商品接口
export function updateGoods(params) {
  return postJson("/goods/update", params);
}

// 更新商品有效性接口
export function updateGoodsUseful(params) {
  return post("/goods/updateUsefulByIds", params);
}

// 获取商品列表接口
export function getGoodsList(params) {
  return post("/goods/list", params);
}

// 分页商品列表接口
export function getGoodsPage(params) {
  return post("/goods/page", params);
}

// 获得商品资源接口
export function getGoodsFile(params) {
  return post("/goods/getGoodFile", params);
}

// 获得商品资源接口
export function getGoodsVideoFile(params) {
  return post("/goods/getGoodVideoFile", params);
}
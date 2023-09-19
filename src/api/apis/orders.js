import { get , post , postJson} from "../axios"

// 添加订单接口
export function addOrder(params) {
    return postJson("/orders/save", params);
}

// 删除订单接口
export function deleteOrder(params) {
    return post("/orders/deleteByIds", params);
}

// 修改订单接口
export function updateOrder(params) {
    return postJson("/orders/update", params);
}

// 更新订单有效性接口
export function updateOrderUseful(params) {
    return post("/orders/updateUsefulByIds", params);
}

// 获取订单列表接口
export function getOrderList(params) {
    return post("/orders/list", params);
}

// 分页订单列表接口
export function getOrderPage(params) {
    return post("/orders/page", params);
}

// 获得订单资源接口
export function getOrderFile(params) {
    return post("/orders/getOrderFile", params);
}

// 获得订单资源接口
export function getVideoFile(params) {
    return post("/orders/getVideoFile", params);
}

// 获得单个订单接口
export function getOneOrders(params) {
    return post("/orders/getOneOrders", params);
}

// 获得全部订单接口
export function getAllOrders(params) {
    return post("/orders/getAllOrders_back", params);
}
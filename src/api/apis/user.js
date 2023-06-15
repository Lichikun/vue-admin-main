import { get , post , postJson} from "../axios"
//用户登入
export function loginUser(params) {
    return postJson("/user/login", params);
}

// 添加用户接口
export function addUser(params) {
    return postJson("/user/save", params);
}

// 删除用户接口
export function deleteUser(params) {
    return post("/user/deleteByIds", params);
}

// 修改用户接口
export function updateUser(params) {
    return postJson("/user/update", params);
}

// 更新用户有效性接口
export function updateUserUseful(params) {
    return post("/user/updateUsefulByIds", params);
}

// 获取用户列表接口
export function getUserList(params) {
    return post("/user/list", params);
}

// 分页用户列表接口
export function getUserPage(params) {
    return post("/user/page", params);
}
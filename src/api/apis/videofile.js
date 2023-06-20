import { get , post , postJson , postImg} from "../axios"

// 删除图片接口
export function deleteVideo(params) {
    return post("/videofile/deleteByIds", params);
}

// 添加图片接口
export function addVideo(params) {
    return postJson("/videofile/save", params);
    }

    // 添加图片接口
export function getVideoList(params) {
    return postJson("/videofile/list", params);
    }
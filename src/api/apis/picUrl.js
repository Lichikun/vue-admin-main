const pictureurl="http://8.130.122.169:8686/upload/"
const local = "http://localhost:8686/upload/"

import { get , post , postJson , postImg} from "../axios"
// 添加图片接口
export function addPicture(params) {
return postJson("/picture/save", params);
}

// 删除图片接口
export function deletePicture(params) {
return post("/picture/deleteByIds", params);
}

// 修改图片接口
export function updatePicture(params) {
return postJson("/picture/update", params);
}

// 更新图片有效性接口
export function updatePictureUseful(params) {
return post("/picture/updateUsefulByIds", params);
}

// 获取图片列表接口
export function getPictureList(params) {
return post("/picture/list", params);
}

// 分页图片列表接口
export function getPicturePage(params) {
return post("/picture/page", params);
}

//上传avatar
export function uploadAvatar(params){
	return postImg("/picture/uploadAvatar",params)
}   

// 上传carousel接口
export function uploadCarousel(params){
	return postImg("/picture/uploadCarousel",params)
}

// 上传goods接口
export function uploadGoods(params){
	return postImg("/picture/uploadGoods",params)
}

// 上传pet接口
export function uploadPet(params){
	return postImg("/picture/uploadPet",params)
}

// 上传shopp接口
export function uploadShop(params){
	return postImg("/picture/uploadShop",params)
}

export default{
	pictureurl,
}
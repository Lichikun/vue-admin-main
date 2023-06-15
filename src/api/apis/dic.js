import { get , post , postJson} from "../axios"

// 添加字典接口
export function addDic(params) {
    return postJson("/dic/save", params);
  }
  
  // 删除字典接口
  export function deleteDic(params) {
    return post("/dic/deleteByIds", params);
  }
  
  // 修改字典接口
  export function updateDic(params) {
    return postJson("/dic/update", params);
  }
  
  // 更新字典有效性接口
  export function updateDicUseful(params) {
    return post("/dic/updateUsefulByIds", params);
  }
  
  // 获取字典列表接口
  export function getDicList(params) {
    return post("/dic/list", params);
  }

  // 分页字典列表接口
  export function getDicPage(params) {
    return post("/dic/page", params);
  }
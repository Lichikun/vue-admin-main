import Axios from "axios";
import qs from "qs"
// 创建axios实例
const instance = Axios.create({
//baseURL: 'http://8.130.122.169:8088/petShop',
baseURL: 'http://localhost:8088/petShop',
timeout: 5000,
headers: {
    'Content-Type': 'application/json'
}
})

// 添加请求拦截器
instance.interceptors.request.use(config => {
// 在发送请求之前做些什么
    if(localStorage.getItem('token'))
        config.headers.Authorization = localStorage.getItem('token');
    return config
    }, error => {
    // 对请求错误做些什么
    return Promise.reject(error)
})

// 添加响应拦截器
instance.interceptors.response.use(response => {
    // 对响应数据做点什么
    return response.data
    }, error => {
    // 对响应错误做点什么
    return Promise.reject(error)
})

// 封装get请求
export function get(url, params) {
    return instance.get(url, {
        params
    })
}

// 封装post请求
export function post(url, params) {
    return instance({
        method:'post',
        url:`${url}`,
        params: params,
        transformRequest:[function(data){
            return qs.stringify(data,{allowDots:true})
        }],
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    })
}

// 封装post json请求
export function postJson(url, data) {
    return instance.post(url, data, {
        headers: {
        'Content-Type': 'application/json'
        }
    })
}

export function postImg(url,params){
    return instance({
        method: 'post',
          url: `${url}`,
          data: params,
          headers: {
            'Content-Type': 'multipart/from-data',
          }
    })
}
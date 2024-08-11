import request from '/@/utils/request'
// 查询行政区域省市区县列表
export function getList(query:Object) {
  return request({
    url: '/api/v1/base/region/list',
    method: 'get',
    params: query
  })
}
// 查询行政区域省市区县详细
export function getRegion(id:number) {
  return request({
    url: '/api/v1/base/region/info',
    method: 'get',
    params: {
     id: id
    }
  })
}
// 新增行政区域省市区县
export function addRegion(data:Object) {
  return request({
    url: '/api/v1/base/region/add',
    method: 'post',
    data: data
  })
}
// 修改行政区域省市区县
export function editRegion(data:Object) {
  return request({
    url: '/api/v1/base/region/edit',
    method: 'put',
    data: data
  })
}
// 删除行政区域省市区县
export function deleteRegion(ids:number[]) {
  return request({
    url: '/api/v1/base/region/delete',
    method: 'delete',
    data:{
       ids:ids
    }
  })
}
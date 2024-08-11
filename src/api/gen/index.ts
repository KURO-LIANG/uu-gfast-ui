import request from '/@/utils/request';

// 查询生成表数据
export function listTable(query:Object) {
  return request({
    url: '/api/v1/tools/gen/tableList',
    method: 'get',
    params: query
  })
}
// 查询db数据库列表
export function listDbTable(query:Object) {
  return request({
    url: '/api/v1/tools/gen/dataList',
    method: 'get',
    params: query
  })
}

// 查询表详细信息
export function getGenTable(tableId:number) {
  return request({
    url: '/api/v1/tools/gen/columnList?tableId=' + tableId,
    method: 'get'
  })
}

//查询用于选择的关联表信息
export function getRelationTable() {
  return request({
    url: '/api/v1/tools/gen/relationTable',
    method: 'get'
  })
}

// 修改代码生成信息
export function updateGenTable(data:Object) {
  return request({
    url: '/api/v1/tools/gen/editSave',
    method: 'put',
    data: data
  })
}

// 导入表
export function importTable(data:Object) {
  return request({
    url: '/api/v1/tools/gen/importTableSave',
    method: 'post',
    params: data
  })
}
// 预览生成代码
export function previewTable(tableId:number) {
  return request({
    url: '/api/v1/tools/gen/preview?tableId=' + tableId,
    method: 'get'
  })
}
// 删除表数据
export function delTable(tableId:number[]) {
  return request({
    url: '/api/v1/tools/gen/delete',
    method: 'delete',
    data:{ids:tableId}
  })
}


// 生成代码
export function batchGenCode(tableIds:number[]){
  return request({
    url: '/api/v1/tools/gen/batchGenCode',
    method: 'put',
    data:{ids:tableIds}
  })
}


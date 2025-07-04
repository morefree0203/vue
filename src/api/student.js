import request from '@/utils/request'

export const pageSearch = async({pageNum ,pageSize,query})=>{
   const res = await request({
    url: '/student/page',
    method: 'post',
    data: {pageNum,pageSize,query}
   })
   return res.data
}


export const add = async(addData)=>{
   const res = await request({
    url: '/student',
    method: 'post',
    data: addData
   })
   return res.data.records
}

export const remove = async(id)=>{
  const res = await request({
   url: '/student/'+id,
   method: 'delete',
  })
  return res.data.records
}

export const update = async(updateData)=>{
  const res = await request({
   url: '/student',
   method: 'put',
   data: updateData
  })
  return res.data.records
}

import request from '@/utils/request'
import { Loading } from 'element-ui';

export const post = (url,data) => {
	return  request({
        url:url,
        method: 'post',
        data
    })
}

export const get = (url,data) => {
	return  request({
        url:url,
        method: 'get',
        params: data
    })
}

export const fileupload = (url,data) =>{

    return request({
        headers: {
            'Content-Type': 'multipart/form-data'
        },
        method:'post',
        url:url,
        data
    })
}


export const filedownload = (url,realfilename,data) =>{
    const loading = Loading.service({
        lock: true,
        text: '正在导出中，请耐心等候',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      });

    request({
        headers :{
            responseType: 'blob'
        },
        method:'post',
        url:url,
        data,
        responseType:'blob',
        timeout:1800000
    }).then(resp => {
        const content = resp
        const blob = new Blob([content])
        let curday = new Date()
		let curdaystr = curday.format("yyyy-MM-dd-hh-mm-ss")
        const fileName = `${realfilename}${curdaystr}.xlsx`
        if ('download' in document.createElement('a')) {
          const elink = document.createElement('a')
          elink.download = fileName
          elink.style.display = 'none'
          elink.href = URL.createObjectURL(blob)
          document.body.appendChild(elink)
          elink.click()
          URL.revokeObjectURL(elink.href)
          document.body.removeChild(elink)
        } else {
          navigator.msSaveBlob(blob, fileName)
        }
        loading.close()
    })
}



export default {
    post,
    get,
    fileupload,
    filedownload
}
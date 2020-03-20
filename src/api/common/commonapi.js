import request from '@/utils/request'

export const post = (url,data) => {
	return  request({
        url:url,
        method: 'post',
        data
    })
}



export default {
	post
}

//videopreview模块接口

import base from './base' // 导入接口域名列表
import axios from './http' // 导入http中创建的axios实例

const videopreview = {
    //获取视频列表函数
    videoList(off, cnt) {
        return axios.get(base.base.videopreview + '?off=' + off + '&cnt=' + cnt)
    },
    //添加视频
    addVideo(name, forward, areaid = '0') {
        let names = encodeURIComponent(name);
        return axios.post(base.base.videopreview + '?name=' + names + '&forward=' + forward + '&areaid=' + areaid)
    },
    //修改视频
    trueEditVideo(stream, name, forward, areaid = '0') {
        let names = encodeURIComponent(name);
        return axios.post(base.base.videopreview + '/attr?stream=' + stream + '&name=' + names + '&forward=' + forward + '&areaid=' + areaid)
    },
    //获取推流流地址
    postUrl(stream) {
        return axios.get(base.base.videopreview + '/url?stream=' + stream)
    },
    //获取flv流地址
    getFlvUrl(stream, id) {
        return axios.get(base.base.videopreview + '/url?stream=' + stream + '&id=' + id + '&flv=1')
    },
    //获取hls流地址
    getHlsUrl(stream) {
        return axios.get(base.base.videopreview + '/url?stream=' + stream + '&hls=1')
    },
    //删除视频
    delectVideo(stream) {
        return axios.delete(base.base.videopreview + '?stream=' + stream)
    },
    //获取视频流授权客户端
    getClient(stream) {
        return axios.get(base.base.videopreview + '/client?stream=' + stream)
    }

}


export default videopreview

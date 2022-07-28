
//broadcast模块接口

import base from './base' // 导入接口域名列表
import axios from './http' // 导入http中创建的axios实例

const broadcast ={
	//物联任务列表
	loadTask(method, off, cnt){
        return axios.get(base.base.controltask+'?method='+method+'&off='+off+'&cnt='+cnt)
   },
   //启用、禁用任务、单次运行
   taskEnable(id,method){
   		return axios.put(base.base.controltask+'?id='+id+'&method='+method)
   },
   //删除任务
   taskDelete(id){
   		return axios.delete(base.base.controltask+'?id='+id)
   }
}


export default broadcast

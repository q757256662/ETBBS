/**
 * Created by jiachenpan on 16/11/18.
 */

export function parseTime(time, cFormat) {
  if (arguments.length === 0) {
    return null
  }
  const format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}'
  let date
  if (typeof time === 'object') {
    date = time
  } else {
    if (('' + time).length === 10) time = parseInt(time) * 1000
    date = new Date(time)
  }
  const formatObj = {
    y: date.getFullYear(),
    m: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    i: date.getMinutes(),
    s: date.getSeconds(),
    a: date.getDay()
  }
  const time_str = format.replace(/{(y|m|d|h|i|s|a)+}/g, (result, key) => {
    let value = formatObj[key]
    if (key === 'a') return ['一', '二', '三', '四', '五', '六', '日'][value - 1]
    if (result.length > 0 && value < 10) {
      value = '0' + value
    }
    return value || 0
  })
  return time_str
}

function dateFtt(fmt,time)   
{ //author: meizz   
  const date = new Date(time)

  var o = { 
    "M+" : date.getMonth()+1,                 //月份   
    "d+" : date.getDate(),                    //日   
    "h+" : date.getHours(),                   //小时   
    "m+" : date.getMinutes(),                 //分   
    "s+" : date.getSeconds(),                 //秒   
    "q+" : Math.floor((date.getMonth()+3)/3), //季度   
    "S"  : date.getMilliseconds()             //毫秒   
  };   
  if(/(y+)/.test(fmt))   
    fmt=fmt.replace(RegExp.$1, (date.getFullYear()+"").substr(4 - RegExp.$1.length));   
  for(var k in o)   
    if(new RegExp("("+ k +")").test(fmt))   
  fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));   
  return fmt;   
} 


export function formatTime(time, option = true) {
  // time = +time * 1000
  const d = new Date(time)
  const now = Date.now()

  const diff = (now - d) / 1000
  if (option) {
  // if (diff < 30) {
  //   return '刚刚'
  // } else if (diff < 3600) { // less 1 hour
  //   return Math.ceil(diff / 60) + '分钟前'
  // } else if (diff < 3600 * 24) {
  //   return Math.ceil(diff / 3600) + '小时前'
  // } else if (diff < 3600 * 24 * 2) {
  //   return '1天前'
  // }
    return dateFtt("yyyy-MM-dd hh:mm:ss",time)
  } else {
    // return d.getFullYear()+'/'+(d.getMonth() + 1) + '/' + d.getDate() + ' ' + d.getHours() + ':' + d.getMinutes()
    return dateFtt("yyyy-MM-dd hh:mm:ss",time)
  }
}


export function delHtmlTag(str){
  if(str == ''|| str == null){
    return str;
  }else{
    str = str.replace(/<[^>]+>/g,"");
    str = str.replace(/\s/g,"");
    str = str.replace(/&nbsp;/g,"");
    return str;
  }
 
}
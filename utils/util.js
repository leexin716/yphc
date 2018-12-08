const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}
//是否登录
function IsLogin(){
  wx.getStorage({
    key: 'apiToken',
    success: function (res) {
      console.log(res)
    }
  })
}
//字典排序对象
function objKeySort(obj) {//排序的函数
  var newkey = Object.keys(obj).sort();
  　　//先用Object内置类的keys方法获取要排序对象的属性名，再利用Array原型上的sort方法对获取的属性名进行排序，newkey是一个数组
  var newObj = {};//创建一个新的对象，用于存放排好序的键值对
  for (var i = 0; i < newkey.length; i++) {//遍历newkey数组
    newObj[newkey[i]] = obj[newkey[i]];//向新创建的对象中按照排好的顺序依次增加键值对
  }
  return newObj;//返回排好序的新对象
}
//遍历对象
function objFor(arr){
  var elp = '';
  var i = 0;
  var j = '48da9f3b5aa949f889cf8d8d6cb67003';//双方约定的签名密钥
  for (var index in arr) {
    if (i != 0)
      elp += "&";
    elp += index + "=" + arr[index];
    i++;
  }
  elp += j
  return elp
}
//排序加遍历
function reData(obj){
  let x = objKeySort(obj)
  x = objFor(x)
  return x
}
//动态添加对象
function addObj(data,key,val){
  data[key] = val;
  return data;
}
const formatDate = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  return [year, month, day].map(formatNumber).join('/')
}
module.exports = {
  formatTime: formatTime,
  IsLogin: IsLogin,
  objKeySort: objKeySort,
  objFor: objFor,
  reData: reData,
  addObj: addObj,
  formatDate: formatDate
}

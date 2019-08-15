
//parse('from=aaa&id=111');
var parse = function (str) {
  var data = {};
  str.split('&').forEach(function (item) {
    var arr;
    item && (arr = item.split('='));
    arr && arr[0] && (data[arr[0]] = arr[1]);
  });
  return data;
  //data = {from:aaa,id:111}
};
var stringify = function (data) {
  var arr = [];
  for (var i in data) {
    if (data.hasOwnProperty(i)) {
      arr.push(i + '=' + data[i]);
    }
  }
  return arr.join('&');
};

/**
 * [add 链接后加在参数]
 * @Author   张树垚
 * @DateTime 2015-12-27T14:30:34+0800
 * @param    {[string]}            href    [链接地址]
 * @param    {[string|json]}       data    [添加数据]
 */
var add = function (href, data) {
  if (typeof data !== 'string') {
    data = stringify(data);
  }
  href = href.trim();
  data = data.trim();
  if (href.indexOf('?') > -1) {
    if (href.match(/\&$/)) {
      return href + data;
    } else {
      return href + '&' + data;
    }
  } else {
    return href + '?' + data;
  }
};
var paramsStrArr = location.search.split('?');
var paramsStr = '';
if (paramsStrArr.length >= 2) {
  paramsStr = paramsStrArr[1];
}
var getFromHash=function(_key){
  var reg = new RegExp('(^|&)' + _key + '=([^&]*)(&|$)', 'i');
  let hash = window.location.hash;
  var r = hash.substr(hash.indexOf("?")+1).match(reg);
  if (r != null) {
    return unescape(r[2]);
  }
  return null;
}

export default {
  data: parse(paramsStr),  //parse('from=aaa&id=111');   ==>最后data = {from:aaa,id:111}
  parse: parse,
  stringify: stringify,
  add: add,
  getFromHash:getFromHash,

};

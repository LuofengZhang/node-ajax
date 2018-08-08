
const http = require("http");
const Url = require("url");  
const qs = require('querystring');  
  
const defaultSetting = {  
	url:null,
	data:null, 
	headers: {},
	type:"GET",
	timeout:10,
	complete: function (req) {},   
	success: function (data) {console.log(data)},   
	error:function(data){}  
}  
  
const ajax=function (setting){
	let errCode = null;  
	let settingType = {}.toString.call(setting).slice(8,-1);
	if(settingType != "Object"){
    console.log("the ajax's first argument must be a Object");  
    return;  
	}  
	if(setting.url == null || setting.url == ""){ 
    console.log("the url cannot be null");  
    return;  
	}  
	  
	for (let key in defaultSetting) {
    if (setting[key] == null) { 
      setting[key] = defaultSetting[key];  
    }  
	}  
	let params = Url.parse(setting.url, true);  
	let options = {
    host: params.hostname,  
    port: params.port || 80,  
    path: params.path,  
    method: setting.type,
	};  
	if(setting.type === "POST") {
    options.headers={
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
    }
	}
	let content = qs.stringify(setting.data);
	if(setting.data != null&&setting.type != "POST"){
	  options.path += "?";  
	  options.path = options.path + content;  
	}
	
	let req = http.request(options,function(res){
    let data = "";  
    res.on("data",function(chunk){  
        data += chunk;  
    })  
    res.on("end",function(){  
        setting.success(data);  
        setting.complete(data);  
    })  
	}).on("error",function(e){  
	  setting.error(e)  
	})  
	if(setting.type === "POST"){
		req.write(content);
	}
	req.setTimeout(setting.timeout);
	req.end();
}  
  
module.exports = ajax;

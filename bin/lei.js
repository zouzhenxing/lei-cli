'use strict'

var exec = require("child_process").execSync;

//获取命令行
var command = process.argv[2];

switch(command) {
    case "init" : {
        var param = process.argv[3] || "lei";
        
        console.log("正在初始化项目结构,请稍候...");
        let ret = exec("git clone https://github.com/zouzhenxing/lei.git ".concat(param));
        console.log("项目初始化完成",ret.toString());

        console.log("正在下载依赖支持包,请稍候...");
        if( process.platform == "win32" ) {
            ret = exec("cd ".concat(param," & npm i"));
        } else if( process.platform == "linux" ) {
            ret = exec("cd ".concat(param," ; npm i"));
        } else {
            return console.log("不支持此操作系统!");
        }
        
        return console.log("下载完成",ret.toString());
    }
    default : {
        console.log("1.init [project name]"," 初始化项目[project name](项目名称),不填默认为lei\n");
    }
}
#!/usr/bin/env node

'use strict'
const exec = require("child_process").execSync;
const colors = require('colors');
const inquirer = require('inquirer');
const mysql = require("mysql");
const fs = require("fs");
const path = require("path");
const ejs = require("ejs");

//当前执行目录
const cwdPath = process.cwd();

//获取命令行
var command = process.argv[2];

switch(command) {
    case "init" : {
        return init();
    }
    case "dbconn" : {
        return dbconn();
    }
    case "gener" : {
        return gener();
    }
    default : {
        console.log("1.init [project name]".green," 初始化项目[project name](项目名称),不填默认为lei\n".white);
        console.log("2.dbconn".green," mysql数据库配置\n".white);
        console.log("3.gener tablename".green," 生成代码 tablename必须参数".white);
    }
}
process.exit(0);


function init() {
    let param = process.argv[3] || "lei";
        
    console.log("正在初始化项目结构,请稍候...".green);
    let ret = exec("git clone https://github.com/zouzhenxing/lei.git ".concat(param));
    console.log("项目初始化完成".green,ret.toString().white);

    console.log("正在下载依赖支持包,请稍候...".green);
    if( process.platform == "win32" ) {
        ret = exec("cd ".concat(param," & npm i"));
    } else if( process.platform == "linux" ) {
        ret = exec("cd ".concat(param," ; npm i"));
    }

    console.log("下载完成\n".green,ret.toString().white);
}

function dbconn() {
    let questions = [{
        type : "Input",
        name : "host",
        message : "请输入mysql数据库地址",
        default : "localhost"
    },{
        type : "Input",
        name : "port",
        message : "请输入mysql数据库端口",
        default : "3306"
    },{
        type : "Input",
        name : "username",
        message : "请输入用户名",
        default : "root"
    },{
        type : "Input",
        name : "password",
        message : "请输入密码",
        default : ""
    },{
        type : "Input",
        name : "database",
        message : "请输入数据库名",
        default : ""
    }];

    inquirer.prompt(questions).then(answers => {
        //测试连接
        var connection = mysql.createConnection({
            host     : answers.host,
            port     : answers.port,
            user     : answers.username,
            password : answers.password,
            database : answers.database
        });

        connection.connect(function( err ) {
            if( err ) {
                return console.log(err.stack.red);
            }

            connection.query("show tables",function( err ,data ) {
                if( err ) {
                    return console.log(err.stack.red);
                }
                
                let config = fs.readFileSync(path.join(cwdPath,"/config.json"));
                fs.writeFileSync(path.join(cwdPath,"/config.json"),ejs.render(config.toString(),{mysql:answers}));

                console.log("数据库测试成功\n".green, data);
                process.exit(0);
            });
        });
    });
}

function gener() {
    let table = process.argv[3];
    if( !table ) {
        return console.log("请输入表名".red);
    }

    let ret = exec("node ".concat(path.join(cwdPath,"script/script "),table));
    console.log(ret.toString().white);
}
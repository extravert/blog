import router from './router/route.js';
import express from 'express';
import multer from 'multer';
import category from './router/category.js';
import blogs from './router/bolgs.js';
import uploads from './router/upload.js'
import path from 'path';
import { db } from './db/db.js';

// const express = require('express');
const app = express();
// const multer = require('multer');

// 解决跨域问题
app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', '*');
  res.header('Access-Control-Allow-Methods', 'DELETE, PUT, POST, GET, OPTIONS');
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
})

app.use(express.json());  // 解析json格式的请求
// 为什么需要app.use？ 注册到app上，这样在后续的请求中，就可以使用了

const upload = multer({
  dest: './public/uploads/tmp'
})

// 中间件实现验证token 而不必要写冗余代码
// 拼接到路由中
const ADMIN_TOKEN_PATH = "/_token"
app.all("*", async (req, res, next) => {
  // 判断路径是否存在token
  if(req.path.indexOf(ADMIN_TOKEN_PATH) > -1) {

    let { token } = req.headers;
    
    let token_sql = "select * from admin where token = ?"
    let admin_result  = await db.async.all(token_sql, [token])

    console.log(admin_result)
    if (admin_result.err != null || admin_result.rows.length == 0) {
        res.send({
            code: 403,
            msg: 'please login!',
        })
        return
    } else {
      next()
    }
  } else {
    next()
  }
})


// 解析文件上传的请求 为什么用any ？？？ 上传文件的时候，会有一个filedName，如果不指定，就是默认的file 如果指定了，就是指定的字段名
app.use(upload.any());
app.use(express.static(path.join(process.cwd(), 'public')))  // public 声明为静态文件可调用
app.use(router);
app.use('/category', category)
app.use('/blogs', blogs)
app.use("/uploads", uploads)

app.get('/', (req, res) => {
  res.send('Hello World');
});

app.listen(3000, () => {
    console.log('Server is running: http://localhost:3000');
})
import router from './router/route.js';
import express from 'express';
import multer from 'multer';
import category from './router/category.js';
import blogs from './router/bolgs.js';
import uploads from './router/upload.js'
import path from 'path';

// const express = require('express');
const app = express();
// const multer = require('multer');

// 解决跨域问题
app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', '*');
  res.header('Access-Control-Allow-Methods', 'DELETE, PUT, POST, GET, OPTIONS');
  if (req.method === 'OPTIONS') {
    res.send(200);
  } else {
    next();
  }
})

app.use(express.json());  // 解析json格式的请求
// 为什么需要app.use？ 注册到app上，这样在后续的请求中，就可以使用了

const upload = multer({
  dest: './public/uploads/tmp'
})
// 解析文件上传的请求 为什么用any ？？？ 上传文件的时候，会有一个filedName，如果不指定，就是默认的file 如果指定了，就是指定的字段名
app.use(upload.any());
app.use(router);
app.use('/category', category)
app.use('/blogs', blogs)
app.use("/uploads", uploads)
app.use(express.static(path.join(process.cwd(), 'public')))  // public 声明为静态文件可调用

app.get('/', (req, res) => {
  res.send('Hello World');
});

app.listen(3000, () => {
    console.log('Server is running: http://localhost:3000');
})
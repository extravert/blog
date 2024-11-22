import express, { Router } from 'express'; 
import {db, genid} from '../db/db.js';
import fs from 'fs';

const uploads = express.Router()

uploads.post('/rich_editor_upload', async (req, res) => {
    if (!req.files) {
        res.send({
            "errno": 1, // 只要不等于 0 就行
            "message": "失败信息"
        })
        return
    }

    let files = req.files;
    let ret_files = [];  // 存储返还的图片

    for (let file of files) {  // 注意for of 遍历数组等可迭代
        // 获取文件名字后缀
        let file_ext = file.originalname.substring(file.originalname.lastIndexOf(".") + 1)  // 注意lastIndexOf大小写
        // 随机文件名字
        let file_name = genid.NextId() + "." + file_ext;

        // 修改名字 移动文件
        fs.renameSync(
            process.cwd() + "/public/uploads/tmp/" + file.filename,  // 注意文件路径后面也要斜杠
            process.cwd() + "/public/uploads/" + file_name
        )
        ret_files.push("/uploads/" + file_name)
    };
    res.send({
        "errno": 0, // 注意：值是数字，不能是字符串
        "data": {
            "url": ret_files[0], // 图片 src ，必须
        }
    })
})

export default uploads
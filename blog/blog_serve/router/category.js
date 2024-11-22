import { Router } from 'express'; 
import {db, genid} from '../db/db.js';

const category = Router();

// 添加接口 注意这里要用异步 不然拿不到rows
category.post('/_token/add', async (req, res) => {
    // let { token } = req.headers;
    
    // let token_sql = "select * from admin where token = ?"
    // let admin_result  = await db.async.all(token_sql, [token])
    

    // // 查询返回的是个对象 不是直接的值 需要先拿到 err, 或者rows 结果数组 再判断
    // // 可以通过判断返回值是什么 
    // console.log(admin_result)
    // if (admin_result.err != null || admin_result.rows.length == 0) {
    //     res.send({
    //         code: 403,
    //         msg: 'please login!',
    //     })
    //     return  // 如果未登录就可以直接返回了
    // }

    let { name } = req.body
    let add_sql = 'insert into category (id, name) values (?, ?)'
    let {err, rows} = await db.async.run(add_sql, [genid.NextId(), name])
    
    if (err == null) {
        res.send({
            code: 200,
            msg: 'request success',
            rows
        })
    } else {
        res.send({
            code: 500,
            msg: 'request failure'
        })
    }
})

// 请求接口 列表查询
category.get('/list', async (req, res) => {
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
    }

    let get_sql = 'select * from category'
    let {err, rows} = await db.async.all(get_sql, [])
    
    if (err == null) {
        res.send({
            code: 200,
            msg: 'request success',
            rows: rows
        })
    } else {
        res.send({
            code: 500,
            msg: 'request failure'
        })
    }
})

// 删除接口
category.delete('/_token/delete', async (req, res) => {
    let id = req.query.id
    let delete_sql = 'delete from category where id = ?'
    let {err, rows} = await db.async.run(delete_sql, [id])
    
    if (err == null) {
        res.send({
            code: 200,
            msg: 'request success',
            rows
        })
    } else {
        res.send({
            code: 500,
            msg: 'request failure'
        })
    }
})

// 修改接口
category.put('/_token/update', async (req, res) => {
    let { id, name } = req.body
    let update_sql = 'update category set name = ? where id = ?'
    let {err, rows} = await db.async.run(update_sql, [name, id])
    
    if (err == null) {
        res.send({
            code: 200,
            msg: 'request success',
        })
    } else {
        res.send({
            code: 500,
            msg: 'request failure'
        })
    }
})

export default category
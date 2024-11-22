import { Router } from 'express'; 
import {db, genid} from '../db/db.js';
import { validate } from 'uuid';

const blogs = Router();

// 添加博客接口
blogs.post('/_token/add', async (req, res) => {
    let { title, category_id, content } = req.body;
    let id = genid.NextId();
    let create_time = new Date().getTime()
    let blog_add = "insert into blog (id, title, category_id, content, create_time) values (?, ?, ?, ?, ?)"

    let { err, rows } = await db.async.run(blog_add, [id, title, category_id, content, create_time])

    if(err == null) {
        res.send({
            code: 200,
            msg: "add success"
        })
    } else {
        res.send({
            code: 500,
            msg: "add fail"
        })
    }
})

// 修改博客
blogs.post('/_token/update', async (req, res) => {
    let { id, title, category_id, content } = req.body;
    let create_time = new Date().getTime()
    let blog_update = "update blog set title = ?, category_id = ?, content = ? where id = ?"
    let { err, rows } = await db.async.run(blog_update, [title, category_id, content, id])

    if(err == null) {
        res.send({
            code: 200,
            msg: "update success"
        })
    } else {
        res.send({
            code: 500,
            msg: "update fail"
        })
    }
})

// 删除博客
blogs.delete('/_token/delete', async (req, res) => {
    let id = req.query.id
    let delete_sql = 'delete from blog where id = ?'
    let {err, rows} = await db.async.run(delete_sql, [id])
    
    if (err == null) {
        res.send({
            code: 200,
            msg: 'delete success',
            rows
        })
    } else {
        res.send({
            code: 500,
            msg: 'delete fail'
        })
    }
})

// 查询博客 实现一个关键字 查询 分页查询
blogs.get("/_token/search", async (req, res) => {
    /**
     * keyword
     * category_id
     * 
     * page
     * page_size
     */
    // 判断传入参数是否存在
    let { keyword, category_id, page, page_size } = req.query
    keyword = keyword == null ? "" : keyword
    category_id = category_id == null ? 0 : category_id
    page = page == null ? 1 : page
    page_size = page_size == null ? 10 : page_size

    let params = []  // 参数集
    let where_sqls = []  // 查询条件集

    // 判断是否需要按类别查询
    if(category_id) {
        where_sqls.push(" category_id = ? ")  // 注意这里面有个空格
        params.push(category_id)
    }
    // 标题和内容的模糊查询匹配
    if (keyword) {
        where_sqls.push(" (title like ? or content like ?) ")  // 注意括号 优先处理
        params.push("%" + keyword + "%")
        params.push("%" + keyword + "%")  // 一个是title的参数 一个是content的参数
    }

    let where_sql = ""
    if (where_sqls.length > 0) {
        where_sql = "where" + where_sqls.join(' and ')
    }

    // 查分页数据
    let search_sql = " select * from blog " + where_sql + " order by create_time desc limit ?,? "
    let search_params = params.concat([(page - 1) * page_size, page_size])  // 需要拼接上limit的参数

    // 查数据总数
    let search_count_sql = " select count(*) from blog " + where_sql
    let search_count_params = params

    // 分页数据
    let search_res = await db.async.all(search_sql, search_params)
    let count_res = await db.async.all(search_count_sql, search_count_params)

    console.log(count_res)
    if (search_res.err == null && count_res.err == null) {
        res.send({
            code: 200,
            msg: "查询成功",
            data: {
                keyword,
                category_id,
                page,
                page_size,
                rows: search_res.rows,
                count: count_res.rows[0]["count(*)"]  // 这里可以打印一下看看 就是要拿到表示count的变量
            }
        })
    } else {
        res.send({
            code: 500,
            msg: "search fail"
        })
    }
})


export default blogs
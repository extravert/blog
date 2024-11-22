import express from 'express';
import { Router } from 'express'; 
import {db, genid} from '../db/db.js';
import { v4 } from 'uuid';

const router = Router();

router.get('/test', async (req, res) => {
    try {
        let out = await db.async.all('select * from `admin`', []);
        console.log('Query result:', out);
        res.send({
            id: genid.NextId(),
            out  // 等同于out: out
        });
    } catch (error) {
        console.error('Error during query:', error);
        res.status(500).send({
            code: 500,
            msg: 'Internal server error',
            error: error.message
        });
    }
});

router.post('/login' ,async (req, res) => {
    let {account, password} = req.body;

    try {
        let { err, rows } = await db.async.all("select * from `admin` where `account` = ? and `password` = ?", [account, password]);
        
        if (err) {
            console.error('Database error:', err);
            return res.status(500).send({
                code: 500,
                msg: 'Internal server error',
                err: err.message
            });
        }
        
        if (rows.length > 0) {
            let login_token = v4();
            let update_token_sql = "update `admin` set `token` = ? where `id` = ?";

            await db.async.run(update_token_sql, [login_token, rows[0].id]);

            let admin_info = rows[0];
            admin_info.token = login_token;
            admin_info.password = "";

            res.send({
                code: 200,
                msg: 'login successful',
                data: admin_info
            });
        } else {
            console.log('Login failed for account:', account);
            res.send({
                code: 500,
                msg: 'login fail',
            });
        }
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).send({
            code: 500,
            msg: 'Internal server error',
            error: error.message
        });
    }
})


export default router;
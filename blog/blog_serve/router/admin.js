import { Router } from 'express'; 
import { v4 } from 'uuid';
import {db, genid} from '../db/db.js';

const router = Router();

router.post('/login' ,async (req, res) => {
    let {account, password} = req.body;
    let { err, rows } = await db.async.all("select * from `admin` where account = ? and password = ?", [account, password])
    
    if (err == null && rows) {
        let login_token = v4();
        let update_token_sql = "update `admin` set token = ? where id = ?"

        await db.async.run(update_token_sql, [login_token, rows[0].id])

        let admin_info = rows[0]
        admin_info.token = login_token
        admin_info.password = ""

        res.send({
            code: 200,
            msg: 'login successful',
            data: admin_info
        })
    } else {
        res.send({
            code: 500,
            msg: 'login fail',
        })
    }
})

export default router;
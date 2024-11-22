import sqlite3 from 'sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';
import genId from '../utils/snowFlake.js';

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);
// const dbPath = path.join(__dirname, 'blog.sqlite3');  // 上面是commonjs的用法 需要导入fileURLToPath

const dbPath = path.join(process.cwd(), './db/blog.sqlite3');  // 这是es6的用法 因为文档用了es模块

// const db = new sqlite3.Database(dbPath, (err) => {
//     if (err) {
//         console.error('Error opening database ' + err.message);
//     } else {
//         console.log('Database path:', dbPath);
//         console.log('Connected to the SQLite database.');
//     }
// });
const genid = new genId({ WorkerId: 1 });

db.async = []
db.async.all = (sql, params) => {
    return new Promise((resolve, reject) => {
        db.all(sql, params, (err, rows) => {
            resolve({err, rows});
        })
    })
}

// run是sqlite3内置的方法
db.async.run = (sql, params) => {
    return new Promise((resolve, reject) => {
        db.run(sql, params, (err, rows) => {
            resolve({err, rows});
        })
    })
}


export { db, genid };
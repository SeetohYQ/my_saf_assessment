const mkQuery = function (sql, pool) {
    const f = function (params) {
        const p = new Promise((resolve,reject) => {
            pool.getConnection((err, conn) => {
                if (err) {
                    return reject (err);
                }
                conn.query(sql, params || [], (err, result) => {
                    conn.release();
                    if (err) {
                        return reject (err);
                    }
                    resolve(result); 
                })
            })
        })
        return (p);
    }
    return (f);
}

module.exports = mkQuery;
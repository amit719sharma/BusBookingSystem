var mysql=require("mysql")
var pool=mysql.createPool(
    {
        host:'localhost',
        port:3306,
        user:'root',
        password:'amit@12',
        database:'bus27',
        multipleStatements:true,
        connectionLimit:100,
    })
    module.exports=pool ;
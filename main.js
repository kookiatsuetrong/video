var express = require('express')
var ejs     = require('ejs')
var mysql   = require('mysql')
var source  = { host: 'localhost', database: 'webschool',
                user: 'james',     password: 'bond' }
var pool    = mysql.createPool(source)
var server  = express()   // create server
server.listen(2000)
server.engine('html', ejs.renderFile)

server.get('/', showHome)
server.use(express.static('public'))

function showHome(req, res) {
    var sql = "select * from lesson where type='free'"
    pool.query(sql, function (error, data) {
        var model = { }
        model.lesson = data
        res.render('index.html', model)
    })
}
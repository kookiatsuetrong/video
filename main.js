var express = require('express')
var ejs     = require('ejs')
var mysql   = require('mysql')
var source  = { host: 'localhost', database: 'webschool',
                user: 'james',     password: 'bond' }
var pool    = mysql.createPool(source)
var server  = express()   // create server
var reader  = express.urlencoded({extended:false})
server.listen(2000)
server.engine('html', ejs.renderFile)

server.get('/', showHome)
server.get('/search', showSearch)
server.get ('/login',  showLogIn)
server.post('/login',  reader, checkLogIn)
server.use(express.static('public'))

function showLogInt(req, res) { 
    res.render('login.html') 
}

function checkLogIn(req, res) {
    // req.body.email,        req.body.secret
    res.send(req.body)
}

function showHome(req, res) {
    var sql = "select * from lesson where type='free'"
    pool.query(sql, function (error, data) {
        var model = { }
        model.lesson = data
        res.render('index.html', model)
    })
}

function showSearch(req, res) {
    var model = { }
    if (req.query.video == null) {
        model.result = [ ]
        res.render('search.html', model)
    } else {
        var sql = 'select * from lesson where title like ? or detail like ?'
        var data = [ '%' + req.query.video + '%', '%' + req.query.video + '%' ]
        pool.query(sql, data, function(error, data) {
            model.result = data
            res.render('search.html', model)
        })
    }
}


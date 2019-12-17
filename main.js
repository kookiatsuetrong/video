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

var valid = [ ]

server.get('/', showHome)
server.get('/search', showSearch)
server.get ('/login',  showLogIn)
server.post('/login',  reader, checkLogIn)
server.use(express.static('public'))

function showLogIn(req, res) { 
    res.render('login.html') 
}

function checkLogIn(req, res) {
    if (req.body.email == 'mark@fb.com' && req.body.secret == 'mark123') {
        var c = createCard()
        valid[c] = true
        res.header('Set-Cookie', 'card=' + c)
    }
    res.redirect('/')
}

function createCard() {
    return parseInt(Math.random() * 100000000)
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


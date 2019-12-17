var express = require('express')
var ejs     = require('ejs')
var mysql   = require('mysql')
var parser  = require('cookie-parser')
var cookie  = parser()
var source  = { host: 'localhost', database: 'webschool',
                user: 'james',     password: 'bond' }
var pool    = mysql.createPool(source)
var server  = express()   // create server
var reader  = express.urlencoded({extended:false})
server.listen(2000)
server.engine('html', ejs.renderFile)

var valid = [ ]

server.get('/',        showHome)
server.get('/search',  showSearch)
server.get ('/login',  showLogIn)
server.post('/login',  reader, checkLogIn)
server.get ('/main',   cookie, showMain)
server.get ('/logout', cookie, showLogOutPage)
server.use(express.static('public'))

function showLogOutPage(req, res) {
    var card = null
    if (req.cookies != null) { card = req.cookies.card }
    delete valid[card]
    res.render('logout.html')
}

function showMain(req, res) {
    var card = null
    if (req.cookies != null) { card = req.cookies.card }
    if (valid[card]) {
        res.render('main.html')
    } else {
        res.redirect('/login')
    }
}

function showLogIn(req, res) { 
    res.render('login.html') 
}

function checkLogIn(req, res) {
    if (req.body.email == 'mark@fb.com' && req.body.secret == 'mark123') {
        var c = createCard()
        valid[c] = true
        res.header('Set-Cookie', 'card=' + c)
    }
    res.redirect('/main')
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


var express = require('express'),
api =  require('./api.fronter.com')

var app = express.createServer();
app.set('view engine', 'ejs');
app.use(express.logger());
app.use(express.cookieParser());
app.use(express.bodyParser());
app.use(express.session({ secret: 'keyboard cat' }));
app.use(app.router);
app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));

app.get('/api', api.index);
app.get('/api/', api.index);
app.get('/api/login', api.loginForm);
app.post('/api/login', api.login);
app.get('/api/logout', api.logout);
app.get('/api/getResource', api.getResource);


app.listen(3001);

var clientId, clientSecret;
var Client = require('node-rest-client').Client,
    clientOptions = {
      connection: {
        rejectUnauthorized: false,
        requestCert: true,
      }
    };
exports.index = function(req, res) 
{
  res.send('Welcome to OAuth 2.0 Server<br/> <a href="/api/login"> Click here to Login </a>');
};

exports.loginForm = function(req, res) 
{
  res.render('api_login');
};

exports.login = function(req, res) 
{
    clientId = req.body.clientId;
    clientSecret = req.body.clientSecret;

    
    client = new Client(clientOptions),
    tokenArgs = {
      'data': {
        'grant_type':'client_credentials',
        'client_id':clientId,
        'client_secret':clientSecret,
        'scope':'*'
      },
      headers: {
        'Content-Type':'application/json'
      }
    };

    client.post('https://api.fronter.com/oauth/token', tokenArgs, function (data, response) {
        console.log(data);
        req.session.accessToken = data['token_type'] + ' ' +data['access_token'] ;
        res.redirect('/api/getResource');
    }).on('error', function (err) {
        console.log('err: ', err);
        res.send("Error occured, Cannot get access token");
    }); 
}

exports.logout = function(req, res) 
{
  delete req.session.accessToken;
  res.redirect('/api');
}

exports.getResource = function(req, res)
{
    client = new Client(clientOptions);
    var clientArgs = {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': req.session.accessToken
      }
    };
    
    client.get('https://api.fronter.com/clients/' + clientId, clientArgs, function (data, response) {
        //console.log(data);
        if(!JSON.parse(data).error) {
            res.send("Resoponse data ==> " + data + "<br/><br/><a href='/api/logout'>Logout</a>");
        } else {
            res.send("Resoponse data ==> " + data + "<br/><br/>You are not authorized so please <a href='/api/login'>Login</a>");
        }
    }).on('error', function (err) {
        console.log('err: ', err);
        res.send("Error occured, Cannot get resource client");
    });
}

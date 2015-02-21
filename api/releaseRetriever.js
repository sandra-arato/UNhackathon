var https = require('https')

var headers = {
     'X-API-KEY': 'G5qT1sSVeJ6ifj94zxGTu0wrpMVihXraEWbfP2ZI'
}

var options = {
  host: 'www.rise.global',
      port: 80,
        path: '/api/releases/scores',
          method: 'POST',
            headers: headers,
            board_id: 8299
  };

https.request(options, function(res) {
    console.log('STATUS: ' + res.statusCode);
      console.log('HEADERS: ' + JSON.stringify(res.headers));
        res.setEncoding('utf8');
          res.on('data', function (chunk) {
                console.log('BODY: ' + chunk);
                  });
}).end();

'use strict'

//import http from 'node:http';
var http = require('http');
var got = require('got');
//const { got } = require('got');
//import got from 'got';
//import got from '@adonisjs/got'

class ClientController {
    async store() {
        return {
            mensaje: "Creamos un cliente desde el Controlador" 
        };
    };

    async file({ request3, auth }) {
        /*const { email, password } = request.all();
        const token = await auth.attempt(email, password);
        return token;*/
        //const request = require('request');
        
        /*
        var Request = use('Adonis/Src/Request');
        Request = ({
        url: '​https://increase-transactions.herokuapp.com/file.txt',
        headers: {
            'Authorization': '​Bearer 1234567890qwertyuiopasdfghjklzxcvbnm​'
        },
        rejectUnauthorized: false
        }, function(err, res) {
            if(err) {
                console.error(err);
            } else {
                console.log(res.body);
            }

        });

        return response;*/

        //var a = http.ClientRequest;

        //a.url = 'https://increase-transactions.herokuapp.com/file.txt';
        //a.Authorization = 'Bearer 1234567890qwertyuiopasdfghjklzxcvbnm';
        //a.call();
        //a.arguments.url = 'https://increase-transactions.herokuapp.com/file.txt';
        //a.arguments.Authorization = 'Bearer 1234567890qwertyuiopasdfghjklzxcvbnm';
        //a.arguments.headers = 'Authorization': 'Bearer 1234567890qwertyuiopasdfghjklzxcvbnm';
        //a.ClientRequest();

        // http.ClientRequest.arguments.Authorization

/*
        const request1 = http.request(
            { 
                url: 'https://increase-transactions.herokuapp.com/file.txt',  
                headers: {
                    'Authorization': 'Bearer 1234567890qwertyuiopasdfghjklzxcvbnm'
                }, rejectUnauthorized: false 
            },  response => {
            if (response.statusCode >= 400) {
                request1.destroy(new Error());
                return "ERROR";
            }*/
/*
            const chunks = [];

            response.on('data', chunk => {
                chunks.push(chunk);
            });

            response.once('end', () => {
                const buffer = Buffer.concat(chunks);

                if (response.statusCode >= 400) {
                    const error = new Error(`Unsuccessful response: ${response.statusCode}`);
                    error.body = buffer.toString();
                    return;
                }

                const text = buffer.toString();

                console.log(text);
            });

            response.once('error', console.error);*/
        //});



/*
        let request = require('request')

        const formData = {
          // Pass a simple key-value pair
          //my_field: 'my_value'
            headers: {
                        'Authorization': 'Bearer 1234567890qwertyuiopasdfghjklzxcvbnm'
                    }//, 
            //rejectUnauthorized: false 
        };

        console.log(request.all());

        request.get({url:'https://increase-transactions.herokuapp.com/file.txt', formData: formData}, function optionalCallback(err, httpResponse, body) {
          if (err) {
            return console.error('Error al conectarse:', err);
          }
          console.log('Upload successful!  Server responded with:', body);
        });
*/
/*
        const request = require('request');
        const hostname = 'https://increase-transactions.herokuapp.com';
        const path = '/file.txt';
        
        request.auth = 'Bearer 1234567890qwertyuiopasdfghjklzxcvbnm';

        //var resultado = '';
        request(`${hostname}${path}`, (err,res,body )=>{
        
          console.log(body);
          console.log(res);
          //resultado = body;
          return res;
        });

*/
/*
var request = require('request');
var options = {
  'method': 'GET',
  'url': 'https://increase-transactions.herokuapp.com/file.txt',
  'headers': {
    'Authorization': 'Bearer 1234567890qwertyuiopasdfghjklzxcvbnm',
    'Content-Type': 'application/json'
  }
};


//var res;
await request(options, function (error, response) { 
  if (error) throw new Error(error);
  console.log(response.body);
  //res = response.body;
});

return { datos: resultado };
        //console.log("Llego aca");
*/

/*
app.get('/users', async(req, res) => {
  var options = {
    'method': 'GET',
    'url': 'https://increase-transactions.herokuapp.com/file.txt',
    'headers': {
        'Authorization': 'Bearer 1234567890qwertyuiopasdfghjklzxcvbnm',
        'Content-Type': 'application/json'
    }
  };

  const result = new Promise((resolve, reject) => {
    requestToApi(options, function(error, response) {
      if (error) return reject(error);
      return resolve(JSON.parse(response.body));
    });
  })

  // make sure, to use async in your function
  // because we're using await here
  var fromapi = await result;
  // It's working here
  console.log(fromapi);

  res.end();
})
*/



const {timings} = await got('https://example.com', {
	timeout: {
		request: 10000
	}
});
 console.log(timings);



        
    }
}

module.exports = ClientController
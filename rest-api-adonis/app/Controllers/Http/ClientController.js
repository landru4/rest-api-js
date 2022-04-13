'use strict'

const { jwt } = require('../../../config/auth');

//import http from 'node:http';
//var http = require('http');
//var got = require('got');
///** @type {import('got')} */
//const got = use('got')
//const { got } = require('got/dist/source/index.js');
//./dist/source/index.js
//import got from 'got';
//import got from '@adonisjs/got'
//const got = require("got");
//const got = require('global-modules/got');

function ProcesarLinea1(linea) {
    console.log("Proceso la linea 1");
    var regex = /(1)(\w{32})\s{3}(\d{3})(\d{13})(\d{13})(\d{13})/g;
    const matches = linea.matchAll(regex);
    console.log(linea);
    for (const m of matches) {

        // the complete match
        //const fullMatch = m[0]; 
        
        // isolating each capture group match
        //const group1 = m[1];
        //const group2 = m[2];

        console.log("Cabecera:");
        console.log("Tipo:", m[1]);
        console.log("Id Pago:", m[2]);
        console.log("Moneda:", m[3]);
        console.log("Monto total:", m[4]);
        console.log("Total descuento:", m[5]);
        console.log("Total c/descuento:", m[6]);

        // index of where the match starts
        const cursorPos = m.index;
    }
    return "Proceso Linea 1 OK!";
};

function ProcesarLinea2(linea) {
    console.log("Proceso la linea 2");
    var regex = /(2)(\w{32})(\d{13})\s{5}(\d{1})/g;
    const matches = linea.matchAll(regex);
    console.log(linea);
    for (const m of matches) {
        console.log("Transaccion:");
        console.log("Tipo reg:", m[1]);
        console.log("Id Trans:", m[2]);
        console.log("Monto:", m[3]);
        console.log("Tipo:", m[4]);
        // index of where the match starts
        const cursorPos = m.index;
    }
    return "Proceso Lineas 2 OK!";
};

// Estas funciones estan independientes para poder tener mejor mantenimiento ante posibles cambios en la estructura
function ProcesarLinea3(linea) {
    console.log("Proceso la linea 3");
    var regex = /(3)(\w{32})(\d{13})\s{3}(\d{1})/g;
    const matches = linea.matchAll(regex);
    console.log(linea);
    for (const m of matches) {
        console.log("Tipo reg:", m[1]);
        console.log("Id Desc:", m[2]);
        console.log("Monto:", m[3]);
        console.log("Tipo:", m[4]);
        // index of where the match starts
        const cursorPos = m.index;
    }
    return "Proceso Lineas 3 OK!";
};

function ProcesarLinea4(linea) {
    console.log("Proceso la linea 4");
    var regex = /(4)\s{15}(\d{8})(\w{32})/g;
    const matches = linea.matchAll(regex);
    console.log(linea);
    for (const m of matches) {
        console.log("Tipo reg:", m[1]);
        console.log("Fecha pago:", m[2]);
        console.log("Id Cliente:", m[3]);
        // index of where the match starts
        const cursorPos = m.index;
    }
    return "Proceso Linea 4 OK!";
};

class ClientController {
    async store() {
        return {
            mensaje: 'Creamos un cliente desde el Controlador' 
        };
    };

    async file({ req, auth }) {
        var res = '';

        try {
            await auth.check()
            console.log('TODO OK')
            res = res + "TODO OK"

          } catch (error) {
            console.log('Missing or invalid api token')
            return 'Missing or invalid api token'
          }

        //if (!req.headers.Authorization) {
            //return res.status(403).send({ message: 'No tienes autorizacion'})
            //return 'No tienes autorizacion'
        //}
        //console.log(request.all)

        //const token = request.header.Authorization//.split(' ')[1]
        //const token = auth
        
        //console.log(token)

        //const exito = await auth.attempt(token);

        //console.log("Token enviado: ", token)

        
        //decodeToken (token)
        //    .then(console.log("Login exitoso!"))
            /*.then(response => {
                message: 'Login exitoso'
            })*/
       //     .catch(response => {
       //         res.status(response.status)
       //     })
       
        
        
        /*const { email, password } = request.all();
        const token = await auth.attempt(email, password);
        return token;*/
        //const request = require('request');

        /*
        {
            "email": "test6landru@gmail.com",
            "password": "123456"
        }
        token: "e16a461988f343f34dc81c0042318230rJT7wM//3vK2XA/f0IrM2+jNyOQ6oxwIWmJqwBTRJlYDLknuKnLI2orzuMfn5rtz"
        */

        var request = require('request');

        var options = {
        'method': 'GET',
        'url': 'https://increase-transactions.herokuapp.com/file.txt',
        'headers': {
            'Authorization': 'Bearer 1234567890qwertyuiopasdfghjklzxcvbnm',
            'Content-Type': 'application/json'
        }
        };

        const result = new Promise((resolve, reject) => {
            request(options, function(error, response) {
            if (error) return reject(error);
            //console.log(JSON.parse(response.body));
            console.log(response.body);
            //return resolve(JSON.parse(response.body));
            return resolve(response.body);
            });
        })

        var fromapi = await result;

        // Guardar el archivo
        /*
        var fs = require('fs');
            fs.writeFile('file.txt', fromapi, function (err) {
            if (err) return console.log(err);
            console.log('Archivo leido > file.txt');
        });*/

        //var r = /((1)(\w{32})\s{3}(\d{3})(\d{13})(\d{13})(\d{13}))\n(((2)(\w{32})(\d{13})\s{5}(\d{1})\n)*)(((3)(\w{32})(\d{13})\s{3}(\d{1}))\n)*(((4)\s{15}(\d{8})(\w{32}))\n)/g,
        var r = /(1\w{32}\s{3}\d{3}\d{13}\d{13}\d{13})\n((2\w{32}\d{13}\s{5}\d{1}\n)*)((3\w{32}\d{13}\s{3}\d{1}\n)*)(4\s{15}\d{8}\w{32})\n/g,
        s = fromapi,
        m;

        
        const matches = s.matchAll(r);
        for (const m of matches) {
            const fullMatch = m[0]; 
            console.log("\n\rm1:", m[1]); // Linea 1
            console.log("m2:\n\r", m[2]); // Todas las lineas tipo 2
            //console.log("m3:", m[3]); // Ultimo Tipo 2
            console.log("m4:\n\r", m[4]); // Todas las lineas tipo 3
            //console.log("m5:", m[5]); // Ultimo Tipo 3
            console.log("m6:", m[6]); // Linea Tipo 4
            
            res = res + '\n\n' + m[1] + "\n";
            // index of where the match starts
            const cursorPos = m.index;

            /*
            ProcesarLinea1(m[1]);
            ProcesarLinea2(m[2]);
            ProcesarLinea3(m[4]);
            ProcesarLinea4(m[6]);*/

            Promise.all([ProcesarLinea1(m[1]), ProcesarLinea2(m[2]), ProcesarLinea3(m[4]), ProcesarLinea4(m[6])])
            //.then(resultArray => console.log(resultArray))
            .then(console.log('Arhivo procesado exitosamente!'))
            .catch(e => console.log('Error de formato al procesar el archivo:  ${e}'));


        }

        return res;
    }
}




module.exports = ClientController

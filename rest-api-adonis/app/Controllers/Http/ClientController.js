'use strict'

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
    //return "Proceso una linea";
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
};

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
            //console.log(JSON.parse(response));
            //return resolve(JSON.parse(response.body));
            return resolve(response.body);
            });
        })

        // make sure, to use async in your function
        // because we're using await here
        var fromapi = await result;
        // It's working here
        //console.log('%c Oh my heavens! ', 'background: #222; color: #bada55', 'more text');
        //console.log("PRUEBA\n")
        //console.log(fromapi);
        // socket hang up

        // Guardar el archivo
            /*
            var fs = require('fs');
                fs.writeFile('helloworld.txt', fromapi, function (err) {
                if (err) return console.log(err);
                console.log('Hello World > helloworld.txt');
            });*/


        
        //var r = /(1)(\w{32})\s{3}(\d{3})(\d{13})(\d{13})(\d{13})\n/g;


        //var r = /((1)(\w{32})\s{3}(\d{3})(\d{13})(\d{13})(\d{13}))\n(((2)(\w{32})(\d{13})\s{5}(\d{1})\n)*)(((3)(\w{32})(\d{13})\s{3}(\d{1}))\n)*(((4)\s{15}(\d{8})(\w{32}))\n)/g,
        var r = /(1\w{32}\s{3}\d{3}\d{13}\d{13}\d{13})\n((2\w{32}\d{13}\s{5}\d{1}\n)*)((3\w{32}\d{13}\s{3}\d{1}\n)*)(4\s{15}\d{8}\w{32})\n/g,
        s = fromapi,
        m;

        var res = '';

        /*
        var regexLinea2 = /(2\w{32}\d{13}\s{5}\d{1})/g;
        const matchesLinea2 = linea.matchAll(regex);
        console.log(linea);
        for (const m of matches) {
            console.log("Transaccion:");
            console.log("Tipo reg:", m[1]);
            console.log("Id Trans:", m[2]);
            console.log("Monto:", m[3]);
            console.log("Tipo:", m[4]);
            // index of where the match starts
            const cursorPos = m.index;
        }*/

        /*
        while ( m = r.exec(s) ) {
            // `m` is your match, `m[1]` is the letter
            //res = res + '\n\n' + m[1] + "\n";
            //console.log("Valor de m:\n");
            //console.log(m);

            console.log("Cabeceras:\n");
            console.log("Tipo:", m[1]);
            console.log("Id Pago:", m[2]);
            console.log("Moneda:", m[3]);
            console.log("Monto total:", m[4]);
            console.log("Total descuento:", m[5]);
            console.log("Total c/descuento:", m[6]);
            //console.log(res);
        }
        */

        const matches = s.matchAll(r);
        for (const m of matches) {
    
            // the complete match
            const fullMatch = m[0]; 
            
            // isolating each capture group match
            //const group1 = m[1];
            //const group2 = m[2];

            //console.log("Valor de m:\n");
            //console.log(m);

            //console.log("V:\n");
            console.log("\n\rm1:", m[1]); // Linea 1
            console.log("m2:\n\r", m[2]); // Todas las lineas tipo 2
            //console.log("m3:", m[3]); // Ultimo Tipo 2
            console.log("m4:\n\r", m[4]); // Todas las lineas tipo 3
            //console.log("m5:", m[5]); // Ultimo Tipo 3
            console.log("m6:", m[6]); // Linea Tipo 4
            
            res = res + '\n\n' + m[1] + "\n";
            // index of where the match starts
            const cursorPos = m.index;

            ProcesarLinea1(m[1]);
            ProcesarLinea2(m[2]);
            ProcesarLinea3(m[4]);
            ProcesarLinea4(m[6]);
        }

        return res;
        //return ProcesarLinea1();
        
    }
}




module.exports = ClientController

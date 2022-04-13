'use strict'

/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| Http routes are entry points to your web application. You can create
| routes for different URLs and bind Controller actions to them.
|
| A complete guide on routing is available here.
| http://adonisjs.com/docs/4.1/routing
|
*/

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use('Route')

Route.group(() => {
  Route.post('usuarios/signup', 'UserController.signup');
  Route.post('usuarios/login', 'UserController.login');

  Route.get('file', 'ClientController.file');

}).prefix('api/v1/');

Route.get('/', () => {
  return { greeting: 'Esta ruta devuelve un saludo :) Andres' }
})



/*() => {
  return { mensaje: 'Hola, registro de usuario nuevo' }
})*/

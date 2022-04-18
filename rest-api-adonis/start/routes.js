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
  // Login
  Route.post('usuarios/signup', 'UserController.signup');
  Route.post('usuarios/login', 'UserController.login');
  Route.post('usuarios/logout', 'UserController.logout');

  // Iniciar y finalizar el proceso de obtener los datos de la API
  Route.get('iniProceso', 'ManagerController.iniProceso');
  Route.get('finProceso', 'ManagerController.finProceso');
  Route.get('borrarTodo', 'ManagerController.borrarTodo');

  // Obtiene los datos de los clientes
  Route.get('clientes', 'ClientController.clientes');
  Route.get('clientes/cliente/:id', 'ClientController.cliente');

  // Obtiene los datos de pagos realizados y que se realizarán
  Route.get('pagos/cliente/:id', 'PagoController.pagos');

    // Obtiene los datos de transacciones de un cliente
    Route.get('transacciones/cliente/:id', 'TransaccionController.transacciones');

}).prefix('api/v1/');

Route.get('/', () => {
  return { greeting: 'Bienvenido/a :)' }
})

/*() => {
  return { mensaje: 'Hola, registro de usuario nuevo' }
})*/

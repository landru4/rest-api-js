'use strict'

const { resolveSerializer } = require("../../Models/Client");
const User = use('App/Models/User');

class UserController {

    async login({ request, auth }) {
        const { email, password } = request.all();
        const token = await auth.attempt(email, password);
        return token;
    }

    async signup({ request }) {
        const { email, password } = request.all();
        console.log(email, password);
        const user = await User.create({
            //username,
            email,
            password,
            username: email
        });
        return this.login(...arguments);
        //return user;
    };

    async logout({ request, response, auth }) { 

        try {
            //request.auth.logout()
            await auth.check()
            const user = await auth.getUser()
            await user
            .tokens()
            .orderBy('created_at', 'desc')
            .limit(1)
            //.where('token', [apiToken])
            .update({ is_revoked: true })
            console.log('Usuario hizo logout')
        } catch (error) {
            console.log('Token invalido o ausente')
            console.log(error)
            return 'Token invalido o ausente'
        }
      return response.send('Chau!')
  }
}

module.exports = UserController

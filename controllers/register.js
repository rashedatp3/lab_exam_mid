const express = require("express");
const router = express.Router();
const Users = require("../models/users");
const { check, validationResult } = require('express-validator');

router.all('/', (request, response, next) => {
    if(request.cookies['userid']!=null) {
        response.redirect('/home');
    } else {
        next();
    }
});

router.get('/', (request, response)=>{
    response.render('register');
});

router.post('/', [
    check('name', 'Name is required').not().isEmpty().trim(),
    check('contact', 'Contact No is required').not().isEmpty().trim(),
    check('username','Username is required').not().isEmpty().trim(),
    check('password', 'Password is required').not().isEmpty().trim(),
], (request, response)=>{
    
    let name = request.body.name ? request.body.name : '';
    let contact = request.body.contact ? request.body.contact : '';
    let username = request.body.username ? request.body.username : '';    
    let password = request.body.password ? request.body.password : '';
    
    const errors = validationResult(request);

    if(errors.errors.length>0) {
        response.write('<html>');
        response.write('<body>');
        errors.errors.forEach(error => {
            response.write('<p>'+error.msg+'</p>');
        });
        response.write('</body>');
        response.write('</html>');
        return response.end();
    }

    return Users.insert({
        name : name,
        username : username,
        password : password,
        contact : contact,
        role : 'customer'
    }, status => {
        if(status) {
            response.write('<html>');
            response.write('<body>');
            response.write('<p>You\'ve Registered Successfully<br><a href="/login">Please Login</a></p>');
            response.write('</body>');
            response.write('</html>');
            response.end(); 
        } else {
            response.write('<html>');
            response.write('<body>');
            response.write('<p>Something went wrong. Please try again</p>');
            response.write('</body>');
            response.write('</html>');
            response.end(); 
        }
    });

})

module.exports = router;
const express = require("express");
const router = express.Router();
const Users = require("../models/users"); 
const Categories = require("../models/categories"); 
const { check, validationResult } = require('express-validator');

router.all('*', (request, response, next) => {
    if(request.cookies['userid']!=null) {
        Users.getById(request.cookies['userid'], result => {
            if(result) {
                request.user = result;
                next();
            }
        });
    } else {
        response.redirect('/');
    }
});

router.get('/logout', (request, response)=>{
    response.clearCookie('userid');
    response.redirect('/');
});

router.get('/', (request, response)=>{
    response.render('home/index', {logged: request.user});
});

router.get('/profile', (request, response)=>{
    response.render('home/profile/index', {logged: request.user});
});

router.post('/profile', [
    check('name', 'Name is required').not().isEmpty().trim(),
    check('contact', 'Contact Nois required').not().isEmpty().trim(),
    check('username','Username is required').not().isEmpty().trim(),
], (request, response)=>{

    let name = request.body.name ? request.body.name : '';
    let contact = request.body.contact ? request.body.contact : '';
    let username = request.body.username ? request.body.username : '';    
    let password = request.body.password ? (request.body.password != '' && request.user.password!= request.body.password ? request.body.password : request.user.password) : request.user.password;
    
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

    return Users.update({
        name : name,
        username : username,
        password : password,
        contact : contact,
        id : request.user.id
    }, status => {
        if(status) {
            response.write('<html>');
            response.write('<body>');
            response.write('<p>Information Saved Successfully</p>');
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

});

router.get('/category', (request, response)=>{
    if(request.user.role=='admin') {
        Categories.getAll(results => {
            response.render('home/category/index', {logged: request.user, categories: results.length>0 ? results : []});
        });
    } else {
        response.redirect('/home');
    }
});


router.get('/category/add', (request, response)=>{
    if(request.user.role=='admin') {
        response.render('home/category/add', {logged: request.user});
    } else {
        response.redirect('/home');
    }
});

router.post('/category/add', [
    check('name', 'Name is required').not().isEmpty().trim(),
], (request, response)=>{
    if(request.user.role=='admin') {
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

        return Categories.insert(request.body.name, status => {
            if(status) {
                response.write('<html>');
                response.write('<body>');
                response.write('<p>Category Added Successfully</p>');
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
    } else {
        response.redirect('/home');
    }
});

module.exports = router;
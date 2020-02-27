const express = require("express");
const router = express.Router();
const Users = require("../models/users"); 
const Products = require("../models/products"); 
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
    response.redirect('/login');
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
            response.render('home/category/index', {logged: request.user, categories: results && results.length>0 ? results : []});
        });
    } else {
        response.redirect('/home');
    }
});


router.get('/product/add', (request, response)=>{
    if(request.user.role=='admin') {
        response.render('home/product/add', {logged: request.user});
    } else {
        response.redirect('/home');
    }
});

router.post('/product/add', [
    check('title', 'Title is required').not().isEmpty().trim(),
    check('description', 'Description is required').not().isEmpty().trim(),
    check('image', 'Image is required').not().isEmpty().trim(),
    check('sizes', 'Sizes is required').not().isEmpty().trim(),
    check('category', 'Category is required').not().isEmpty().trim(),
    check('gender', 'Gender is required').not().isEmpty().trim(),
    check('price', 'Price is required').not().isEmpty().trim(),
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

        return Products.insert({
            title : request.body.title,
            description : request.body.description,
            image : request.body.image,
            sizes : request.body.sizes,
            category : request.body.category,
            gender : request.body.gender,
            price : request.body.price
        }, status => {
            if(status) {
                response.write('<html>');
                response.write('<body>');
                response.write('<p>Product Added Successfully</p>');
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

router.get('/product/update/:id', (request, response) => {
    if(request.user.role=='admin') {
        return Products.getById(request.params.id, result => {
            if(result) {
                response.render('home/product/update', {logged: request.user, product: result});
            } else {
                response.write('<html>');
                response.write('<body>');
                response.write('<p>Product Not Found</p>');
                response.write('</body>');
                response.write('</html>');
                response.end(); 
            }
        });
    } else {
        response.redirect('/home');
    }
});


router.post('/product/update/:id',[
    check('title', 'Title is required').not().isEmpty().trim(),
    check('description', 'Description is required').not().isEmpty().trim(),
    check('image', 'Image is required').not().isEmpty().trim(),
    check('sizes', 'Sizes is required').not().isEmpty().trim(),
    check('category', 'Category is required').not().isEmpty().trim(),
    check('gender', 'Gender is required').not().isEmpty().trim(),
    check('price', 'Price is required').not().isEmpty().trim(),
], (request, response) => {
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

        return Products.update({
            title : request.body.title,
            description : request.body.description,
            image : request.body.image,
            sizes : request.body.sizes,
            category : request.body.category,
            gender : request.body.gender,
            price : request.body.price,
            id : request.params.id
        }, status => {
            if(status) {
                response.write('<html>');
                response.write('<body>');
                response.write('<p>Product Updated Successfully</p>');
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

router.get('/product/delete/:id', (request, response) => {
    if(request.user.role=='admin') {
        return Products.getById(request.params.id, result => {
            if(result) {
                return Products.delete(result.id, result => {
                    if(result) {
                        response.redirect('/home/product');
                    } else {
                        response.write('<html>');
                        response.write('<body>');
                        response.write('<p>Something went wrong. Please Try again</p>');
                        response.write('</body>');
                        response.write('</html>');
                        return response.end(); 
                    }
                });
                
            } else {
                response.write('<html>');
                response.write('<body>');
                response.write('<p>Product Not Found</p>');
                response.write('</body>');
                response.write('</html>');
                response.end(); 
            }
        });
    } else {
        response.redirect('/home');
    }
});

router.get('/product', (request, response)=>{
    if(request.user.role=='admin') {
        Products.getAll(results => {
            response.render('home/product/index', {logged: request.user, products: results && results.length>0 ? results : []});
        });
    } else {
        response.redirect('/home');
    }
});

router.get('/customer', (request, response)=>{
    if(request.user.role=='admin') {
        Users.getCustomer(results => {
            response.render('home/customer/index', {logged: request.user, customers: results && results.length>0 ? results : []});
        });
    } else {
        response.redirect('/home');
    }
});

router.get('/customer/update/:id', (request, response) => {
    if(request.user.role=='admin') {
        return Users.getById(request.params.id, result => {
            if(result) {
                response.render('home/customer/update', {logged: request.user, user: result});
            } else {
                response.write('<html>');
                response.write('<body>');
                response.write('<p>Customer Not Found</p>');
                response.write('</body>');
                response.write('</html>');
                response.end(); 
            }
        });
    } else {
        response.redirect('/home');
    }
});


router.post('/customer/update/:id',[
    check('name', 'Name is required').not().isEmpty().trim(),
    check('contact', 'Contact No is required').not().isEmpty().trim(),
    check('username','Username is required').not().isEmpty().trim(),
], (request, response) => {
    if(request.user.role=='admin') {
        return Users.getById(request.params.id, result => {
            if(result) {
                let name = request.body.name ? request.body.name : '';
                let contact = request.body.contact ? request.body.contact : '';
                let username = request.body.username ? request.body.username : '';    
                let password = request.body.password ? (request.body.password != '' && result.password!= request.body.password ? request.body.password : result.password) : result.password;

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
                    id : result.id
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
            } else {
                response.write('<html>');
                response.write('<body>');
                response.write('<p>Customer Not Found</p>');
                response.write('</body>');
                response.write('</html>');
                response.end(); 
            }
        });
    } else {
        response.redirect('/home');
    }
});

router.get('/customer/delete/:id', (request, response) => {
    if(request.user.role=='admin') {
        return Users.getById(request.params.id, result => {
            if(result) {
                return Users.delete(result.id, result => {
                    if(result) {
                        response.redirect('/home/customer');
                    } else {
                        response.write('<html>');
                        response.write('<body>');
                        response.write('<p>Something went wrong. Please Try again</p>');
                        response.write('</body>');
                        response.write('</html>');
                        return response.end(); 
                    }
                });
                
            } else {
                response.write('<html>');
                response.write('<body>');
                response.write('<p>Customer Not Found</p>');
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
const express = require("express");
const router = express.Router();
const Products = require("../models/products"); 

router.get('/', (request, response) => {
    Products.getCategories(categories => {
        if(categories) {
            Products.getGenders(genders => {
                if(genders) {
                    response.render('index', {categories:categories, genders:genders});
                } else {
                    response.render('index', {categories:categories, genders:[]});
                }
            });  
        } else {
            response.render('index', {categories:[], genders:[]});
        }
    }) 
});

module.exports = router;
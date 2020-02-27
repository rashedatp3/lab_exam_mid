const database = require("./database");

exports.getById = (id, callback) => {
    const sql = "SELECT * FROM `product` WHERE `id` = ? ORDER BY `id` DESC LIMIT 0, 1";
    database.getResult(sql, [id], result=> {
        if(result.length>0)
        callback(result[0]);
        else
        callback(null);
    });
};

exports.getAll = (callback) => {
    const sql = "SELECT * FROM `product` ORDER BY `id` DESC";
    database.getResult(sql, null, result=> {
        if(result.length && result.length>0)
        callback(result);
        else
        callback(null);
    });
};

exports.getCategories = (callback) => {
    const sql = "SELECT DISTINCT `category` AS `name` FROM `product` ORDER BY `id` DESC";
    database.getResult(sql, null, result=> {
        if(result.length && result.length>0)
        callback(result);
        else
        callback(null);
    });
};

exports.getGenders = (callback) => {
    const sql = "SELECT DISTINCT `gender` AS `name` FROM `product` ORDER BY `id` DESC";
    database.getResult(sql, null, result=> {
        if(result.length && result.length>0)
        callback(result);
        else
        callback(null);
    });
};

exports.insert = (product, callback) => {
    const sql = "INSERT INTO `product` VALUES ( ?, ?, ?, ?, ?, ?, ?, ?)";
    database.execute(sql, [
        null,
        product.title,
        product.description,
        product.image,
        product.sizes,
        product.category,
        product.gender,
        product.price
    ], status=> {
        if(status)
        callback(true);
        else
        callback(false);
    });
};

exports.update = (product, callback) => {
    const sql = "UPDATE `product` SET `title` = ?, `description` = ?, `image` = ?, `sizes` = ?, `category` = ?, `gender` = ?, `price` = ? WHERE `id` = ?";
    database.execute(sql, [
        product.title,
        product.description,
        product.image,
        product.sizes,
        product.category,
        product.gender,
        product.price,
        product.id
    ], status=> {
        if(status)
        callback(true);
        else
        callback(false);
    });
};

exports.delete = (id, callback) => {
    const sql = "DELETE FROM `product` WHERE `id` = ?";
    database.execute(sql, [id], status=> {
        if(status)
        callback(true);
        else
        callback(false);
    });
};
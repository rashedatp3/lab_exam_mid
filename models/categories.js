const database = require("./database");

exports.getById = (id, callback) => {
    const sql = "SELECT * FROM `category` WHERE `id` = ? ORDER BY `id` DESC LIMIT 0, 1";
    database.getResult(sql, [id], result=> {
        if(result.length>0)
        callback(result[0]);
        else
        callback(null);
    });
};

exports.getAll = (callback) => {
    const sql = "SELECT * FROM `category` ORDER BY `id` DESC";
    database.getResult(sql, null, result=> {
        if(result.length && result.length>0)
        callback(result);
        else
        callback(null);
    });
};

exports.insert = (category, callback) => {
    const sql = "INSERT INTO `category` VALUES ( ?, ?)";
    database.execute(sql, [null, category], status=> {
        if(status)
        callback(true);
        else
        callback(false);
    });
};

exports.update = (category, callback) => {
    const sql = "UPDATE `category` SET `name` = ? WHERE `id` = ?";
    database.execute(sql, [category.name, category.id], status=> {
        if(status)
        callback(true);
        else
        callback(false);
    });
};

exports.delete = (id, callback) => {
    const sql = "DELETE FROM `category` WHERE `id` = ?";
    database.execute(sql, [id], status=> {
        if(status)
        callback(true);
        else
        callback(false);
    });
};
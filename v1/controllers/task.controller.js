const Task = require("../models/task.model");

// [GET] /api/v1/tasks
module.exports.index = async (req, res) => {
    const find = {
        deleted: false,
    }

    if(req.query.status){
        find.status = req.query.status;
    }

    // Sắp xếp
    const sort = {};

    if(req.query.sortKey && req.query.sortValue){
        sort[req.query.sortKey] = req.query.sortValue;
    };
    //Hết sắp xếp

    //Phân trang
    const pagination = {
        limit: 2,
        page: 1,
    };

    if(req.query.page) {
        pagination.page = parseInt(req.query.page);
    }

    if(req.query.limit) {
        pagination.limit = parseInt(req.query.limit);
    }

    const skip = (pagination.page - 1) * pagination.limit;
    //Hết phân trang

    const tasks = await Task
    .find(find)
    .sort(sort)
    .limit(pagination.limit)
    .skip(skip);


    // trả về chuỗi json lên đường link
    res.json(tasks);
}

// [GET] /api/v1/tasks/detail/:id
module.exports.detail = async (req, res) => {
    const id = req.params.id;

    const task = await Task.findOne({
        _id: id,
        deleted: false,
    });

    // trả về chuỗi json lên đường link
    res.json(task);
}
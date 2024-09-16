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

    //Tìm kiếm
    // Thêm regex vào cho tìm kiếm chuẩn hơn
    if(req.query.keyword) {
        //Thêm chữ i để không phân biệt chữ hoa chữ thường
        const regex = new RegExp(req.query.keyword, "i");
        find.title = regex;
    }
    //End tìm kiếm

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

// [PATCH] /api/v1/tasks/change-status/:id
module.exports.changeStatus = async (req, res) => {
    try {
        const id = req.params.id;
        const status = req.body.status;
        
        await Task.updateOne({
            _id: id,
        }, {
            status: status,
        });
    
        res.json({
            code: 200,
            message: "Cập nhật trạng thái thành công!",
        });
    } catch (error) {
        // console.log(error);
        res.json({
            code: 400,
            message: "Không tồn tại bản ghi!",
            // trả ra lỗi
            // error: error,
        });
    }
}
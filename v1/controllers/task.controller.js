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

// [PATCH] /api/v1/tasks/change-multi/:id
module.exports.changeMulti = async (req, res) => {
    try {
        const { ids, status } = req.body;
    
        const listStatus = ["initial", "doing", "finish", "pending", "notFinish"];
    
        // dùng để check xem trạng thái có bao gồm các trạng thái hợp lệ hay không, nếu không có trạng thái hợp lệ sẽ trả ra code 400
        if(listStatus.includes(status)) {
            await Task.updateMany({
                _id: { $in: ids },
            }, {
                status: status,
            });
        
            res.json({
                code: 200,
                message: "Đổi trạng thái thành công!",
            });
        } else {
            res.json({
                code: 400,
                message: `Trạng thái ${status} không hợp lệ`,
            });
        }
    } catch (error) {
        res.json({
            code: 400,
            message: `Không tồn tại id này`,
        });
    }

};

// [POST] /api/v1/tasks/create
module.exports.create = async (req, res) => {
    const task = new Task(req.body);
    await task.save();

    res.json({
        code: 200,
        message: "Tạo công việc thành công!",
    });
};

// [PATCH] /api/v1/tasks/edit/:id
module.exports.edit = async (req, res) => {
    try {
        const id = req.params.id;
        const data = req.body;
    
        await Task.updateOne({
            _id: id,
        }, data);
    
        res.json({
            code: 200,
            message: "Cập nhật công việc thành công!",
        });
    } catch (error) {
        res.json({
            code: 200,
            message: "Cập nhật công việc không thành công!",
        });
    }
};

// [PATCH] /api/v1/tasks/delete/:id
module.exports.delete = async (req, res) => {
    // try catch bắt lỗi nếu nhập sai id để không bị break server
    try {
        const id = req.params.id;
    
        await Task.updateOne({
            _id: id,
        }, {
            deleted: true,
            deletedAt: new Date(),
        });
    
        res.json({
            code: 200,
            message: "Xoá thành công!",
        });
    } catch (error) {
        res.json({
            code: 400,
            message: "Không tồn tại id này!",
        });
    }
};

    
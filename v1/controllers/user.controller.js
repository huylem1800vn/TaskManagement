const md5 = require("md5");

const User = require("../models/user.model");
const generate = require("../../helpers/generate.helper");

// [POST] /api/v1/users/register
module.exports.register = async (req, res) => {
    const existEmail = await User.findOne({
        email: req.body.email,
        deleted: false,
    });

    if(existEmail) {
        res.json({
            code: 200,
            message: "Email đã tồn tại!",
        });
        return;
    }

    const dataUser = {
        fullName: req.body.fullName,
        email: req.body.email,
        password: md5(req.body.password),
        token: generate.generateRandomString(30),
    };

    const user = new User(dataUser);
    await user.save();

    // lấy token để lưu vào trong cookies
    const token = user.token;

    res.json({
        code: 200,
        message: "Đăng ký tài khoản thành công!",
        token: token,
    });
};
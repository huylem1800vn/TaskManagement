const md5 = require("md5");

const User = require("../models/user.model");
const ForgotPassword = require("../models/forgot-password.model");
const generateHelper = require("../../helpers/generate.helper");
const sendEmailHelper = require("../../helpers/sendEmail.helper");


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
        token: generateHelper.generateRandomString(30),
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

// [POST] /api/v1/users/login
module.exports.login = async (req, res) => {
    const email = req.body.email;
    const password = req.body.password;

    const existUser = await User.findOne({
        email: email,
        deleted: false,
    })

    if(!existUser) {
        res.json({
            code: 400,
            message: "Email không tồn tại!",
        });
        return;
    }

    if(md5(password) != existUser.password) {
        res.json({
            code: 400,
            message: "Mật khẩu không đúng!",
        });
        return;
    }

    const token = existUser.token;

    res.json({
        code: 200,
        message: "Đăng nhập thành công!",
        token: token,
    });
};

// [POST] /api/v1/users/password/forgot
module.exports.passwordForgot = async (req, res) => {
    const email = req.body.email;
    const existUser = await User.findOne({
        email: req.body.email,
        deleted: false,
    })

    if(!existUser) {
        res.json({
            code: 400,
            message: "Email không tồn tại!",
        });
        return;
    }

    // tạo chuỗi OTP gồm 6 số
    const otp = generateHelper.generateRandomNumber(6);

    // Việc 1: Lưu email vào database
    const objectForgotPassword = {
        email: req.body.email,
        otp: otp,
        // 3*60*1000 là 3 phút đc quy ra đơn vị
        expireAt: Date.now() + 3*60*1000,
    };
    console.log(objectForgotPassword);
    
    const forgotPassword = new ForgotPassword(objectForgotPassword);
    await forgotPassword.save();

    // Việc 2: Gửi mã OTP qua mail cho người dùng
    const subject = "Password Reset OTP Verification";
    const text = `Dear ${existUser.fullName},

    You recently requested to reset your password for your account. Please use the following One-Time Password (OTP) to verify your identity and complete the password reset process:
    
    OTP Code: ${otp}
    
    This OTP is valid for a limited time and should be used immediately. If you did not request a password reset, please ignore this email.
    
    Thank you for using our services.
    
    Best regards,
    HMH Company`;
    sendEmailHelper.sendEmail(email, subject, text);


    res.json({
        code: 200,
        message: "Đã gửi mã OTP qua email",
    });
};
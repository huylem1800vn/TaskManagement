const express = require ("express");
const router = express.Router();

const Task = require("../../models/task.model");

router.get("/", async (req, res) => {
    const tasks = await Task.find({
        deleted: false,
    });

    // trả về chuỗi json lên đường link
    res.json(tasks);
});

router.get("/detail/:id", async (req, res) => {
    const id = req.params.id;

    const tasks = await Task.findOne({
        _id: id,
        deleted: false,
    });

    // trả về chuỗi json lên đường link
    res.json(tasks);
});

module.exports = router;
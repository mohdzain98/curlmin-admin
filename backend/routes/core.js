const express = require("express");
const router = express.Router();
const { fn, col, literal } = require("sequelize");
const User = require("../models/User");
const Url = require("../models/Url");
const Cmqr = require("../models/Cmqr");
const Subc = require("../models/Subc");
const Sust = require("../models/Sust");
const UserCounts = require("../models/Urlcount");

const serviceModel = {
  urls: Url,
  qrs: Cmqr,
  bcs: Subc,
  cts: Sust,
};

const getCounts = async (model, res) => {
  try {
    const result = await model.findAll({
      attributes: [
        [fn("COUNT", col("*")), "totalCount"], // Count all rows
        [
          fn("SUM", literal(`CASE WHEN userId = 'default' THEN 1 ELSE 0 END`)),
          "defaultCount",
        ], // Count only 'default' userIds
      ],
      raw: true,
    });

    const totalCount = result[0]?.totalCount || 0;
    const defaultCount = result[0]?.defaultCount || 0;

    res.json({
      success: true,
      data: { totalCount, defaultCount },
      length: totalCount,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Some Error Occurred");
  }
};

const fetchData = async (model) => {
  return await model.findAll();
};

router.get("/getusers", async (req, res) => {
  try {
    const flag = req.query.flag === "true";
    const data = await User.find({});
    let dataCounts = "";
    if (flag) {
      dataCounts = await UserCounts.find({});
    }
    if (data && flag) {
      res.json({
        success: true,
        data,
        dataCounts,
        length: Object.keys(data).length,
      });
    } else if (data && !flag) {
      res.json({
        success: true,
        data,
        length: Object.keys(data).length,
      });
    } else {
      res.status(400).json({ success: false, msg: "users not found" });
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Some Error Occured");
  }
});

router.get("/geturls", async (req, res) => {
  await getCounts(Url, res);
});

router.get("/getqrs", async (req, res) => {
  await getCounts(Cmqr, res);
});

router.get("/getbcs", async (req, res) => {
  await getCounts(Subc, res);
});

router.get("/getcts", async (req, res) => {
  await getCounts(Sust, res);
});

router.get("/getdata", async (req, res) => {
  try {
    const service = req.query.serv;
    const model = serviceModel[service];
    if (!model) {
      return res
        .status(400)
        .json({ success: false, msg: "Invalid service type" });
    }

    const data = await fetchData(model);
    res.json({ success: true, data });
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({ success: false, msg: "Internal Server Error" });
  }
});

router.delete("/delete/:serv", async (req, res) => {
  const { serv } = req.params;
  const { uid, userId } = req.body;
  const decrementField =
    serv === "urls"
      ? { urlCount: -1 }
      : serv === "qrs"
      ? { qrCount: -1 }
      : serv === "bcs"
      ? { barcodeCount: -1 }
      : serv === "cts"
      ? { curltagCount: -1 }
      : null;

  try {
    const model = serviceModel[serv];
    const url = await model.findOne({ where: { uid } });

    if (!url) {
      return res.status(404).json({ success: false, msg: "URL not found" });
    }
    await model.destroy({ where: { uid } });
    await UserCounts.updateOne({ userId }, { $inc: decrementField });

    res.status(200).json({ success: true, msg: "URL deleted successfully" });
  } catch (err) {
    console.error("Error deleting URL:", err);
    res.status(500).json({ success: false, msg: "Internal server error" });
  }
});

module.exports = router;

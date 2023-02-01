const sequelize = require("../models/index");
const init_models = require("../models/init-models");
const { successCode, failCode, errorCode } = require("../untils/respone");
const model = init_models(sequelize);

const get_contact_messs = async (req, res) => {
  try {
    const getAllContact = await model.users.findAll({
      include: [
        "select_types",
        "persionalities",
        "departments",
        "content_messages",
      ],
      attributes: { exclude: ["_password", "email"] },
    });
    successCode(res, getAllContact, "Get Success");
  } catch (error) {
    errorCode(res, "Error BackEnd");
  }
};

const send_mess = async (req, res) => {
  try {
    let { id } = req.params; //id_user
    let { text_mes, date_mes, status } = req.body;
    let data = { text_mes, date_mes, status, id_user: id };
    await model.content_message.create(data);
    successCode(res, "", "Success");
  } catch (error) {
    errorCode(res, "Error BackEnd");
  }
};

const delete_mes = async (req, res) => {
  try {
    let { id } = req.params; //id_content_mes
    await model.content_message.destroy({ where: { id_content: id } });
    successCode(res, "", "Delete Success");
  } catch (error) {
    errorCode(res, "Error BackEnd");
  }
};

const send_media = async (req, res) => {
  try {
    let { id } = req.params; //id_user
    let data = req.files;
    console.log("daaatssa", data);
    Promise.all(
      data.map((ele) => {
        let image_url = "http://110.35.173.82:8081" + "/" + ele.path;
        console.log(image_url);
        // await model.media_message.create({ image_url, id_user: id });
      })
    );
    successCode(res, "", "Success");
  } catch (error) {
    console.log("errrorr", error);
    failCode(res, "Error BackEnd");
  }
};
const send_files = async (req, res) => {
  try {
    let { id } = req.params; //id_user
    let data = req.files;
    console.log("daaatssa", data);
    Promise.all(
      data.map((ele) => {
        let image_url = "http://110.35.173.82:8081" + "/" + ele.path;
        console.log(image_url);
        // await model.media_message.create({ image_url, id_user: id });
      })
    );
    successCode(res, "", "Success");
  } catch (error) {
    console.log("errrorr", error);
    failCode(res, "Error BackEnd");
  }
};
const send_links = async (req, res) => {};

module.exports = {
  get_contact_messs,
  send_mess,
  delete_mes,
  send_media,
  send_files,
  send_links,
};

const sequelize = require("../models/index");
const init_models = require("../models/init-models");
const { successCode, failCode, errorCode } = require("../untils/respone");
const model = init_models(sequelize);
const moment = require("moment");
const fs = require("fs");
const path = require("path");

const get_all_contact = async (req, res) => {
  let { id } = req.params;
  try {
    let getAllContact = await model.users.findAll({
      include: ["content_messages"],
      attributes: { exclude: ["_password", "email"] },
    });
    getAllContact = JSON.parse(JSON.stringify(getAllContact));
    let getAllNewContact = getAllContact.filter((ele) => ele.id_user != id);
    successCode(res, getAllNewContact, "Success");
  } catch (error) {
    errorCode(res, "Error BackEnd");
  }
};

const get_contact_messs = async (req, res) => {
  let { id } = req.params; //id user
  try {
    const get_id_Contact = await model.users.findAll({
      include: [
        "select_types",
        "persionalities",
        "departments",
        "media_messages",
        "links_messages",
        "file_messages",
      ],
      where: { id_user: id },
      attributes: { exclude: ["_password", "email"] },
    });
    const content_messages = await model.messages.findAll({
      where: { id_user_send: id },
      include: ["id_user_receive_mess_receive", "id_user_send_mess_send"],
    });
    successCode(
      res,
      { ...get_id_Contact, content_messages: content_messages },
      "Get Success"
    );
  } catch (error) {
    errorCode(res, "Error BackEnd");
  }
};

const send_mess = async (req, res) => {
  try {
    let { id } = req.params; //id_user
    let today = moment();
    let { msg, id_user_send, id_user_receive } = req.body;
    let avatar_send = await model.users.findByPk(id_user_send);
    let avatar_receive = await model.users.findByPk(id_user_receive);
    let data = {
      msg,
      today,
      status: false,
      id_user: id,
      id_user_send,
      id_user_receive,
      avatar_send: avatar_send.image_url,
      avatar_receive: avatar_receive.image_url,
    };
    await model.mess_sends.create({
      msg,
      today,
      status: false,
      id_user: id,
      id_user_send,
      avatar_send: avatar_send.image_url,
    });
    await model.mess_receive.create({
      msg,
      today,
      status: false,
      id_user: id,
      id_user_receive,
      avatar_receive: avatar_receive.image_url,
    });
    await model.messages.create({
      id_user: id,
      id_user_receive,
      id_user_send,
    });
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
    let today = moment();
    console.log("daaatssa", data);
    Promise.all(
      data.map(async (ele) => {
        let image_url = "http://110.35.173.82:8081" + "/" + ele.path;
        await model.media_message.create({
          images: image_url,
          today: today,
          size: ele.size,
          original_name: ele.originalname,
          id_user: id,
        });
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
    let today = moment();
    console.log("daaatssa", data);
    Promise.all(
      data.map(async (ele) => {
        let file_url = "http://110.35.173.82:8081" + "/" + ele.path;
        await model.file_message.create({
          files: file_url,
          today: today,
          size: ele.size,
          original_name: ele.originalname,
          id_user: id,
        });
      })
    );
    successCode(res, "", "Success");
  } catch (error) {
    console.log("errrorr", error);
    failCode(res, "Error BackEnd");
  }
};
const send_links = async (req, res) => {
  try {
    let { id } = req.params;
    let { links } = req.body;
    let today = moment();
    let data = { links, id_user: id, today: today };
    await model.links_message.create(data);
    successCode(res, "", "Success");
  } catch (error) {
    errorCode(res, "Error BackEnd");
  }
};

const delete_media = async (req, res) => {
  try {
    let { id } = req.params; // id media
    let pathLinks = await model.media_message.findByPk(id);
    console.log(pathLinks);
    let pathSubstring = JSON.parse(JSON.stringify(pathLinks));
    pathSubstring = pathSubstring.images.substring(25);
    fs.unlinkSync(process.cwd() + "/" + pathSubstring);
    await model.media_message.destroy({ where: { id_media: id } });
    successCode(res, "", "Success");
  } catch (error) {
    console.log(error);
    errorCode(res, "Error BackEnd");
  }
};
const delete_file = async (req, res) => {
  try {
    let { id } = req.params; // id file
    let pathLinks = await model.file_message.findByPk(id);
    console.log(pathLinks);
    let pathSubstring = JSON.parse(JSON.stringify(pathLinks));
    pathSubstring = pathSubstring.images.substring(25);
    fs.unlinkSync(process.cwd() + "/" + pathSubstring);
    await model.file_message.destroy({ where: { id_file: id } });
    successCode(res, "", "Success");
  } catch (error) {
    console.log(error);
    errorCode(res, "Error BackEnd");
  }
};

const delete_links = async (req, res) => {
  try {
    let { id } = req.params; //id links
    await model.links_message.destroy({ where: { id_links } });
    successCode(res, "", "Success");
  } catch (error) {
    errorCode(res, "BackEnd");
  }
};

module.exports = {
  get_contact_messs,
  get_all_contact,
  send_mess,
  delete_mes,
  send_media,
  send_files,
  send_links,
  delete_media,
  delete_file,
  delete_links,
};

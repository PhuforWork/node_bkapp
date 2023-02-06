const sequelize = require("../models/index");
const init_models = require("../models/init-models");
const { successCode, failCode, errorCode } = require("../untils/respone");
const model = init_models(sequelize);
const moment = require("moment");
const fs = require("fs");
const path = require("path");

const get_all_contact = async (req, res) => {
  let { id_send, id_receive } = req.params;
  try {
    let getAllContact = await model.users.findAll({
      include: ["content_messages"],
      attributes: { exclude: ["_password", "email"] },
    });
    getAllContact = await JSON.parse(JSON.stringify(getAllContact));
    let getAllNewContact = getAllContact.filter((ele) =>
      ele.content_messages.some(
        (ele) =>
          ele.id_user_send === id_send * 1 &&
          ele.id_user_receive == id_receive * 1
      )
    );
    successCode(res, getAllNewContact, "Success");
  } catch (error) {
    errorCode(res, "Error BackEnd");
  }
};

const get_contact_messs = async (req, res) => {
  let { id_send, id_receive } = req.params; //id user
  console.log("params", { id_send, id_receive });
  try {
    let get_id_Contact = await model.users.findAll({
      include: [
        "select_types",
        "persionalities",
        "departments",
        "content_messages",
        "media_messages",
        "links_messages",
      ],
      attributes: { exclude: ["_password", "email"] },
    });
    get_id_Contact = await JSON.parse(JSON.stringify(get_id_Contact));
    let get_contact_by = getAllContact.filter((ele) =>
      ele.content_messages.some(
        (ele) =>
          ele.id_user_send === id_send * 1 &&
          ele.id_user_send === id_receive * 1 &&
          ele.id_user_receive === id_send * 1 &&
          ele.id_user_receive === id_receive * 1
      )
    );
    successCode(res, get_contact_by, "Get Success");
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
    let group = id_user_send * 1 + id_user_receive * 1;
    let data_send = {
      msg,
      today,
      status: false,
      id_user: id_user_send,
      id_user_send,
      id_user_receive,
      group: group,
      avatar_send: avatar_send.image_url,
      avatar_receive: avatar_receive.image_url,
    };
    let data_receive = {
      msg,
      today,
      status: false,
      id_user: id_user_receive,
      id_user_send,
      id_user_receive,
      group: group,
      avatar_send: avatar_send.image_url,
      avatar_receive: avatar_receive.image_url,
    };
    await model.content_message.create(data_send);
    await model.content_message.create(data_receive);
    successCode(res, "", "Success");
  } catch (error) {
    errorCode(res, "Error BackEnd");
  }
};
//
const set_status_mes = async (req, res) => {
  try {
    let { id } = req.params; // id content
    let status = true;
    await model.content_message.update(status, { where: { id_content: id } });
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
    let { id_user_send, id_user_receive } = req.body;
    let group = id_user_send * 1 + id_user_receive * 1;
    let today = moment();
    Promise.all(
      data.map(async (ele) => {
        let avatar_send = await model.users.findByPk(id_user_send);
        let avatar_receive = await model.users.findByPk(id_user_receive);
        let media = "http://110.35.173.82:8081" + "/" + ele.path;
        await model.media_message.create({
          media: media,
          today: today,
          size: ele.size,
          original_name: ele.originalname,
          id_user: id_user_send,
        });
        await model.media_message.create({
          media: media,
          today: today,
          size: ele.size,
          original_name: ele.originalname,
          id_user: id_user_receive,
        });
        await model.content_message.create({
          today,
          status: false,
          media: media,
          id_user: id_user_send,
          id_user_send,
          group: group,
          id_user_receive,
          avatar_send: avatar_send.image_url,
          avatar_receive: avatar_receive.image_url,
        });
        await model.content_message.create({
          today,
          status: false,
          media: media,
          id_user: id_user_receive,
          id_user_send,
          id_user_receive,
          group: group,
          avatar_send: avatar_send.image_url,
          avatar_receive: avatar_receive.image_url,
        });
      })
    );
    successCode(res, "", "Success");
  } catch (error) {
    failCode(res, "Error BackEnd");
  }
};
// const send_files = async (req, res) => {
//   try {
//     let { id } = req.params; //id_user
//     let data = req.files;
//     let today = moment();
//     console.log("daaatssa", data);
//     Promise.all(
//       data.map(async (ele) => {
//         let file_url = "http://110.35.173.82:8081" + "/" + ele.path;
//         await model.file_message.create({
//           files: file_url,
//           today: today,
//           size: ele.size,
//           original_name: ele.originalname,
//           id_user: id,
//         });
//       })
//     );
//     successCode(res, "", "Success");
//   } catch (error) {
//     console.log("errrorr", error);
//     failCode(res, "Error BackEnd");
//   }
// };
// const send_links = async (req, res) => {
//   try {
//     let { id } = req.params;
//     let { links } = req.body;
//     let today = moment();
//     let data = { links, id_user: id, today: today };
//     await model.links_message.create(data);
//     successCode(res, "", "Success");
//   } catch (error) {
//     errorCode(res, "Error BackEnd");
//   }
// };

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
  delete_media,
  delete_file,
  delete_links,
  set_status_mes,
};

////////////////////////////////////////////////////////////////////////
//
//  ████████╗ █████╗ ██████╗ ██╗     ███████╗    ██╗      █████╗ ███╗   ███╗██████╗
//  ╚══██╔══╝██╔══██╗██╔══██╗██║     ██╔════╝    ██║     ██╔══██╗████╗ ████║██╔══██╗
//     ██║   ███████║██████╔╝██║     █████╗      ██║     ███████║██╔████╔██║██████╔╝
//     ██║   ██╔══██║██╔══██╗██║     ██╔══╝      ██║     ██╔══██║██║╚██╔╝██║██╔═══╝
//     ██║   ██║  ██║██████╔╝███████╗███████╗    ███████╗██║  ██║██║ ╚═╝ ██║██║
//     ╚═╝   ╚═╝  ╚═╝╚═════╝ ╚══════╝╚══════╝    ╚══════╝╚═╝  ╚═╝╚═╝     ╚═╝╚═╝
//
////////////////////////////////////////////////////////////////////////
//
//   #####
//  #     #  ####  #    # ###### #  ####
//  #       #    # ##   # #      # #    #
//  #       #    # # #  # #####  # #
//  #       #    # #  # # #      # #  ###
//  #     # #    # #   ## #      # #    #
//   #####   ####  #    # #      #  ####
//
////////////////////////////////////////////////////////////////////////
const express = require("express");
const app = (module.exports = express());
const { tableLampControl } = require("../../Interfaces/Out/mqttOut");

////////////////////////////////////////////////////////////////////////
//
//  #     #
//  #     #   ##   #####  #   ##   #####  #      ######  ####
//  #     #  #  #  #    # #  #  #  #    # #      #      #
//  #     # #    # #    # # #    # #####  #      #####   ####
//   #   #  ###### #####  # ###### #    # #      #           #
//    # #   #    # #   #  # #    # #    # #      #      #    #
//     #    #    # #    # # #    # #####  ###### ######  ####
//
////////////////////////////////////////////////////////////////////////
var deviceData;
var timer;

timer = setTimeout(() => {
  deviceData = {
    ...deviceData,
    isConnected: false,
  };
}, 10 * 1000);

////////////////////////////////////////////////////////////////////////
//
//    #    ######  ###
//   # #   #     #  #
//  #   #  #     #  #
// #     # ######   #
// ####### #        #
// #     # #        #
// #     # #       ###
//
////////////////////////////////////////////////////////////////////////
app.get("/api/tableLamp/Status", (req, res) => {
  res.json(deviceData);
});

app.post("/api/tableLamp/Update", (req, res) => {
  deviceData = {
    red: req.body.red,
    green: req.body.green,
    blue: req.body.blue,
  };

  tableLampControl(JSON.stringify(deviceData));
  res.json(deviceData);
});

////////////////////////////////////////////////////////////////////////
//
//  #     #  #####  ####### #######    #     #                                              ######
//  ##   ## #     #    #       #       ##   ## ######  ####   ####    ##    ####  ######    #     # ######  ####  ###### # #    # ###### #####
//  # # # # #     #    #       #       # # # # #      #      #       #  #  #    # #         #     # #      #    # #      # #    # #      #    #
//  #  #  # #     #    #       #       #  #  # #####   ####   ####  #    # #      #####     ######  #####  #      #####  # #    # #####  #    #
//  #     # #   # #    #       #       #     # #           #      # ###### #  ### #         #   #   #      #      #      # #    # #      #    #
//  #     # #    #     #       #       #     # #      #    # #    # #    # #    # #         #    #  #      #    # #      #  #  #  #      #    #
//  #     #  #### #    #       #       #     # ######  ####   ####  #    #  ####  ######    #     # ######  ####  ###### #   ##   ###### #####
//
////////////////////////////////////////////////////////////////////////
client.on("message", (topic, payload) => {
  if (topic == "Table Lamp") {
    clearTimeout(timer);

    timer = setTimeout(() => {
      deviceData.isConnected = false;
    }, 10 * 1000);

    if (payload != "Table Lamp Disconnected") {
      var mqttData = JSON.parse(payload);

      deviceData = {
        ...deviceData,
        isConnected: true,
        red: mqttData.red,
        green: mqttData.green,
        blue: mqttData.blue,
        mode: mqttData.mode,
      };
    }
  }
});

////////////////////////////////////////////////////////////////////////
//
//  #####
// #     #  ####   ####  #    # ###### #####
// #       #    # #    # #   #  #        #
//  #####  #    # #      ####   #####    #
//       # #    # #      #  #   #        #
// #     # #    # #    # #   #  #        #
//  #####   ####   ####  #    # ######   #
//
////////////////////////////////////////////////////////////////////////
const sensorUpdate = setInterval(() => {
  sendSocketData();
}, 1 * 1000);

const sendSocketData = () => {
  io.emit("Table Lamp", deviceData);
};

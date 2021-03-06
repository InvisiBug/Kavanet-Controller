////////////////////////////////////////////////////////////////////////
//
//  ██████╗ ███████╗███████╗██╗  ██╗    ██╗     ███████╗██████╗ ███████╗
//  ██╔══██╗██╔════╝██╔════╝██║ ██╔╝    ██║     ██╔════╝██╔══██╗██╔════╝
//  ██║  ██║█████╗  ███████╗█████╔╝     ██║     █████╗  ██║  ██║███████╗
//  ██║  ██║██╔══╝  ╚════██║██╔═██╗     ██║     ██╔══╝  ██║  ██║╚════██║
//  ██████╔╝███████╗███████║██║  ██╗    ███████╗███████╗██████╔╝███████║
//  ╚═════╝ ╚══════╝╚══════╝╚═╝  ╚═╝    ╚══════╝╚══════╝╚═════╝ ╚══════╝
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
const { deskLEDsControl } = require("../../Interfaces/Out/mqttOut");

const functions = require("../../../Helpers/Functions");

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
const disconnectedState = {
  isConnected: false,
  red: 0,
  green: 0,
  blue: 0,
  mode: 0,
};

var deviceData = disconnectedState;

var timer = setTimeout(() => {
  deviceData.isConnected = false;
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
app.get("/api/deskLED/Status", (req, res) => {
  res.json(deviceData);
});

app.post("/api/deskLEDs/Update", (req, res) => {
  deviceData = {
    red: req.body.red,
    green: req.body.green,
    blue: req.body.blue,
  };

  deskLEDsControl(JSON.stringify(deviceData));
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
  if (topic == "Desk LEDs") {
    clearTimeout(timer);

    timer = setTimeout(() => {
      deviceData.isConnected = false;
    }, 10 * 1000);

    if (payload != "Desk LEDs Disconnected") {
      var mqttData = JSON.parse(payload);

      deviceData = {
        ...deviceData,
        isConnected: true,
        red: mqttData.red,
        green: mqttData.green,
        blue: mqttData.blue,
        mode: mqttData.mode,
      };
    } else {
      console.log("Desk LEDs Disconnected  at " + functions.printTime());
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
  io.emit("Desk LEDs", deviceData);
}, 1 * 1000);

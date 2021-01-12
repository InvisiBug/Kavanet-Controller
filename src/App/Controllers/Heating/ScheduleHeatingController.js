const { getHeatingSchedule } = require("../../../Helpers/HeatingModes/Schedule");

const { day, now, time, days } = require("../../../Helpers/Time");
const { heatingOn, heatingOff, getHeatingController } = require("../../../Helpers/HeatingModes/Functions");
const { getStore } = require("../../../Helpers/StorageDrivers/LowLevelDriver");

////////////////////////////////////////////////////////////////////////
//
//   #
//   #        ####   ####  #  ####
//   #       #    # #    # # #    #
//   #       #    # #      # #
//   #       #    # #  ### # #
//   #       #    # #    # # #    #
//   #######  ####   ####  #  ####
//
////////////////////////////////////////////////////////////////////////
const scheduleChecker = () => {
  const scheduleData = getHeatingSchedule();

  if (scheduleData.boostTime < now()) {
    if (scheduleData.auto) {
      if (
        (scheduleData[days[day()]][0] <= time() && time() <= scheduleData[days[day()]][1]) || // Seems to be some overlap ie schedule on at 16:02 when should be on at 16:15
        (scheduleData[days[day()]][2] <= time() && time() <= scheduleData[days[day()]][3])
      ) {
        // console.log("Heating On (A)");
        heatingOn(); // On demand from schedule
      } else {
        // console.log("Heating Off (B)");
        heatingOff(); // off demand from schedule
      }
    }
  }
};

const scheduleHeating = () => {
  let heatingSchedule = getHeatingSchedule();
  let heatingController = getHeatingController();

  if (now() < heatingSchedule.heatingTime) {
    if (heatingController.isConnected && !heatingController.isOn) {
      client.publish("Heating Control", "1");
    }
  } else if (heatingController.isConnected && heatingController.isOn) {
    client.publish("Heating Control", "0");
  }
};

const scheduleRadiatorFan = () => {
  let radiatorFan = getStore("Radiator Fan");
  let heating = getHeatingSchedule();

  if (radiatorFan.isAutomatic) {
    if (now() < heating.radiatorFanTime) {
      if (radiatorFan.isConnected && !radiatorFan.isOn) {
        client.publish("Radiator Fan Control", "1");
      }
    } else if (radiatorFan.isConnected && radiatorFan.isOn) {
      client.publish("Radiator Fan Control", "0");
    }
  }
};

////////////////////////////////////////////////////////////////////////
//
//    #######
//    #       #    # #    #  ####  ##### #  ####  #    #  ####
//    #       #    # ##   # #    #   #   # #    # ##   # #
//    #####   #    # # #  # #        #   # #    # # #  #  ####
//    #       #    # #  # # #        #   # #    # #  # #      #
//    #       #    # #   ## #    #   #   # #    # #   ## #    #
//    #        ####  #    #  ####    #   #  ####  #    #  ####
//
////////////////////////////////////////////////////////////////////////

module.exports = {
  scheduleChecker: scheduleChecker,
  scheduleHeating: scheduleHeating,
  scheduleRadiatorFan: scheduleRadiatorFan,
};
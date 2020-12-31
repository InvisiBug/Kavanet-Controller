/* 
  * NB *
  The timers here may cause issues if they are too short 
  the system uses file system sync which references files 
  which have to be qued for reading and writing
  if the file is accessed too quickly there may be issues
*/
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
// Express
const { getRoomSetpoints, getRoomTemperature } = require("../../helpers/StorageDrivers/Conditions");
const { setValveDemand, getValveStatus } = require("../../helpers/StorageDrivers/Valves");
const { openValve, closeValve } = require("../Interfaces/Out/Valves");
const { camelRoomName } = require("../../helpers/Functions");
const { hour } = require("../../helpers/Time");
const { getStore } = require("../../helpers/StorageDrivers/LowLevelDriver");

////////////////////////////////////////////////////////////////////////
//
// #######
//    #    # #    # ###### #####   ####
//    #    # ##  ## #      #    # #
//    #    # # ## # #####  #    #  ####
//    #    # #    # #      #####       #
//    #    # #    # #      #   #  #    #
//    #    # #    # ###### #    #  ####
//
////////////////////////////////////////////////////////////////////////
const newValveController = (room) => {
  setInterval(() => {
    checkValveDemand(room);
    signalValve(room);
  }, 1 * 1000);
};

const checkValveDemand = (room) => {
  const environmentalData = getStore("Environmental Data");
  const auto = environmentalData.climateControl.isAuto;
  const mode = environmentalData.heatingMode;

  let setpoint = getRoomSetpoints(camelRoomName(room));
  let currentTemp = getRoomTemperature(camelRoomName(room));

  if (auto && mode === "zones") {
    if (currentTemp < setpoint[hour()] && currentTemp > -1) {
      // ! the -1 bit may need to open the valve, fail safe
      setValveDemand(camelRoomName(room), true);
    } else {
      setValveDemand(camelRoomName(room), false);
    }
  } else {
    setValveDemand(camelRoomName(room), true);
  }
  // console.log(`${room} \t Current Temp: ${currentTemp} \t Target Temp: ${setpoint[hour()]}`);
};

const signalValve = (room) => {
  let valve = getValveStatus(camelRoomName(room));
  if (valve.isConnected) {
    if (valve.demand && !valve.isOpen) {
      openValve(room);
      // console.log("Opening Valve");
    } else if (!valve.demand && valve.isOpen) {
      closeValve(room);
      // console.log("Closing Valve");
    }
  }
};

module.exports = {
  newValveController: newValveController,
};

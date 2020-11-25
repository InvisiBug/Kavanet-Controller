const { getStore, setStore } = require("../../../helpers/StorageDrivers/LowLevelDriver");
const { camelRoomName, printTime } = require("../../../helpers/Functions");

const disconnectedState = {
  isConnected: false,
  temperature: -1,
  humidity: -1,
  pressure: -1,
};

const newSensor = (room, offset) => {
  var timer;
  var deviceData = disconnectedState;

  client.on("message", (topic, payload) => {
    if (topic == `${room} ${"Heating Sensor"}`) {
      const roomName = camelRoomName(room);
      clearTimeout(timer);

      timer = setTimeout(() => {
        let environmentalData = getStore("Environmental Data");

        environmentalData = {
          ...environmentalData,
          heatingSensors: {
            ...environmentalData.heatingSensors,
            [roomName]: disconnectedState,
          },
        };

        setStore("Environmental Data", environmentalData);
      }, 10 * 1000);

      if (payload != `${room} ${"Heating Sensor Disconnected"}`) {
        var mqttData = JSON.parse(payload);

        deviceData = {
          ...deviceData,
          isConnected: true,
          temperature: Math.round((mqttData.temperature + offset) * 100) / 100,
          humidity: mqttData.humidity,
          pressure: mqttData.pressure,
        };

        let oldData = getStore("Environmental Data");

        setStore("Environmental Data", {
          ...oldData,
          heatingSensors: {
            ...oldData.heatingSensors,
            [roomName]: deviceData,
          },
        });
      } else {
        console.log(`${room} ${"Heating Sensor Disconnected at "} ${printTime()}`);
      }
    }
  });
};

module.exports = {
  newSensor: newSensor,
};
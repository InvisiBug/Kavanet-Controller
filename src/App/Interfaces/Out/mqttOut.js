const heatingControl = (message) => {
  client.publish("Heating Control", message);
};

const radiatorFanControl = (message) => {
  client.publish("Radiator Fan Control", message);
};

const computerAudioControl = (message) => {
  let data = message;
  delete data.isConnected;

  client.publish(
    "Computer Audio Control",
    JSON.stringify(data, function (prop, value) {
      let lower = prop.charAt(0).toUpperCase() + prop.substring(1);
      if (prop === lower) return value;
      else this[lower] = value;
    })
  );
};

const computerPowerControl = (message) => {
  client.publish("Computer Power Control", message);
};

const plugControl = (message) => {
  client.publish("Plug Control", message);
};

const sunControl = (message) => {
  client.publish("Sun Control", message);
};

const tableLampControl = (message) => {
  client.publish("Table Lamp Control", message);
};

const deskLEDsControl = (message) => {
  client.publish("Desk LED Control", message);
};

const screenLEDsControl = (message) => {
  client.publish("Screen LEDs Control", message);
};

const radiatorValveControl = (valve, message) => {
  client.publish(`${valve} Radiator Valve Control`, message);
};

module.exports = {
  heatingControl: heatingControl,
  radiatorFanControl: radiatorFanControl,
  computerAudioControl: computerAudioControl,
  computerPowerControl: computerPowerControl,
  plugControl: plugControl,
  sunControl: sunControl,
  tableLampControl: tableLampControl,
  deskLEDsControl: deskLEDsControl,
  screenLEDsControl: screenLEDsControl,
  radiatorValveControl: radiatorValveControl,
};

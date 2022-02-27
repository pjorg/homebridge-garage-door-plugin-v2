'use strict'

let Service, Characteristic

module.exports = (api) => {
  /* this is the starting point for the plugin where we register the accessory */
  Service = api.hap.Service
  Characteristic = api.hap.Characteristic
  api.registerAccessory('homebridge-garage-door-plugin-v2', 'Garage Door Opener', GarageDoorOpener)
}

class GarageDoorOpener {
  constructor (log, config, api) {
    this.log = log
    this.config = config
    this.api = api

    this.name = config.name

    this.targetDoorState = this.api.hap.Characteristic.TargetDoorState.CLOSED

    // Dump configuration
    this.log("Configuration: " + JSON.stringify(this.config));
    //this.GarageDoorController = new garagedoorclass.GarageDoorController(log, this.config);

    this.GarageDoorService = new Service.GarageDoorOpener(this.name);
  }

  getServices () {
    const informationService = new Service.AccessoryInformation()
        .setCharacteristic(Characteristic.Manufacturer, 'PJorg')
        .setCharacteristic(Characteristic.Model, 'GarageDoorOpenerV2')
        .setCharacteristic(Characteristic.SerialNumber, '002')

    this.GarageDoorService.getCharacteristic(Characteristic.CurrentDoorState)
      .on('get', this.getCurrentDoorStateCharacteristicHandler.bind(this))

    this.GarageDoorService.getCharacteristic(Characteristic.TargetDoorState)
      .on('get', this.getTargetDoorStateCharacteristicHandler.bind(this))
      .on('set', this.setTargetDoorStateCharacteristicHandler.bind(this))

    this.GarageDoorService.getCharacteristic(Characteristic.ObstructionDetected)
      .on('get', this.getObstructionDetectedCharacteristicHandler.bind(this))

    return [informationService, this.GarageDoorService]
  }

// We'll never be setting CurrentDoorState because it's supposed to be a representation of physical truth
//  setCurrentDoorStateCharacteristicHandler (value, callback) {
    /* this is called when HomeKit wants to update the value of the characteristic as defined in our getServices() function */

    /*
     * The desired value is available in the `value` argument.
     * This is just an example so we will just assign the value to a variable which we can retrieve in our get handler
     * In actuality, we'll need to pull this information from our door controller class eventually
     */
//    this.CurrentDoorState = value

    /* Log to the console the value whenever this function is called */
//    this.log('calling setCurrentDoorStateCharacteristicHandler', value)

    /*
     * The callback function should be called to return the value
     * The first argument in the function should be null unless and error occured
     */
//    callback(null)
//  }

  getCurrentDoorStateCharacteristicHandler (callback) {
    /*
     * this is called when HomeKit wants to retrieve the current state of the characteristic as defined in our getServices() function
     * it's called each time you open the Home app or when you open control center
     */

    const cds = this.api.hap.Characteristic.CurrentDoorState.CLOSED;

    /* Log to the console the value whenever this function is called */
    this.log(`calling getCurrentDoorStateCharacteristicHandler`, cds);

    /*
     * The callback function should be called to return the value
     * The first argument in the function should be null unless and error occured
     * The second argument in the function should be the current value of the characteristic
     * This is just an example so we will return the value from `this.isOn` which is where we stored the value in the set handler
     */
    callback(null, cds);
  }















  setTargetDoorStateCharacteristicHandler (value, callback) {
    /* this is called when HomeKit wants to update the value of the characteristic as defined in our getServices() function */

    /*
     * The desired value is available in the `value` argument.
     * This is just an example so we will just assign the value to a variable which we can retrieve in our get handler
     */
    this.targetDoorState = value;

    /* Log to the console the value whenever this function is called */
    this.log(`calling setTargetDoorStateCharacteristicHandler`, value);

    /*
     * The callback function should be called to return the value
     * The first argument in the function should be null unless and error occured
     */
    callback(null);
  }

  getTargetDoorStateCharacteristicHandler (callback) {
    /*
     * this is called when HomeKit wants to retrieve the current state of the characteristic as defined in our getServices() function
     * it's called each time you open the Home app or when you open control center
     */

    /* Log to the console the value whenever this function is called */
    this.log(`calling getTargetDoorStateCharacteristicHandler`, this.targetDoorState)

    /*
     * The callback function should be called to return the value
     * The first argument in the function should be null unless and error occured
     * The second argument in the function should be the current value of the characteristic
     * This is just an example so we will return the value from `this.isOn` which is where we stored the value in the set handler
     */
    callback(null, this.targetDoorState)
  }







  // We'll never be setting ObstructionDetected because it's supposed to be a representation of physical truth

//  setObstructionDetectedCharacteristicHandler (value, callback) {
    /* this is called when HomeKit wants to update the value of the characteristic as defined in our getServices() function */

    /*
     * The desired value is available in the `value` argument.
     * This is just an example so we will just assign the value to a variable which we can retrieve in our get handler
     */
  //  this.isOn = value

    /* Log to the console the value whenever this function is called */
//    this.log(`calling setOnCharacteristicHandler`, value)

    /*
     * The callback function should be called to return the value
     * The first argument in the function should be null unless and error occured
     */
  //  callback(null)
//  }

  getObstructionDetectedCharacteristicHandler (callback) {
    /*
     * this is called when HomeKit wants to retrieve the current state of the characteristic as defined in our getServices() function
     * it's called each time you open the Home app or when you open control center
     */

    const od = 0;

    /* Log to the console the value whenever this function is called */
    this.log(`calling getObstructionDetectedCharacteristicHandler`, od)

    /*
     * The callback function should be called to return the value
     * The first argument in the function should be null unless and error occured
     * The second argument in the function should be the current value of the characteristic
     * This is just an example so we will return the value from `this.isOn` which is where we stored the value in the set handler
     */
    callback(null, od)
  }

}

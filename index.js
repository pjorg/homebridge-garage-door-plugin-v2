'use strict'

const GarageDoorClass = require('./lib/GarageDoorController');

let Service, Characteristic

module.exports = (api) => {
  /* this is the starting point for the plugin where we register the accessory */
  Service = api.hap.Service
  Characteristic = api.hap.Characteristic
  api.registerAccessory('homebridge-garage-door-plugin-v2', 'Garage Door Opener', GarageDoorOpener)
}

class GarageDoorOpener {
  constructor(log, config, api) {
    this.log = log
    this.config = config
    this.api = api

    this.name = config.name

    this.targetDoorState = this.api.hap.Characteristic.TargetDoorState.CLOSED

    // Dump configuration
    this.log.debug("Configuration: " + JSON.stringify(this.config, null, 2));
    this.GarageDoorController = new GarageDoorClass.GarageDoorController(log, this.config);

    this.GarageDoorService = new Service.GarageDoorOpener(this.name);
  }

  getServices() {
    const InformationService = new Service.AccessoryInformation()
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

    return [InformationService, this.GarageDoorService]
  }


  getCurrentDoorStateCharacteristicHandler(callback) {
    /*
     * this is called when HomeKit wants to retrieve the current state of the characteristic as defined in our getServices() function
     * it's called each time you open the Home app or when you open control center
     */
    this.log.debug('CurrentDoorState requested (getCurrentDoorStateCharacteristicHandler)...');
    const state_from_controller = this.GarageDoorController.checkDoorStatus();
    if (typeof state_from_controller != 'undefined') {
      this.log.debug('Received state from controller... \n' + JSON.stringify(state_from_controller, null, 2));
      callback(null, state_from_controller.state.HomeKitState);
    } else {
      callback('Did not receive state data from controller class');
    }
  }


  setTargetDoorStateCharacteristicHandler(value, callback) {
    /* this is called when HomeKit wants to update the value of the characteristic as defined in our getServices() function */
    this.log(`TargetDoorState being set (setTargetDoorStateCharacteristicHandler):`, value);
    this.targetDoorState = value;
    this.log.debug('Set targetDoorState in Accessory; now calling operateGarageDoor on controller...')
    this.GarageDoorController.operateGarageDoor();
    callback(null);
  }


  getTargetDoorStateCharacteristicHandler(callback) {
    /*
     * this is called when HomeKit wants to retrieve the current state of the characteristic as defined in our getServices() function
     * it's called each time you open the Home app or when you open control center
     */
    this.log.debug('TargetDoorState requested (getTargetDoorStateCharacteristicHandler)...');
    this.log.debug('TargetDoorState stored in Accessory class is: ', this.targetDoorState);
    callback(null, this.targetDoorState)
  }


  getObstructionDetectedCharacteristicHandler(callback) {
    /*
     * this is called when HomeKit wants to retrieve the current state of the characteristic as defined in our getServices() function
     * it's called each time you open the Home app or when you open control center
     */
    this.log.debug('ObstructionDetected requested (getObstructionDetectedCharacteristicHandler)...');
    const obstruction_state_from_controller = this.GarageDoorController.Obstruction;
    if (typeof obstruction_state_from_controller != 'undefined') {
      this.log.debug('Received obstruction state from controller... \n' + JSON.stringify(obstruction_state_from_controller, null, 2));
      callback(null, obstruction_state_from_controller);
    } else {
      callback('Did not receive state data from controller class');
    }
  }
}

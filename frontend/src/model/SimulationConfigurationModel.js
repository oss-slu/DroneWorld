import { EnvironmentModel } from './EnvironmentModel';
import { MonitorModel } from './MonitorModel';
import dayjs from 'dayjs';

export class SimulationConfigurationModel {
  constructor() {
    const currentDate = new Date();
    this._environment = new EnvironmentModel();
    this._environment.enableFuzzy = false;
    this._environment.timeOfDayFuzzy = false;
    this._environment.positionFuzzy = false;
    this._environment.TimeOfDay = currentDate.toUTCString().substring(17, 25);
    this._environment.UseGeo = true;
    this._environment.time = dayjs(currentDate);
    this._drones = new Array();
    this._monitors = new MonitorModel();
  }

  get environment() {
    return this._environment;
  }

  get monitors() {
    return this._monitors;
  }

  set environment(value) {
    this._environment = value;
  }

  set monitors(value) {
    this._monitors = value;
  }

  set drones(value) {
    this._drones = value;
  }

  getAllDrones() {
    return this._drones;
  }

  getDroneBasedOnIndex(index) {
    if (this._drones.length > index) {
      return this._drones[index];
    }
  }

  addNewDrone(droneObj) {
    this._drones.push(droneObj);
  }

  updateDroneBasedOnIndex(index, drone) {
    this._drones[index] = drone;
  }

  deleteDroneBasedOnIndex(index) {
    this._drones = this._drones.filter((_, i) => i !== index);
  }

  popLastDrone() {
    this._drones.pop();
  }

  deleteDroneById(droneId) {
    this._drones = this._drones.filter(drone => drone.id !== droneId);
  }
  

  static getReactStateBasedUpdate(instance) {
    let model = new SimulationConfigurationModel();
    model.environment = instance.environment;
    model.monitors = instance.monitors;
    const drones = instance.getAllDrones();
    for (let i = 0; i < drones.length; i++) {
      model.addNewDrone(drones[i]);
    }
    return model;
  }

  toJSONString() {
    let data = {};
    data['environment'] = this._environment.toJSONString();
    data['drones'] = this._drones?.map((droneObj) => droneObj.toJSONString());
    // data["monitors"] = this._monitors.toJSONString();
    return data;
  }
}

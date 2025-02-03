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
    this.updateEnvironmentOnServer();
  }

  set monitors(value) {
    this._monitors = value;
    this.updateMonitorsOnServer();

  }

  /*ADDITION*/
  async fetchSimulationState() {
    try {
      const response = await fetch('/api/simulation');
      if (!response.ok) throw new Error('Failed to fetch simulation data');
      
      const data = await response.json();
      this._environment = new EnvironmentModel(data.environment);
      this._monitors = new MonitorModel(data.monitors);
      this._drones = data.drones || [];
    } catch (error) {
      console.error('Error fetching simulation state:', error);
    }
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

  /*Addition*/
  async addNewDrone(droneObj) {
    try {
      const response = await fetch('/api/simulation/drones', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(droneObj),
      });

      if (!response.ok) throw new Error('Failed to add drone');

      const newDrone = await response.json();
      this._drones.push(newDrone);
    } catch (error) {
      console.error('Error adding drone:', error);
    }
  }

  /*ADDITION*/
  async updateDroneBasedOnIndex(index, drone) {
    if (index < 0 || index >= this._drones.length) return;
    try {
      const response = await fetch(`/api/simulation/drones/${drone.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(drone),
      });

      if (!response.ok) throw new Error('Failed to update drone');

      this._drones[index] = drone;
    } catch (error) {
      console.error('Error updating drone:', error);
    }
  }

  /*ADDITION*/
  async deleteDroneBasedOnIndex(index) {
    if (index < 0 || index >= this._drones.length) return;
    
    const droneId = this._drones[index].id;
    try {
      const response = await fetch(`/api/simulation/drones/${droneId}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete drone');

      this._drones.splice(index, 1);
    } catch (error) {
      console.error('Error deleting drone:', error);
    }
  }

  /*NEW ADDITION*/
  async updateEnvironmentOnServer() {
    try {
      await fetch('/api/simulation/environment', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(this._environment),
      });
    } catch (error) {
      console.error('Error updating environment:', error);
    }
  }
  /*NEW ADDITION*/
  async updateMonitorsOnServer() {
    try {
      await fetch('/api/simulation/monitors', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(this._monitors),
      });
    } catch (error) {
      console.error('Error updating monitors:', error);
    }
  }

  popLastDrone() {
    this._drones.pop();
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

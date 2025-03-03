import { v4 as uuidv4 } from 'uuid';

export class DroneModel {
  constructor() {
    this._Name = `Drone-${uuidv4().substring(0, 4)}`;
    this._FlightController = '';
    this._droneType = '';
    this._droneModel = '';
    this._VehicleType = '';
    this._DefaultVehicleState = '';
    this._EnableCollisionPassthrogh = false;
    this._EnableCollisions = false;
    this._AllowAPIAlways = false;
    this._EnableTrace = false;
    this._image = '';
    this._color = '';
    this._X = 0;
    this._Y = 0;
    this._Z = 0;
    this._Pitch = 0;
    this._Roll = 0;
    this._Yaw = 0;
    this._Sensors = '';
    this._MissionValue = '';
    this._Mission = {
      name: '',
      param: [],
    };
  }

  get flightController() {
    return this._FlightController;
  }

  get droneType() {
    return this._droneType;
  }

  get droneModel() {
    return this._droneModel;
  }

  get vehicleType() {
    return this._VehicleType;
  }

  get defaultVehicleState() {
    return this._DefaultVehicleState;
  }

  get enableCollisionPassthrogh() {
    return this._EnableCollisionPassthrogh;
  }

  get enableCollisions() {
    return this._EnableCollisions;
  }

  get allowAPIAlways() {
    return this._AllowAPIAlways;
  }

  get enableTrace() {
    return this._EnableTrace;
  }

  get name() {
    return this._Name;
  }

  get image() {
    return this._image;
  }

  get color() {
    return this._color;
  }

  get X() {
    return this._X;
  }

  get Y() {
    return this._Y;
  }

  get Z() {
    return this._Z;
  }

  get Pitch() {
    return this._Pitch;
  }

  get Roll() {
    return this._Roll;
  }

  get Yaw() {
    return this._Yaw;
  }

  get Sensors() {
    return this._Sensors;
  }

  get MissionValue() {
    return this._MissionValue;
  }

  set flightController(value) {
    this._FlightController = value;
  }

  set droneType(value) {
    this._droneType = value;
  }

  set droneModel(value) {
    this._droneModel = value;
  }

  set vehicleType(value) {
    this._VehicleType = value;
  }

  set defaultVehicleState(value) {
    this._DefaultVehicleState = value;
  }

  set enableCollisionPassthrogh(value) {
    this._EnableCollisionPassthrogh = value;
  }

  set enableCollisions(value) {
    this._EnableCollisions = value;
  }

  set allowAPIAlways(value) {
    this._AllowAPIAlways = value;
  }

  set enableTrace(value) {
    this._EnableTrace = value;
  }

  set name(value) {
    this._Name = value;
  }

  set image(value) {
    this._image = value;
  }

  set color(value) {
    this._color = value;
  }

  set X(value) {
    this._X = value;
  }

  set Y(value) {
    this._Y = value;
  }

  set Z(value) {
    this._Z = value;
  }

  set Pitch(value) {
    this._Pitch = value;
  }

  set Roll(value) {
    this._Roll = value;
  }

  set Yaw(value) {
    this._Yaw = value;
  }

  set Sensors(value) {
    this._Sensors = value;
  }

  set MissionValue(value) {
    this._MissionValue = value;
  }

  setMissionObjectName(value) {
    this._Mission.name = value;
  }

  setMissionObjectParams(value) {
    this._Mission.param = value;
  }

  toJSONString() {
    return {
      drone_name: this._Name,
      flight_controller: this._FlightController,
      drone_type: this._droneType,
      drone_model: this._droneModel,
      vehicle_type: this._VehicleType,
      default_vehicle_state: this._DefaultVehicleState,
      enable_collision_passthrough: this._EnableCollisionPassthrogh,
      enable_collisions: this._EnableCollisions,
      allow_api_always: this._AllowAPIAlways,
      enable_trace: this._EnableTrace,
      name: this._Name,
      // image: this._image,
      color: this._color,
      x: this._X,
      y: this._Y,
      z: this._Z,
      pitch: this._Pitch,
      roll: this._Roll,
      yaw: this._Yaw,
      sensors: this._Sensors,
      // mission_value: this._MissionValue,
      // mission: this._Mission,
    };
  }
}

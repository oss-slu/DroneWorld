import { imageUrls } from '../utils/const';

import { origin } from '../constants/env';

export class EnvironmentModel {
  constructor() {
    this._name = '';
    this._description = '';
    this._enableFuzzy = false;
    this._timeOfDayFuzzy = false;
    this._positionFuzzy = false;
    this._windFuzzy = false;
    this._TimeOfDay = null;
    this._UseGeo = false;
    this._time = null;
    this._Wind = [];
    this._Origin = {
      latitude: 0,
      longitude: 0,
      name: '',
      height: 0,
      radius: origin.DEFAULT_RADIUS,
      image: imageUrls.location,
    };
    this._sades = [];
    this._activeSadeZoneIndex = null;
  }

  // Getters
  get enableFuzzy() {
    return this._enableFuzzy;
  }

  get timeOfDayFuzzy() {
    return this._timeOfDayFuzzy;
  }

  get positionFuzzy() {
    return this._positionFuzzy;
  }

  get windFuzzy() {
    return this._windFuzzy;
  }

  get TimeOfDay() {
    return this._TimeOfDay;
  }

  get UseGeo() {
    return this._UseGeo;
  }

  get time() {
    return this._time;
  }

  get Wind() {
    return this._Wind;
  }

  get Origin() {
    return this._Origin;
  }

  get activeSadeZoneIndex() {
    return this._activeSadeZoneIndex;
  }

  get name() {
    return this._name;
  }

  get description() {
    return this._description;
  }

  // Setters
  set enableFuzzy(value) {
    this._enableFuzzy = value;
  }

  set timeOfDayFuzzy(value) {
    this._timeOfDayFuzzy = value;
  }

  set positionFuzzy(value) {
    this._positionFuzzy = value;
  }

  set windFuzzy(value) {
    this._windFuzzy = value;
  }

  set TimeOfDay(value) {
    this._TimeOfDay = value;
  }

  set UseGeo(value) {
    this._UseGeo = value;
  }

  set time(value) {
    this._time = value;
  }

  set Origin(value) {
    this._Origin = value;
  }

  set Wind(value) {
    this._Wind = value;
  }

  set activeSadeZoneIndex(value) {
    this._activeSadeZoneIndex = value;
  }

  set name(value) {
    this._name = value;
  }

  set description(value) {
    this._description = value;
  }

  getOriginLatitude() {
    return this._Origin.latitude;
  }

  getOriginLongitude() {
    return this._Origin.longitude;
  }

  getOriginRadius() {
    return this._Origin.radius;
  }

  getOriginHeight() {
    return this._Origin.height;
  }

  getOriginName() {
    return this._Origin.name;
  }

  getOriginImage() {
    return this._Origin.image;
  }
  
  setOriginLatitude(value) {
    this._Origin.latitude = value;
  }

  setOriginLongitude(value) {
    this._Origin.longitude = value;
  }

  setOriginRadius(value) {
    this._Origin.radius = value;
  }

  setOriginHeight(value) {
    this._Origin.height = value;
  }

  setOriginName(value) {
    this._Origin.name = value;
  }

  setOriginImage(value) {
    this._Origin.image = value;
  }

  addNewWind(windObj) {
    this._Wind.push(windObj);
  }

  getWindBasedOnIndex(index) {
    if (this._Wind.length > index) {
      return this._Wind[index];
    }
  }

  updateWindBasedOnIndex(index, windModel) {
    this._Wind[index] = windModel;
  }

  deleteWindBasedOnIndex(index) {
    this._Wind = this._Wind.filter((_, i) => i !== index);
  }

  getAllSades() {
    return this._sades;
  }

  getSadesCount() {
    return this._sades.length;
  }

  getSadeBasedOnIndex(index) {
    if (this._sades.length > index) {
      return this._sades[index];
    }
  }

  addNewSade(sadeObj) {
    this._sades.push(sadeObj);
  }

  updateSadeBasedOnIndex(index, sade) {
    this._sades[index] = sade;
  }

  deleteSadeBasedOnIndex(index) {
    this._sades = this._sades.filter((_, i) => i !== index);
  }

  popLastSade() {
    this._sades.pop();
  }

  static getReactStateBasedUpdate(instance) {
    let model = new EnvironmentModel();
    model.name = instance.name;
    model.description = instance.description;
    model.enableFuzzy = instance.enableFuzzy;
    model.timeOfDayFuzzy = instance.timeOfDayFuzzy;
    model.positionFuzzy = instance.positionFuzzy;
    model.setOriginLatitude(instance._Origin.latitude);
    model.setOriginLongitude(instance._Origin.longitude);
    model.setOriginHeight(instance._Origin.height);
    model.setOriginRadius(instance._Origin.radius);
    model.setOriginName(instance._Origin.name);
    model.TimeOfDay = instance.TimeOfDay;
    model.UseGeo = instance.UseGeo;
    model.time = instance.time;
    model.Origin = instance.Origin;
    model.Wind = instance.Wind;
    model.activeSadeZoneIndex = instance.activeSadeZoneIndex;
    const sades = instance.getAllSades();
    for (let i = 0; i < sades.length; i++) {
      model.addNewSade(sades[i]);
    }
    return model;
  }

  toJSONString() {
    let origin = this._Origin;
    delete origin.image;
    return {
      name: this._name,
      description: this._description,
      // "enable_fuzzy": this._enableFuzzy,
      // "time_of_day_fuzzy": this._timeOfDayFuzzy,
      // "position_fuzzy": this._positionFuzzy,
      // "wind_fuzzy": this._windFuzzy,
      wind: this._Wind?.map((obj) => obj.toJSONString()),
      origin: origin,
      time_of_day: this._TimeOfDay,
      use_geo: this.UseGeo,
      time: this._time,
      sades: this._sades?.map((obj) => obj.toJSONString()),
    };
  }
}

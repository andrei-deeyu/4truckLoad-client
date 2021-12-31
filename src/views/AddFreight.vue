<template>
<div>
  <!-- Alert messages -->
  <b-alert v-if="alertMessage" class="b-alert" show variant="warning" dismissible>{{ alertMessage }}</b-alert>
  <b-alert v-if="errorMessage" class="b-alert" show variant="danger" dismissible>{{ errorMessage }}</b-alert>

  <!-- Page title -->
  <b-container fluid>
    <h2>Add freight</h2>
    <p>Input boxes with green borders are mandatory.</p>
  </b-container>

  <!-- Google maps location finder -->
  <form @submit.prevent="addFreight()">
    <div id="mapControls">
      <!-- Avoid the words "address" || "location" in id, name, or label text to avoid browser autofill from conflicting with Place Autocomplete. -->
      <input
        id="origin-input"
        class="controls"
        type="text"
        autocomplete="off"
        placeholder="Load city"
        v-model="location"
      />
      <input
        id="destination-input"
        class="controls"
        type="text"
        autocomplete="off"
        placeholder="Unload city"
        v-model="destination"
      />
      <p id="distance" class="distance">{{ distance }}</p>
    </div>
    <b-container fluid="sm" id="map"></b-container>


    <!-- Details -->
    <b-container id="data">
      <b-form-textarea
        class="showDetails mx-auto"
        v-model="details"
        rows="4"
        placeholder="Freight description. Do not enter phones or other contact information, those are automatically displayed by the system.">
      </b-form-textarea>

      <div class="size">
        <b-input-group class="sizeInputGroup">
          <b-form-input
            type="number"
            step="any"
            v-model="tonnage"
            class="sizeInput tonnageBorder"
            placeholder="tonage">
          </b-form-input>
          <b-input-group-text><span class="mx-auto">tons</span></b-input-group-text>
        </b-input-group>

        <b-input-group class="sizeInputGroup">
          <b-form-input
            type="number"
            step="any"
            v-model="volume"
            placeholder="volume">
          </b-form-input>
          <b-input-group-text><span class="mx-auto">m3</span></b-input-group-text>
        </b-input-group>

        <b-input-group class="sizeInputGroup">
          <b-form-input
            type="number"
            step="any"
            v-model="freightLength"
            placeholder="length">
          </b-form-input>
          <b-input-group-text><span class="mx-auto">m</span></b-input-group-text>
        </b-input-group>

        <b-input-group class="sizeInputGroup">
          <b-form-input
            type="number"
            step="any"
            v-model="width"
            placeholder="width">
          </b-form-input>
          <b-input-group-text><span class="mx-auto">m</span></b-input-group-text>
        </b-input-group>

        <b-input-group class="sizeInputGroup">
          <b-form-input
            type="number"
            step="any"
            v-model="height"
            placeholder="height">
          </b-form-input>
          <b-input-group-text><span class="mx-auto">m</span></b-input-group-text>
        </b-input-group>
      </div>


      <div class="selectData">
        <b-form-select v-model="regime" class="regime">
          <b-form-select-option disabled value="">Select the truckload type</b-form-select-option>
          <b-form-select-option value="LTL">LTL (less than truckload)</b-form-select-option>
          <b-form-select-option value="FTL">FTL (full truckload)</b-form-select-option>
          <b-form-select-option value="ANY">any truckload</b-form-select-option>
        </b-form-select>

        <b-form-select v-model="palletName" class="pallet">
          <b-form-select-option disabled value="">Palletization</b-form-select-option>
          <b-form-select-option value="europallet">europallet 1200×800 mm</b-form-select-option>
          <b-form-select-option value="industrialpallet">industrial pallet 1200×1000 mm</b-form-select-option>
          <b-form-select-option value="other">other</b-form-select-option>
        </b-form-select>
      </div>


      <b-container fluid class="freightAskingOfferContainer">
        <b-form-input
          v-if="palletName"
          class="palletNumber"
          type="number"
          step="any"
          v-model="palletNumber"
          placeholder="Number of pallets"
        ></b-form-input>

        <b-input-group id="inputGroupValability">
          <b-form-select v-model="valability" class="valability">
            <b-form-select-option value="1days">1 day</b-form-select-option>
            <b-form-select-option value="3days">3 days</b-form-select-option>
            <b-form-select-option value="7days">7 days</b-form-select-option>
            <b-form-select-option value="14days">14 days</b-form-select-option>
            <b-form-select-option value="30days">Max. (1 month)</b-form-select-option>
          </b-form-select>
          <b-input-group-text id="groupTextValability"><span class="mx-auto">valability</span></b-input-group-text>
        </b-input-group>

        <div class="offerPrice">
          <b-input-group id="inputGroupRON">
            <b-form-input
              class="offer"
              type="number"
              step="any"
              v-model="initialoffer"
              placeholder="initial offer">
            </b-form-input>
            <b-input-group-text id="groupTextEUR"><span class="mx-auto">EURO</span></b-input-group-text>
          </b-input-group>

          <b-form-checkbox
            class="TVA"
            v-model="TVA"
            value="included"
            unchecked-value="without">
            <span>{{ (TVA == 'included') ? 'with TVA' : 'without tva' }}</span>
          </b-form-checkbox>
        </div>
      </b-container>

      <br><br>

      <p class="sectionDesc">Truck required</p>
      <b-container id="trucktype">
        <div>
          <input
            type="checkbox"
            v-model="trucktype"
            value="duba"
            @change="limiter"
          /> van
        </div>

        <div>
          <input
            type="checkbox"
            v-model="trucktype"
            value="decopertat"
            @change="limiter"
          /> flatbed truck
        </div>

        <div>
          <input
            type="checkbox"
            v-model="trucktype"
            value="basculanta"
            @change="limiter"
          /> dump truck
        </div>

        <div>
          <input
            type="checkbox"
            v-model="trucktype"
            value="transport auto"
            @change="limiter"
          /> car carrier
        </div>

        <div>
          <input
            type="checkbox"
            v-model="trucktype"
            value="prelata"
            @change="limiter"
          /> semi truck
        </div>

        <div>
          <input
            type="checkbox"
            v-model="trucktype"
            value="agabaritic"
            @change="limiter"
          /> oversized
        </div>

        <div>
          <input
            type="checkbox"
            v-model="trucktype"
            value="container"
            @change="limiter"
          /> container
        </div>
      </b-container>

      <br><br>

      <p class="sectionDesc">Necessary equipment and features</p>
      <div id="features">
        <div>
          <input
            type="checkbox"
            v-model="features"
            value="ADR"
          /> ADR
        </div>

        <div>
          <input
            type="checkbox"
            v-model="features"
            value="walkingfloor"
          /> walkingfloor
        </div>

        <div>
          <input
            type="checkbox"
            v-model="features"
            value="FRIGO"
          /> FRIGO
        </div>

        <div>
          <input
            type="checkbox"
            v-model="features"
            value="izoterm"
          /> izoterm
        </div>

        <div>
          <input
            type="checkbox"
            v-model="features"
            value="lift"
          /> lift
        </div>

        <div>
          <input
            type="checkbox"
            v-model="features"
            value="MEGAtrailer"
          /> MEGAtrailer
        </div>
      </div>
    </b-container>

    <b-button type="submit" id="submit" variant="primary">Publish</b-button>
    <br><br>
  </form>

  </div>
</template>
<script>
import { Loader } from "@googlemaps/js-api-loader";
import Joi from 'joi';

const brandName = '4truckLoad';
const ADD_FREIGHT_URL = 'https://truckloadserver.herokuapp.com/api/v1/freight';

// Sanitize just user text/checkbox input (except auth & google maps data)
const postSchema = Joi.object().keys({
location: Joi.string().trim().min(3).max(256).required(),
destination: Joi.string().trim().min(3).max(256).required(),

    details: Joi.string().trim().max(596).allow(''),

distance: Joi.string().min(1).max(20000).required(),

  regime: Joi.string().valid().trim().only('LTL', 'FTL', 'ANY').required(),
  tonnage: Joi.number().min(0).max(17000).required(),

  initialoffer: Joi.number().min(0).max(700000).allow(null),

    volume: Joi.number().min(0).max(30000).allow(null), // m^3
    freightLength: Joi.number().min(0).max(2000).allow(null), // meters
    width: Joi.number().min(0).max(2000).allow(null),
    height: Joi.number().min(0).max(2000).allow(null),
}).unknown(true);



export default {
  name: "AddFreight",

  metaInfo: {
    title: 'Freight exchange',
    titleTemplate: `%s | ${ brandName }`,
    meta: [
      { 'http-equiv': 'Content-Type', content: 'text/html; charset=utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
    ]
  },


  data: () => ({
    alertMessage: '',
    errorMessage: '',

    location: '',
    destination: '',
    details: '',
    distance: '',
    initialoffer: null,
    TVA: 'without',
    regime: '',
    tonnage: null,
    palletName: '',
    palletNumber: null,
    freightLength: null,
    volume: null,
    width: null,
    height: null,
    valability: '7days',
    trucktype: [],
    features: [],
  }),

  mounted() {
    // Load Google Maps
    this.loadMap();

    // Listen to map controls changes
    //    *will use Vue emitted events in the future to pass the data outside its scope
    window.addEventListener('distance-localstorage-changed', (event) => {
      this.distance = event.detail.kilometers;
    });

    window.addEventListener('route-localstorage-changed', (event) => {
      this.location = event.detail.originName;
      this.destination = event.detail.destinationName;
    });
  },

methods: {
  limiter(e) {
    if(this.trucktype.length > 3) {
      e.target.checked = false;
      this.trucktype.pop(e);

      this.alertMessage = 'Max 3 selected trucks';
      setTimeout(() => { this.alertMessage = '' }, 3000);
    }
  },

  loadMap() {
    const loader = new Loader({
      apiKey: "AIzaSyBOw4nccx48P8iUVTcuXnHTmnVMn0osIHM",
      version: "weekly",
      libraries: ["places"]
      // ...additionalOptions,
    });
    loader.load().then((google) => {
      class AutocompleteDirectionsHandler {
        map;
        originPlaceId;
        destinationPlaceId;
        travelMode;
        directionsService;
        directionsRenderer;

        constructor(map) {
          this.map = map;
          this.originPlaceId = "";
          this.destinationPlaceId = "";
          this.travelMode = google.maps.TravelMode.DRIVING;
          this.directionsService = new google.maps.DirectionsService();
          this.directionsRenderer = new google.maps.DirectionsRenderer();
          this.directionsRenderer.setMap(map);

          const originInput = document.getElementById("origin-input");
          const destinationInput = document.getElementById("destination-input");
          const modeSelector = document.getElementById("mode-selector");
          const originAutocomplete = new google.maps.places.Autocomplete(originInput);
          const distanceOutput = document.getElementById("distance");

          // Specify just the place data fields that you need.
          originAutocomplete.setFields(["place_id", "name"]);
          const destinationAutocomplete = new google.maps.places.Autocomplete(
            destinationInput
          );

          // Specify just the place data fields that you need.
          destinationAutocomplete.setFields(["place_id", "name"]);

          this.setupPlaceChangedListener(originAutocomplete, "ORIG");
          this.setupPlaceChangedListener(destinationAutocomplete, "DEST");
          this.map.controls[google.maps.ControlPosition.TOP_LEFT].push(originInput);
          this.map.controls[google.maps.ControlPosition.LEFT_TOP].push(
            destinationInput
          );
          this.map.controls[google.maps.ControlPosition.TOP_LEFT].push(modeSelector);
          this.map.controls[google.maps.ControlPosition.LEFT_TOP].push(distanceOutput);
        }

        setupPlaceChangedListener(autocomplete, mode) {
           /* Just cities, prevent a long string of location */
          autocomplete.setTypes(["(cities)"]);

          autocomplete.bindTo("bounds", this.map);
          autocomplete.addListener("place_changed", () => {
            const place = autocomplete.getPlace();

            if (!place.place_id) {
              window.alert("Select an option from the dropdown list");
              return;
            }

            if (mode === "ORIG") {
              this.originPlaceId = place.place_id;
              this.originName = place.name;
            } else {
              this.destinationPlaceId = place.place_id;
              this.destinationName = place.name
            }
            this.route();
          });
        }

        route() {
          if (!this.originPlaceId || !this.destinationPlaceId) {
            return;
          }
          /*
            Vue.data can't be accessed inside a class
              so we localStorage the originName && destinationName
            Fire an event
            Listen it in mounted() state
              read localStorage data (originName && destinationName)

            * TODOs: Pass the data to the parent component through vue emitted events: this.$emit(eventName, data);
          */
          window.localStorage.setItem("originName", this.originName);
          window.localStorage.setItem("destinationName", this.destinationName);

          window.dispatchEvent(new CustomEvent('route-localstorage-changed', {
            detail: {
              originName: localStorage.getItem('originName'),
              destinationName: localStorage.getItem('destinationName')
            }
          }));


          // route initiation on the map
          const me = this;
          this.directionsService.route(
            {
              origin: { placeId: this.originPlaceId },
              destination: { placeId: this.destinationPlaceId },
              travelMode: this.travelMode,
            },
            (response, status) => {
              if (status === "OK") {
                const route = response.routes[0];
                const distance = route.legs[0].distance.text;

                me.directionsRenderer.setDirections(response);

                window.localStorage.setItem("distance", distance);
                window.dispatchEvent(new CustomEvent('distance-localstorage-changed', {
                  detail: {
                    kilometers: localStorage.getItem('distance')
                  }
                }));
              } else {
                window.alert("Directions request failed due to " + status);
              }
            }
          );
        }
      }

      const map = new google.maps.Map(document.getElementById("map"), {
        mapTypeControl: false,
        center: { lat: 46, lng: 25 },
        zoom: 6,
      });

      new AutocompleteDirectionsHandler(map);
    });
  },

  addFreight(body) {
    body = {
      location: this.location,
      destination: this.destination,
        details: this.details,
        distance: this.distance,
        initialoffer: this.initialoffer,
        TVA: this.TVA,
        regime: this.regime,
      tonnage: this.tonnage,
        palletName: this.palletName,
        palletNumber: this.palletNumber,
        volume: this.volume,
        freightLength: this.freightLength,
        width: this.width,
        height: this.height,
        valability: this.valability,
        trucktype: this.trucktype,
        features: this.features,
    }
    if( this.validObject(body) ) {
      this.$auth.getIdTokenClaims().then(( token ) => {
        fetch(ADD_FREIGHT_URL, {
          method: 'POST',
          body: JSON.stringify(body),
          headers: {
            'content-type': 'application/json',
            Authorization: 'Bearer '  + token.__raw
          },
        })
        .then(res => res.json())
        .then((result) => {
          if(result.state !== 'posted.') {
            this.errorMessage = result.message;
            setTimeout(() => { this.errorMessage = '' }, 3000);
          } else {
            this.$router.push('/marfa/' + result.id)
          }
        });
      });
    }
  },

  validObject(object) {
    const result = Joi.validate(object, postSchema);
    if (result.error === null) {
      return true;
    }

    // TODO: refactor to Switch statement

    // Basic
    if (result.error.message.includes('location')) {
      this.errorMessage = 'Enter the location correctly';
    } else if (result.error.message.includes('destination')) {
      this.errorMessage = 'Enter the destination correctly';
    } else if (result.error.message.includes('distance')) {
      this.errorMessage = 'Select correctly the route from the field suggestions on the map.';
    } else if (result.error.message.includes('regime')) {
      this.errorMessage = 'Select the truckload type';
    } else if (result.error.message.includes('tonnage')) {
      this.errorMessage = 'Enter the tonnage correctly as a number';
    } else if (result.error.message.includes('details')) {
      this.errorMessage = 'Max. 596 characters for the freight description';
    } else if (result.error.message.includes('initialoffer')) {
      this.errorMessage = 'Enter the price correctly';

    // Size
    } else if (result.error.message.includes('volume')) {
      this.errorMessage = 'The size is expressed in cubic meters.';
    } else if (result.error.message.includes('freightLength')) {
      this.errorMessage = 'The size is expressed in meters.';
    } else if (result.error.message.includes('width')) {
      this.errorMessage = 'The size is expressed in meters';
    } else if (result.error.message.includes('height')) {
      this.errorMessage = 'The size is expressed in meters.';

    // Else
    } else {
      this.errorMessage = 'Something is wrong. Reload the page';
    }
    setTimeout(() => { this.errorMessage = '' }, 3000);
    return false;
  },
}
}
</script>
<style scoped>
  @import url('../styling/addfreight.css');
</style>
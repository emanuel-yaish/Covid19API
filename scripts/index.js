"use strict";

const covid19 = {
  // properties
  continents: ["Africa", "Americas", "Asia", "Europe", "Oceania"],
  // `https://intense-mesa-62220.herokuapp.com/https://corona-api.com/countries/`;//+countryCode
  constinetCountriesUrl:
    "//intense-mesa-62220.herokuapp.com/https://restcountries.herokuapp.com/api/v1/region/",
  selectedContinent: "",
  continentsAndCities: {},
  statistics: {
    cases: "",
    deaths: "",
    recovered: "",
  },
  continentsApi: {},

  // methods

  async getCountriesByContinent(continent) {
    try {
      // `https://intense-mesa-62220.herokuapp.com/https://corona-api.com/countries/`;//+countryCode

      const request = `${covid19.constinetCountriesUrl}${continent}`;
      const countries = await (await fetch(request)).json();
      this.continentsAndCities[continent] = countries;
      console.log(countries);
      this.getContinentCountriesCovidData(countries);

      // todo add option with list html option counries
    } catch (e) {
      console.log(e);
    }
  },

  async getContinentCountriesCovidData(countries) {
    console.log("get countrie");
  },

  getCountry() {},
  getCountryCovidData() {},

  selectPageElements() {
    this.worldMapElement = document.querySelector("svg");
  },

  selectContinent() {
    this.worldMapElement.addEventListener("click", ({ target }) => {
      if (target.tagName.toUpperCase() !== "PATH") return;

      const continentID = target.closest("g").getAttribute("data-country-id");
      this.selectedContinent = this.continents[continentID];

      if (this.continentsAndCities[this.selectedContinent] === undefined)
        this.getCountriesByContinent(this.selectedContinent);
    });
  },

  addPageEvents() {
    this.selectContinent();
    // this.clickOnTool();
    // this.clickOnInventory();
    // this.clickOnGameBoard();
    // this.ResetGameBoard();
  },

  init() {
    this.selectPageElements();
    this.addPageEvents();

    // this.startScreen = document.querySelector(".start-screen");
    // this.gameBoard = document.querySelector(".game-board");
    // this.inventoryElement = document.querySelector(".inventory");
    // this.resetButton = document.querySelector(".reset-button");
    // this.sideNavButtons = document.querySelectorAll(".side-nav-button");
    // this.initEvents();
    // this.draw();
  },
};

covid19.init();

// covid19.getCountriesByContinent("Africa");

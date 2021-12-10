"use strict";

const covid19 = {
  // properties
  continents: ["Africa", "Americas", "Asia", "Europe", "Oceania"],
  constinetCountriesUrl:
    "https://intense-mesa-62220.herokuapp.com/https://restcountries.herokuapp.com/api/v1/region/",
  selectedContinent: "",
  continentsAndCities: {},
  statistics: {
    cases: "",
    deaths: "",
    recovered: "",
  },
  continentsApi: {},
  countryCoronaApi: `https://intense-mesa-62220.herokuapp.com/https://corona-api.com/countries/`,

  // methods

  // get all countries names for selected continent
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

  // get all countries covid data
  async getContinentCountriesCovidData(countries) {
    console.log("to implement get Continent Countries Covid Data");
    return;
    try {

      // const texts = await Promise.all(urls.map(async url => {
      //   const resp = await fetch(url);
      //   return resp.text();
      // }));

//claen way
      const requests = this.countries.map((country) => fetch(this.countryCoronaApi + country.code)); 
      const responses = await Promise.all(requests); 
      const promises = responses.map((response) => response.text());
      return await Promise.all(promises);

      const countriesCovidUrls = await Promise.all(this.countries.map((country) => {
        countryCoronaApi

        // `https://intense-mesa-62220.herokuapp.com/https://corona-api.com/countries/`;//+countryCode
        // add to promise array country url
      });

      // this.countriesCovidData = await countries.PromiseAll(countriesCovidUrls);
      //  this.loadDataInChart(countriesCovidData);
    } catch (e) {
      console.log(e);
    }
  },

  loadDataInChart(countriesCovidData) {},

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

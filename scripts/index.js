"use strict";

const covid19 = {
  // properties
  continents: ["Africa", "Americas", "Asia", "Europe", "Oceania"],
  constinetCountriesUrl:
    "https://intense-mesa-62220.herokuapp.com/https://restcountries.herokuapp.com/api/v1/region/",
  selectedContinent: "",
  selectedContinentContries: "",
  continentsAndCities: {},
  statistics: {
    cases: "",
    deaths: "",
    recovered: "",
  },
  countries: "",
  selectedContinentCountriesName: [],
  countryCoronaUrl: `https://intense-mesa-62220.herokuapp.com/https://corona-api.com/countries/`,
  countriesCoronaData: "",

  // chart
  covidChart: "",
  chartData: {
    labels: "",
    datasets: [
      {
        label: "",
        backgroundColor: "rgb(255, 99, 132)",
        borderColor: "rgb(255, 99, 132)",
        data: [],
      },
    ],
  },

  config: {
    type: "line",
    data: "",
    options: {},
  },

  // methods

  showSelectedCountryData({ target }) {
    const conronaCountryData = this.countriesCoronaData;
    console.log("data target", conronaCountryData);
    const { confirmed, critical, deaths, recovered } =
      conronaCountryData[target.value].data.latest_data;
    document.querySelector(".confirmed-cases-value").textContent = confirmed;
    document.querySelector(".deaths-value").textContent = deaths;
    document.querySelector(".recovered-value").textContent = recovered;
    document.querySelector(".critical-condition-value").textContent = critical;

    console.log("show", conronaCountryData[target.value].data.latest_data);
  },

  // draw chart by statistics type, statistics type options are: Confirmed Cases, Deaths , recovered ,critical condition
  drawChart(statisticsType) {
    const chartData = this.chartData;
    chartData.labels = this.selectedContinentCountriesName;

    console.log("countries Data", this.countriesCoronaData);

    const data = this.countriesCoronaData.map(
      (country) => country.data.latest_data[statisticsType]
    );

    chartData.datasets = [
      {
        label: `${this.selectedContinent} Covid Chart`,
        backgroundColor: "rgb(255, 99, 132)",
        borderColor: "rgb(255, 99, 132)",
        data: data,
      },
    ];

    this.config.data = chartData;

    if (this.covidChart !== "") this.covidChart.destroy();
    this.covidChart = new Chart(
      document.getElementById("covidChart"),
      this.config
    );
  },

  // get all countries names for selected continent
  async getCountriesByContinent(continent) {
    try {
      // `https://intense-mesa-62220.herokuapp.com/https://corona-api.com/countries/`;//+countryCode

      const request = `${covid19.constinetCountriesUrl}${continent}`;
      this.countries = await (await fetch(request)).json();
      this.continentsAndCities[continent] = this.countries;
      await this.getContinentCountriesCovidData(this.countries);

      const countriesSelectElement = document.querySelector(".countries");
      countriesSelectElement.textContent = "";
      this.selectedContinentCountriesName = [];

      this.countries.forEach((country, index) => {
        countriesSelectElement.add(new Option(country.name.common, index));
        this.selectedContinentCountriesName.push(country.name.common);
      });

      countriesSelectElement.addEventListener(
        "input",
        this.showSelectedCountryData.bind(this)
      );

      this.drawChart("confirmed");
    } catch (e) {
      console.log(e);
    }
  },

  // get all countries covid data
  async getContinentCountriesCovidData(countries) {
    try {
      const requests = this.countries.map((country) =>
        fetch(this.countryCoronaUrl + country.cca2)
      );

      const responses = await Promise.all(requests);
      const promises = responses.map((response) => response.json());
      this.countriesCoronaData = await Promise.all(promises);
    } catch (e) {
      console.log(e);
    }
  },

  loadDataInChart(countriesCovidData) {},

  getCountry() {},
  getCountryCovidData() {},

  selectPageElements() {
    this.worldMapElement = document.querySelector("svg");
    this.continentTitleElement = document.querySelector(".continent-title");
  },

  selectContinent() {
    this.worldMapElement.addEventListener("click", ({ target }) => {
      if (target.tagName.toUpperCase() !== "PATH") return;

      const continentID = target.closest("g").getAttribute("data-country-id");
      this.selectedContinent = this.continents[continentID];
      this.continentTitleElement.textContent = this.selectedContinent;

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

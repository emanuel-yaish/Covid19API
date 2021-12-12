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
  chartLabelColor: "rgb(255, 99, 132)",
  covidChart: "",
  chartData: {
    labels: "",
    datasets: [
      {
        label: "",
        backgroundColor: "",
        borderColor: "",
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
    const coronaCountryData = this.countriesCoronaData;
    const { confirmed, critical, deaths, recovered } =
      coronaCountryData[target.value].data.latest_data;
    this.confirmedCasesValueElement.textContent = confirmed;
    this.deathsValueElement.textContent = deaths;
    this.recoveredValueElement.textContent = recovered;
    this.criticalConditionValueElement.textContent = critical;
  },

  // draw chart by statistics type, statistics type options are: Confirmed Cases, Deaths , recovered ,critical condition
  drawChart(statisticsType) {
    const chartData = this.chartData;
    chartData.labels = this.selectedContinentCountriesName;

    const data = this.countriesCoronaData.map(
      (country) => country.data.latest_data[statisticsType]
    );

    chartData.datasets = [
      {
        label: `${this.selectedContinent} ${statisticsType} Covid Chart`,
        backgroundColor: this.chartLabelColor,
        borderColor: this.chartLabelColor,
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

  // extract names of the countries and add it to select element and continent array
  extractCountriesName() {
    this.countriesSelectElement.textContent = "";
    this.selectedContinentCountriesName = [];

    this.countries.forEach((country, index) => {
      this.countriesSelectElement.add(new Option(country.name.common, index));
      this.selectedContinentCountriesName.push(country.name.common);
    });
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

  // get all countries names for selected continent
  async getCountriesByContinent(continent) {
    try {
      const request = `${covid19.constinetCountriesUrl}${continent}`;
      this.countries = await (await fetch(request)).json();
      this.continentsAndCities[continent] = this.countries;
      await this.getContinentCountriesCovidData(this.countries);

      this.extractCountriesName();

      this.drawChart("confirmed");
    } catch (e) {
      console.log(e);
    }
  },

  showGraphAndCountry() {
    const hiddenElemnts = document.querySelectorAll(".hidden");
    hiddenElemnts.forEach((element) => element.classList.remove("hidden"));
  },

  selectContinent() {
    this.worldMapElement.addEventListener("click", ({ target }) => {
      if (target.tagName.toUpperCase() !== "PATH") return;

      if (this.selectedContinent === "") this.showGraphAndCountry();

      const continentID = target.closest("g").getAttribute("data-country-id");
      this.selectedContinent = this.continents[continentID];
      this.continentTitleElement.textContent = this.selectedContinent;

      if (this.continentsAndCities[this.selectedContinent] === undefined)
        this.getCountriesByContinent(this.selectedContinent);
      else {
        showContinentData();
      }
    });
  },

  selectCountry() {
    this.countriesSelectElement.addEventListener(
      "input",
      this.showSelectedCountryData.bind(this)
    );
  },

  addPageEvents() {
    this.selectContinent();
    this.selectCountry();
  },

  selectPageElements() {
    this.worldMapElement = document.querySelector("svg");
    this.continentTitleElement = document.querySelector(".continent-title");
    this.countriesSelectElement = document.querySelector(".countries");
    this.confirmedCasesValueElement = document.querySelector(
      ".confirmed-cases-value"
    );
    this.deathsValueElement = document.querySelector(".deaths-value");
    this.recoveredValueElement = document.querySelector(".recovered-value");
    this.criticalConditionValueElement = document.querySelector(
      ".critical-condition-value"
    );
  },

  init() {
    this.selectPageElements();
    this.addPageEvents();
  },
};

covid19.init();

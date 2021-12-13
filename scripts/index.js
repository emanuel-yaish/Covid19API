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
  countries: "",
  continentCountriesName: {
    Africa: [],
    Americas: [],
    Asia: [],
    Europe: [],
    Oceania: [],
  },

  continentsCountriesAndCovidData: {
    Africa: [],
    Americas: [],
    Asia: [],
    Europe: [],
    Oceania: [],
  },

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
  showContinentData() {
    this.drawChart("confirmed");
  },

  showSelectedCountryData({ target }) {
    const coronaCountryData = this.countriesCoronaData;
    const { confirmed, critical, deaths, recovered } =
      coronaCountryData[target.value].data.latest_data;
    this.confirmedCasesValueElement.textContent = confirmed.toLocaleString();
    this.deathsValueElement.textContent = deaths.toLocaleString();
    this.recoveredValueElement.textContent = recovered.toLocaleString();
    this.criticalConditionValueElement.textContent = critical.toLocaleString();
  },

  // Add countries names to select element
  addSelectCountriesName() {
    this.countriesSelectElement.textContent = "";

    this.continentsCountriesAndCovidData[this.selectedContinent].forEach(
      (country, index) => {
        this.countriesSelectElement.add(new Option(country.data.name, index));
      }
    );
  },

  // draw chart by statistics type, statistics type options are: confirmed Cases, deaths , recovered ,critical condition
  drawChart(statisticsType) {
    const chartData = this.chartData;

    // labels
    chartData.labels = this.continentsCountriesAndCovidData[
      this.selectedContinent
    ].map((country) => {
      if (country.data) return country.data.name;
      else return (country.data = "");
    });

    // covid values
    const data = this.continentsCountriesAndCovidData[
      this.selectedContinent
    ].map((country) => {
      if (country.data) return country.data.latest_data[statisticsType];
      else return 0;
    });

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

  // get all countries covid data
  async getContinentCountriesCovidData(countries) {
    try {
      this.hideGraphAndCountry();
      const requests = this.countries.map((country) =>
        fetch(this.countryCoronaUrl + country.cca2)
      );

      const responses = await Promise.all(requests);
      const promises = responses.map((response) => response.json());
      // to change this lines
      this.countriesCoronaData = await Promise.all(promises);
      this.continentsCountriesAndCovidData[this.selectedContinent] =
        this.countriesCoronaData;
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

      this.drawChart("confirmed");
      this.addSelectCountriesName();
      this.showGraphAndCountry();
    } catch (e) {
      console.log(e);
    }
  },

  showGraphAndCountry() {
    this.hiddenElemnts.forEach((element) => element.classList.remove("hidden"));
    this.loader.classList.toggle("hidden");
  },

  hideGraphAndCountry() {
    this.hiddenElemnts.forEach((element) => element.classList.add("hidden"));
    this.loader.classList.toggle("hidden");
  },

  selectStatisticButton({ target }) {
    this.drawChart(target.value);
  },

  selectStatisticType() {
    this.statisticsButtons.forEach((button) => {
      button.addEventListener("click", this.selectStatisticButton.bind(this));
    });
  },

  selectContinent() {
    this.worldMapElement.addEventListener("click", ({ target }) => {
      if (target.tagName.toUpperCase() !== "PATH") return;

      const continentID = target.closest("g").getAttribute("data-country-id");
      this.selectedContinent = this.continents[continentID];
      this.continentTitleElement.textContent = this.selectedContinent;

      if (this.continentsAndCities[this.selectedContinent] === undefined) {
        this.getCountriesByContinent(this.selectedContinent);
      } else {
        this.showContinentData();
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
    this.selectStatisticType();
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
    this.loader = document.querySelector(".lds-ellipsis");
    this.statisticsButtons = document.querySelectorAll(".statistic-button");
    this.hiddenElemnts = document.querySelectorAll(".hidden");
  },

  init() {
    this.selectPageElements();
    this.addPageEvents();
  },
};

covid19.init();

<template>
    <div>
        <base-header type="gradient-success" class="pb-6 pb-8 pt-5 pt-md-8">

            <div class="container-fluid">
                <div class="row">
                    <div class="col-lg-7 col-md-10">
                        <h1 class="display-2 text-white">Hi John</h1>
                        <p class="text-white mt-0 mb-5">{{randomQuip}}</p>
                    </div>
                </div>
            </div>

            <!-- Card stats -->
            <div class="row">

                <div class="col-xl-3 col-lg-6">
                    <stats-card title="Conditions in the Hood"
                                type="gradient-info"
                                :sub-title="`${wunderground.currentConditions.metric.temp} °C`"
                                :icon="`wi ${openWeatherCurrentIcon}`"
                                class="mb-4 mb-xl-0"
                                v-if="openweather.currentConditions !== null && wunderground.currentConditions !== null"
                    >
                        <template slot="footer">
                            <span class="text-info mr-2"><i class="fa fa-tint"></i> {{wunderground.currentConditions.metric.precipTotal}} mm</span>
                            <span class="text-nowrap">today</span>
                        </template>
                    </stats-card>
                    <loading-card v-else class="mb-4 mb-xl-0"></loading-card>
                </div>

                <div class="col-xl-3 col-lg-6">
                    <stats-card title="Forecast Rest of Today"
                                type="gradient-orange"
                                :sub-title="`${round(openweather.dailyForecast[0].temp.day, 1)} °C`"
                                :icon="`wi ${openWeatherForecastIcon}`"
                                class="mb-4 mb-xl-0"
                                v-if="openweather.dailyForecast !== null"
                    >
                        <template slot="footer">
                            <span class="text-nowrap">{{sentenceCase(openweather.dailyForecast[0].weather[0].description)}}</span>
                        </template>
                    </stats-card>
                    <loading-card v-else class="mb-4 mb-xl-0"></loading-card>
                </div>

                <div class="col-xl-3 col-lg-6">
                    <solar-production-stats-card
                      :solaredge-web="solaredgeWeb"
                      :solaredge-api="solaredgeApi"
                      :show-action="false"
                    >
                    </solar-production-stats-card>
                </div>

                <div class="col-xl-3 col-lg-6">
                    <tesla-battery-stats-card
                      title="Tesla status"
                      :tesla="tesla"
                      :show-locality="true"
                    ></tesla-battery-stats-card>
                </div>

            </div>
        </base-header>

        <!--Charts-->
        <div class="container-fluid mt--7">
            <div class="row">
                <div class="col-xl-6 mb-5 mb-xl-0">
                    <card header-classes="bg-transparent">
                        <div slot="header" class="row align-items-center">
                            <div class="col">
                                <h6 class="text-muted text-uppercase ls-1 mb-1">Observed in the hood</h6>
                                <h5 class="h3 mb-0">Temperature</h5>
                            </div>
                            <div class="col">
                                <ul class="nav nav-pills justify-content-end">
                                    <li class="nav-item">
                                        <a class="nav-link py-2 px-3"
                                           href="#"
                                           :class="{active: temperatureWeekChart.activeIndex === 1}"
                                           @click.prevent="temperatureWeekChart.activeIndex = 1">
                                            <span class="d-none d-md-block">Today</span>
                                            <span class="d-md-none">W</span>
                                        </a>
                                    </li>
                                    <li class="nav-item mr-2 mr-md-0">
                                        <a class="nav-link py-2 px-3"
                                           href="#"
                                           :class="{active: temperatureWeekChart.activeIndex === 0}"
                                           @click.prevent="temperatureWeekChart.activeIndex = 0">
                                            <span class="d-none d-md-block">This week</span>
                                            <span class="d-md-none">M</span>
                                        </a>
                                    </li>
                                </ul>
                            </div>
                        </div>
                        <line-chart
                                v-if="temperatureWeekChart.activeIndex == 0"
                                :height="350"
                                ref="bigChart"
                                :chart-data="temperatureWeekChart.chartData"
                                :extra-options="temperatureWeekChart.extraOptions"
                                key="temperature-chart-week"
                        >
                        </line-chart>
                        <line-chart
                                v-if="temperatureWeekChart.activeIndex == 1"
                                :height="350"
                                ref="temperatureDayChart"
                                :chart-data="temperatureDayChart.chartData"
                                :extra-options="temperatureDayChart.extraOptions"
                                key="temperature-chart-day"
                        >
                        </line-chart>

                    </card>
                </div>

                <div class="col-xl-6">
                    <card header-classes="bg-transparent">
                        <div slot="header" class="row align-items-center">
                            <div class="col">
                                <h6 class="text-uppercase text-muted ls-1 mb-1">Observed in the hood</h6>
                                <h5 class="h3 mb-0">Precipitation</h5>
                            </div>
                            <div class="col">
                                <ul class="nav nav-pills justify-content-end">
                                    <li class="nav-item">
                                        <a class="nav-link py-2 px-3"
                                           type="info"
                                           href="#"
                                           :class="{active: temperatureWeekChart.activeIndex === 1}"
                                           @click.prevent="temperatureWeekChart.activeIndex = 1">
                                            <span class="d-none d-md-block">Today</span>
                                            <span class="d-md-none">T</span>
                                        </a>
                                    </li>
                                    <li class="nav-item mr-2 mr-md-0">
                                        <a class="nav-link py-2 px-3"
                                           href="#"
                                           :class="{active: temperatureWeekChart.activeIndex === 0}"
                                           @click.prevent="temperatureWeekChart.activeIndex = 0">
                                            <span class="d-none d-md-block">This week</span>
                                            <span class="d-md-none">W</span>
                                        </a>
                                    </li>
                                </ul>
                            </div>
                        </div>

                        <bar-chart
                                v-if="temperatureWeekChart.activeIndex == 0"
                                :height="350"
                                ref="barChart"
                                :chart-data="rainfallWeekChart.chartData"
                                :extra-options="rainfallWeekChart.extraOptions"
                                key="rainfall-chart-week"
                        >
                        </bar-chart>
                        <bar-chart
                                v-if="temperatureWeekChart.activeIndex == 1"
                                :height="350"
                                ref="barChart"
                                :chart-data="rainfallDayChart.chartData"
                                :extra-options="rainfallDayChart.extraOptions"
                                key="rainfall-chart-day"
                        >
                        </bar-chart>
                    </card>
                </div>
            </div>
            <!-- End charts-->

            <!--Tables-->
            <div class="row mt-5">
              <div class="col-xl-6 mb-5 mb-xl-0">
                <power-production-table
                  v-if="solaredgeWeb.currentPower !== null"
                  :solaredgeWeb="solaredgeWeb"
                >
                </power-production-table>
                <loading-card v-else></loading-card>
              </div>
              <div class="col-xl-6 mb-5 mb-xl-0">
                <power-consumption-table
                  v-if="solaredgeWeb.currentPower !== null && tesla.vehicle !== null"
                  :solaredgeWeb="solaredgeWeb"
                  :tesla="tesla"
                >
                </power-consumption-table>
                <loading-card v-else></loading-card>
              </div>
            </div>
            <!--End tables-->
        </div>

    </div>
</template>

<script>
  import * as dayjs from 'dayjs'
  import duration from 'dayjs/plugin/duration'
  dayjs.extend(duration)
  import { sentenceCase } from "change-case";

  import { round, milesToKms } from '@/maths-utils'
  import { timeOfDay } from '@/weather-utils'

  // Charts
  import * as chartConfigs from '@/components/Charts/config';
  import LineChart from '@/components/Charts/LineChart';
  import BarChart from '@/components/Charts/BarChart';
  import LoadingCard from '@/components/LoadingCard';

  // Tables
  import PowerProductionTable from './Dashboard/PowerProductionTable';
  import PowerConsumptionTable from './Dashboard/PowerConsumptionTable';
  import TeslaBatteryStatsCard from '@/components/TeslaBatteryStatsCard';
  import SolarProductionStatsCard from '@/components/SolarProductionStatsCard';

  import tesla from '@/service/tesla'
  import openweather from '@/service/openweather'
  import wunderground from '@/service/weather-underground'
  import solaredgeWeb from '@/service/solaredge-web'
  import solaredgeApi from '@/service/solaredge-api'

  const vm = {
    components: {
      LineChart,
      BarChart,
      PowerProductionTable,
      PowerConsumptionTable,
      TeslaBatteryStatsCard,
      SolarProductionStatsCard,
      LoadingCard,
    },
    data() {
      return {
        temperatureWeekChart: {
          // allData: [
          //   wunderground.hourly7DayConditions ? wunderground.hourly7DayConditions.map(observation => observation.metric.tempAvg) : null,
          // ],
          activeIndex: 1,
          chartData: {
            datasets: [{
              label: 'Temperature',
              data: wunderground.hourly7DayConditions !== null ? wunderground.hourly7DayConditions.map(observation => observation.metric.tempAvg) : null
            }],
            labels: wunderground.hourly7DayConditions !== null ? wunderground.hourly7DayConditions.map(observation => { return observation.obsTimeLocal }) : null
          },
          extraOptions: chartConfigs.blueChartOptions,
        },
        temperatureDayChart: {
          // allData: [
          //   wunderground.rapid1DayConditions ? wunderground.rapid1DayConditions.map(observation => observation.metric.tempAvg) : null,
          // ],
          activeIndex: 0,
          chartData: {
            datasets: [{
              label: 'Temperature',
              data: wunderground.rapid1DayConditions !== null ? wunderground.rapid1DayConditions.map(observation => observation.metric.tempAvg) : null
            }],
            labels: wunderground.rapid1DayConditions !== null ? wunderground.rapid1DayConditions.map(observation => { return observation.obsTimeLocal }) : null
          },
          extraOptions: chartConfigs.blueChartOptions,
        },
        rainfallWeekChart: {
          chartData: {
            labels: wunderground.hourly7DayConditions !== null ? wunderground.hourly7DayConditions.map(observation => observation.obsTimeLocal) : null,
            datasets: [{
              label: 'Precipitation',
              data: wunderground.hourly7DayConditions !== null ? wunderground.hourly7DayConditions.map(observation => +round(observation.metric.precipAbs, 2)) : null
            }]
          },
          extraOptions: chartConfigs.rainfallChartOptions,
        },
        rainfallDayChart: {
          chartData: {
            labels: wunderground.rapid1DayConditions !== null ? wunderground.rapid1DayConditions.map(observation => observation.obsTimeLocal) : null,
            datasets: [{
              label: 'Precipitation',
              data: wunderground.rapid1DayConditions !== null ? wunderground.rapid1DayConditions.map(observation => +round(observation.metric.precipAbs, 2)) : null
            }]
          },
          extraOptions: chartConfigs.rainfallChartOptions,
        },
        tesla,
        openweather,
        wunderground,
        solaredgeWeb,
        solaredgeApi,
        round,
        milesToKms,
        sentenceCase,
      }
    },
    computed: {
      // TODO: Replace with current icon from openweather service
      openWeatherCurrentIcon() {
        return this.openweather.currentConditions !== null
          ? openweather.conditionIcon(
            this.openweather.currentConditions.weather[0].id,
            timeOfDay()
          ) : null
      },
      openWeatherForecastIcon() {
        return this.openweather.dailyForecast !== null
          ? openweather.conditionIcon(
            this.openweather.dailyForecast[0].weather[0].id,
            timeOfDay()
          ) : null
      },
      randomQuip() {
        const quips = [
          'Good drying day today?',
          'Good drying day today?',
          'The crossword isn\'t done yet.',
          'Golfing weather?',
          'Did you know - EVs are better for the climate, no matter how they are charged.',
          'Did you know - March 27th is National Paella Day in Spain.',
          'How is production today?'
        ]
        return quips[Math.floor(Math.random() * quips.length)]
      }
    },
    methods: {
      // initBigChart(index) {
      //   let chartData = {
      //     datasets: [
      //       {
      //         label: 'Temperature °C',
      //         data: this.temperatureWeekChart.allData[index]
      //       }
      //     ],
      //     labels: this.temperatureWeekChart.chartData.labels,
      //   };
      //   this.temperatureWeekChart.chartData = chartData;
      //   this.temperatureWeekChart.activeIndex = index;
      // },
      // initTemperatureDayChart(index) {
      //   let chartData = {
      //     datasets: [
      //       {
      //         label: 'Temperature °C',
      //         data: this.temperatureDayChart.allData[index]
      //       }
      //     ],
      //     labels: this.temperatureDayChart.chartData.labels,
      //   };
      //   this.temperatureDayChart.chartData = chartData;
      //   this.temperatureDayChart.activeIndex = index;
      // },
      
    },
    async mounted() {
      // this.initBigChart(0)
      // this.initTemperatureDayChart(0)
    }
  };

  export default vm
</script>
<style></style>

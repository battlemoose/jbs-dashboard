<template>
  <card header-classes="bg-transparent">
    <div slot="header" class="row align-items-center">
      <div class="col">
        <h6 class="text-uppercase text-muted ls-1 mb-1">Forecast for the hood</h6>
        <h5 class="h3 mb-0">Next 24 hours</h5>
      </div>
      <div class="col-auto">
        <span class="font-weight-light">
          Min <span class="font-weight-bold">{{round(minTemp, 1)}} °C</span> | Max <span class="font-weight-bold">{{round(maxTemp, 1)}} °C</span>
        </span>
      </div>
    </div>

    <div class="row mb-3">
      <div class="col">
        <line-chart
          :height="250"
          ref="forecast-chart"
          :chart-data="chartData"
          :extra-options="chartExtraOptions"
        >
        </line-chart>
      </div>
    </div>

    <div class="row mt-3 ml-3">
      <div class="col px-0" v-for="hour in filteredHourlyForecast" :key="hour.dt">
        <div class="text-center">
          <h2 class="mb-0"><i :class="`wi ${openweather.conditionIcon(hour.weather[0].id, timeOfDay(dayjs.unix(hour.dt)))}`"></i></h2>
        </div>
        <div class="text-center">
          <small class="text-muted">{{round(hour.temp)}} °C</small>
        </div>
        <div class="text-center">
          <small class="text-info"><i class="fa fa-cloud-rain"></i> {{round(hour.pop * 100)}}%</small>
        </div>
        <div class="text-center">
          <small class="text-muted">{{dayjs.unix(hour.dt).format('h:mm a')}}</small>
        </div>
      </div>
    </div>
  </card>
</template>

<script>
import * as dayjs from 'dayjs'

import { timeOfDay } from '@/weather-utils'
import { round } from '@/maths-utils'
import Card from './Card.vue'
import LineChart from '@/components/Charts/LineChart'
import * as chartConfigs from '@/components/Charts/config'

export default {
  components: {
    Card,
    LineChart,
  },
  props: {
    openweather: Object,
  },
  data() {
    return {
      dayjs,
      timeOfDay,
      round,
      chartExtraOptions: chartConfigs.forecastChartOptions
    }
  },
  computed: {
    truncatedHourlyForecast() {
      if (this.openweather.hourlyForecast) {
        return this.openweather.hourlyForecast.slice(0, 24)
      } else {
        return null
      }
    },
    filteredHourlyForecast() {
      if (this.truncatedHourlyForecast) {
        return this.truncatedHourlyForecast.filter( (element, index) => index % 3 == 0 )
      } else {
        return null
      }
    },
    minTemp() {
      if (this.truncatedHourlyForecast) {
        return this.truncatedHourlyForecast
          .map(hour => hour.temp)
          .reduce((previous, current) => current < previous ? current : previous)
      } else {
        return null
      }
    },
    maxTemp() {
      if (this.truncatedHourlyForecast) {
        return this.truncatedHourlyForecast
          .map(hour => hour.temp)
          .reduce((previous, current) => current > previous ? current : previous)
      } else {
        return null
      }
    },
    chartData() {
      if (this.truncatedHourlyForecast) {
        return {
          datasets: [{
            label: 'Temperature °C',
            data: this.truncatedHourlyForecast.map(hour => hour.temp)
          }],
          labels: this.truncatedHourlyForecast.map(hour => hour.dt)
        }
      } else {
        return {}
      }
    }
  }
}
</script>

<style>

</style>
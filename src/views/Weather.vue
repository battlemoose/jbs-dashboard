<template>
  <div>
    <base-header type="gradient-warning" class="pb-6 pb-8 pt-5 pt-md-8">

      <div class="row">

        <div class="col-xl-4 col-lg-8">
          <stats-card title="Conditions in the Hood"
                      type="gradient-info"
                      :sub-title="`${wunderground.currentConditions.metric.temp} °C`"
                      :icon="`wi ${openweather.currentIcon()}`"
                      class="mb-4 mb-xl-0"
                      v-if="openweather.currentConditions !== null && wunderground.currentConditions !== null"
          >
            <template slot="footer">
              <div class="row mb-3">
                <div class="col">
                  <span class="text-info mr-2"><i class="fa fa-tint"></i> {{wunderground.currentConditions.metric.precipTotal}} mm</span>
                  <span>today</span>
                </div>
                <div class="col-auto">
                  {{sentenceCase(openweather.currentConditions.weather[0].description)}}
                </div>
              </div>
              
              <div class="table-responsive">
                <base-table thead-classes="thead-light" :data="tableData">

                  <template slot-scope="{row}">
                    <th scope="row" class="p-2" :class="{'pl-5': row.indent}">
                      <span v-if="row.labelIcon !== null && row.labelIcon !== undefined" class="mr-1"><i :class="row.labelIcon"></i></span>
                      {{row.label}}
                    </th>
                    <td class="p-2">
                      <span v-if="row.valueIcon !== null && row.valueIcon !== undefined" class="mr-1"><i :class="row.valueIcon"></i></span>
                      <span v-if="row.value !== null && row.value !== undefined">{{row.value}}</span>
                    </td>
                  </template>

                </base-table>
              </div>

            </template>
          </stats-card>
          <loading-card v-else class="mb-4 mb-xl-0"></loading-card>
        </div>

        <div class="col-xl-8">
          <weather-main-forecast :openweather="openweather"></weather-main-forecast>
        </div>

      </div>

    </base-header>

    <div class="container-fluid mt--7">
      <div class="row">

        <div class="col-lg-6">
          <weather-today-summary :wunderground="wunderground" class="mb-4"></weather-today-summary>
        </div>

        <div class="col-lg-6">
          <weather-7-day-forecast :openweather="openweather" class="mb-4"></weather-7-day-forecast>
        </div>

        <div class="col">
          <card class="">
            Historical data <div class="badge badge-primary">Coming soon</div>
          </card>
        </div>

      </div>
    </div>

  </div>
</template>

<script>
  import * as dayjs from 'dayjs'

  import { sentenceCase } from "change-case"
  
  import { round, angleToCompass } from '@/maths-utils'

  import WeatherMainForecast from '@/components/WeatherMainForecast'
  import WeatherTodaySummary from '@/components/WeatherTodaySummary'
  import Weather7DayForecast from '@/components/Weather7DayForecast'

  // import LineChart from '@/components/Charts/LineChart';
  // import BarChart from '@/components/Charts/BarChart';
  import LoadingCard from '@/components/LoadingCard'

  import openweather from '@/service/openweather'
  import wunderground from '@/service/weather-underground'

  export default {
    components: {
      // LineChart,
      // BarChart,
      LoadingCard,
      WeatherMainForecast,
      WeatherTodaySummary,
      Weather7DayForecast,
    },
    data() {
      return {
        openweather,
        wunderground,
        round,
        sentenceCase,
        dayjs,
      }
    },
    computed: {
      tableData() {
        return [
          {
            label: 'Humidity',
            value: wunderground.currentConditions.humidity + '%',
            labelIcon: 'fa fa-fw fa-tint'
          },
          {
            label: 'Dewpoint',
            value: round(wunderground.currentConditions.metric.dewpt, 1) + ' °C',
            labelIcon: 'fa -fa-fw fa-leaf'
          },
          {
            label: 'Precipitation rate',
            value: wunderground.currentConditions.metric.precipRate + ' mm/h',
            labelIcon: 'fa fa-fw fa-cloud-showers-heavy'
          },
          {
            label: 'Wind direction',
            value: angleToCompass(wunderground.currentConditions.winddir),
            valueIcon: `wi wi-wind from-${wunderground.currentConditions.winddir}-deg`,
            labelIcon: 'fa fa-fw fa-flag'
          },
          {
            label: 'Wind speed',
            value: round(wunderground.currentConditions.metric.windSpeed, 1) + ' km/h',
            labelIcon: 'fas fa-fw fa-fan'
          },
          {
            label: 'Wind gust',
            value: round(wunderground.currentConditions.metric.windGust, 1) + ' km/h',
            labelIcon: 'fa fa-fw fa-wind'
          },
          {
            label: 'Pressure',
            value: round(wunderground.currentConditions.metric.pressure, 2) + ' hPa',
            labelIcon: 'fa fa-fw fa-tachometer-alt',
          },
          {
            label: 'Solar radiation',
            value: round(wunderground.currentConditions.solarRadiation, 1) + ' W/m²',
            labelIcon: 'fa fa-fw fa-sun'
          },
          {
            label: 'UV index',
            value: wunderground.currentConditions.uv,
            labelIcon: 'fa fa-fw fa-tshirt'
          },
        ]
      }
    },
    methods: {
      rotated(angle) {
        if (angle !== null && angle !== undefined) {
          return { transform: `rotate(${angle}deg` }
        } else {
          return {}
        }
      }
    }
  }
</script>

<style>

</style>
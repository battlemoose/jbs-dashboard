<template>
  <card class="card-stats">
    <div class="row">
      <div class="col">
        <h5 class="card-title text-uppercase text-muted mb-0">Observed in the hood</h5>
        <span class="h2 font-weight-bold mb-0">Today's summary</span>

        <div class="table-responsive mt-3">
          <base-table thead-classes="thead-light" :data="tableData">

            <template slot="columns">
              <th class="p-2"></th>
              <th class="p-2">High</th>
              <th class="p-2">Low</th>
              <th class="p-2">Average</th>
            </template>

            <template slot-scope="{row}">
              <th scope="row" class="p-2" :class="{'pl-5': row.indent}">
                <span v-if="row.labelIcon !== null && row.labelIcon !== undefined" class="mr-1"><i :class="row.labelIcon"></i></span>
                {{row.label}}
              </th>
              <td class="p-2">
                <span v-if="row.high !== null && row.high !== undefined">{{row.high}}</span>
              </td>
              <td class="p-2">
                <span v-if="row.low !== null && row.low !== undefined">{{row.low}}</span>
              </td>
              <td class="p-2">
                <span v-if="row.averageIcon !== null && row.averageIcon !== undefined" class="mr-1"><i :class="row.averageIcon"></i></span>
                <span v-if="row.average !== null && row.average !== undefined">{{row.average}}</span>
              </td>
            </template>

          </base-table>

          <div class="row mt-3" v-if="wunderground.daily7DayConditions">
            <div class="col text-muted">
              <small><i class="wi wi-sunrise"></i> Sunrise {{sunrise.format('h:mm a')}}, {{sunrise.fromNow()}}</small>  
            </div>
          </div>
          <div class="row mt-1" v-if="wunderground.daily7DayConditions">
            <div class="col text-muted">
              <small><i class="wi wi-sunset"></i> Sunset {{sunset.format('h:mm a')}}, {{sunset.fromNow()}}</small>  
            </div>
          </div>
        
        </div>
      </div>
    </div>
  </card>
</template>

<script>
import * as dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
dayjs.extend(relativeTime)

import { round, angleToCompass } from '@/maths-utils'
import { getSunTime } from '@/weather-utils'

export default {
  props: {
    wunderground: Object,
  },
  data() {
    return {
      
    }
  },
  computed: {
    tableData() {
      if (this.wunderground.daily7DayConditions) {
        return [
          {
            label: 'Temperature',
            labelIcon: 'fa fa-fw fa-temperature-high',
            high: round(this.wunderground.daily7DayConditions[6].metric.tempHigh, 1) + ' °C',
            low: round(this.wunderground.daily7DayConditions[6].metric.tempLow, 1) + ' °C',
            average: round(this.wunderground.daily7DayConditions[6].metric.tempAvg, 1) + ' °C',
          },
          {
            label: 'Precipitation',
            labelIcon: 'fa fa-fw fa-cloud-showers-heavy',
            high: round(this.wunderground.daily7DayConditions[6].metric.precipTotal, 2) + ' mm',
          },
          {
            label: 'Humidity',
            labelIcon: 'fa fa-fw fa-tint',
            high: round(this.wunderground.daily7DayConditions[6].humidityHigh, 1) + '%',
            low: round(this.wunderground.daily7DayConditions[6].humidityLow, 1) + '%',
            average: round(this.wunderground.daily7DayConditions[6].humidityAvg, 1) + '%',
          },
          {
            label: 'Dewpoint',
            labelIcon: 'fa -fa-fw fa-leaf',
            high: round(this.wunderground.daily7DayConditions[6].metric.dewptHigh, 1) + ' °C',
            low: round(this.wunderground.daily7DayConditions[6].metric.dewptLow, 1) + ' °C',
            average: round(this.wunderground.daily7DayConditions[6].metric.dewptAvg, 1) + ' °C',
          },
          {
            label: 'Wind speed',
            labelIcon: 'fas fa-fw fa-fan',
            high: round(this.wunderground.daily7DayConditions[6].metric.windspeedHigh, 1) + ' km/h',
            low: round(this.wunderground.daily7DayConditions[6].metric.windspeedLow, 1) + ' km/h',
            average: round(this.wunderground.daily7DayConditions[6].metric.windspeedAvg, 1) + ' km/h',
          },
          {
            label: 'Wind gust',
            labelIcon: 'fas fa-fw fa-wind',
            high: round(this.wunderground.daily7DayConditions[6].metric.windgustHigh, 1) + ' km/h',
            low: round(this.wunderground.daily7DayConditions[6].metric.windgustLow, 1) + ' km/h',
            average: round(this.wunderground.daily7DayConditions[6].metric.windgustAvg, 1) + ' km/h',
          },
          {
            label: 'Wind direction',
            labelIcon: 'fa fa-fw fa-flag',
            average: angleToCompass(this.wunderground.daily7DayConditions[6].winddirAvg),
            averageIcon: `wi wi-wind from-${this.wunderground.daily7DayConditions[6].winddirAvg}-deg`,
          },
          {
            label: 'Pressure',
            labelIcon: 'fa fa-fw fa-tachometer-alt',
            high: round(this.wunderground.daily7DayConditions[6].metric.pressureMax, 2) + ' hPa',
            low: round(this.wunderground.daily7DayConditions[6].metric.pressureMin, 2) + ' hPa',
          },
          {
            label: 'Solar radiation',
            labelIcon: 'fa fa-fw fa-sun',
            high: round(this.wunderground.daily7DayConditions[6].solarRadiationHigh, 1) + ' W/m²',
          },
          {
            label: 'UV index',
            labelIcon: 'fa fa-fw fa-tshirt',
            high: this.wunderground.daily7DayConditions[6].uvHigh,
          },
        ]
      } else {
        return []
      }
    },
    sunrise() {
      return getSunTime(
        dayjs.unix(this.wunderground.daily7DayConditions[6].epoch),
        'sunrise'
      )
    },
    sunset() {
      return getSunTime(
        dayjs.unix(this.wunderground.daily7DayConditions[6].epoch),
        'sunset'
      )
    },
  }
}
</script>

<style>

</style>
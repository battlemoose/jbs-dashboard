<template>
  <card class="card-stats">
    <div class="row">
      <div class="col">
        <h5 class="card-title text-uppercase text-muted mb-0">Forecast for the hood</h5>
        <span class="h2 font-weight-bold mb-0">Next 7 days</span>

        <div class="table-responsive mt-3">
          <base-table thead-classes="thead-light" :data="tableData">

            <template slot-scope="{row}">
              <td>
                <div class="m-0 d-flex flex-row">

                  <div class="date-container mr-4 d-flex flex-column align-items-center">
                    <div class="h1 mb-1"><i :class="`wi ${openweather.conditionIcon(row.weather[0].id, timeOfDay(dayjs.unix(row.dt)))}`"></i></div>
                    <div>{{dayjs.unix(row.dt).format('ddd D MMM')}}</div>
                  </div>
                  
                  <div>
                    <div class="d-flex align-items-baseline">
                      <span class="h2 mr-3">{{round(row.temp.max, 1)}} °C</span>
                      <span class="h4 font-weight-light">{{sentenceCase(row.weather[0].description)}}</span>
                    </div>
                    
                    <div class="d-flex flex-wrap align-items-baseline text-muted">
                      <span class="condition-pill mr-3 mb-1 text-info" v-b-tooltip.bottom.noninteractive title="Probability of precipitation"><i class="fa fa-cloud-rain"></i> {{row.pop * 100}}%</span>
                      <span class="condition-pill mr-3 mb-1 text-default" v-b-tooltip.bottom.noninteractive title="Cloud coverage"><i class="fa fa-cloud"></i> {{row.clouds}}%</span>
                      <span class="condition-pill mr-3 mb-1" v-b-tooltip.bottom.noninteractive title="Humidity"><i class="fa fa-tint"></i> {{row.humidity}}%</span>
                      <span class="condition-pill mr-3 mb-1" v-b-tooltip.bottom.noninteractive title="Dewpoint"><i class="fa fa-leaf"></i> {{row.dew_point}} °C</span>
                      <span class="condition-pill mr-3 mb-1" v-b-tooltip.bottom.noninteractive title="UV undex"><i class="fa fa-tshirt"></i> {{round(row.uvi, 1)}}</span>
                      <span class="condition-pill mr-3 mb-1" v-b-tooltip.bottom.noninteractive title="Pressure"><i class="fa fa-tachometer-alt"></i> {{row.pressure}} hPa</span>
                      <span class="condition-pill mr-3 mb-1" v-b-tooltip.bottom.noninteractive title="Wind">
                        <span class="h4 text-muted"><i :class="`wi wi-wind from-${row.wind_deg}-deg`"></i></span>
                        {{round(mpsTokmph(row.wind_speed), 1)}} km/h {{angleToCompass(row.wind_deg)}}
                      </span>
                      <span class="condition-pill mr-3 mb-1" v-b-tooltip.bottom.noninteractive title="Sunrise"><i class="wi wi-sunrise"></i> {{dayjs.unix(row.sunrise).format('h:mm a')}}</span>
                      <span class="condition-pill mr-3 mb-1" v-b-tooltip.bottom.noninteractive title="Sunset"><i class="wi wi-sunset"></i> {{dayjs.unix(row.sunset).format('h:mm a')}}</span>
                    </div>
                  </div>

                </div>
              </td>
            </template>

          </base-table>
        
        </div>
      </div>
    </div>
  </card>
</template>

<script>
import * as dayjs from 'dayjs'
import { sentenceCase } from "change-case"
import 'bootstrap-vue/dist/bootstrap-vue.css'
import { VBTooltip } from 'bootstrap-vue'

import { round, angleToCompass, mpsTokmph } from '@/maths-utils'
import { timeOfDay } from '@/weather-utils'

export default {
  directives: {
    'b-tooltip': VBTooltip
  },
  props: {
    openweather: Object,
  },
  data() {
    return {
      dayjs,
      timeOfDay,
      sentenceCase,
      round,
      angleToCompass,
      mpsTokmph,
    }
  },
  computed: {
    tableData() {
      return this.openweather.dailyForecast
    }
  }
}
</script>

<style>
.date-container {
  width: 70px;
}
.condition-pill {
  cursor: default;
}
</style>
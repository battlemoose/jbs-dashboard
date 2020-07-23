<template>
  
  <stats-card :title="title"
              type="gradient-red"
              :sub-title="`${tesla.vehicle.charge_state.battery_level}%`"
              icon="fa fa-battery-full"
              class="mb-4 mb-xl-0"
              v-if="tesla.vehicle !== null"
  >
    <template slot="footer">
      
      <base-progress
        :type="teslaBatteryColor"
        :height="8"
        :value="tesla.vehicle.charge_state.battery_level"
        :show-percentage="false"
        :striped="teslaIsCharging"
        :animated="teslaIsCharging"
        class="pt-2">
      </base-progress>
      
      <div v-if="this.teslaIsCharging">
        <span class="text-success mr-2"><i class="fa fa-charging-station"></i> Charging</span>
        <span class="text-nowrap"><span v-if="teslaTimeToFull.hours() > 0">{{teslaTimeToFull.hours()}}h</span> {{teslaTimeToFull.minutes()}}m remaining</span>
      </div>
      <div v-else>
        <span class="text-nowrap"><i class="fa fa-road"></i> {{round(milesToKms(tesla.vehicle.charge_state.battery_range), 2)}} km range</span>
      </div>
      
      <div class="text-nowrap" v-if="showLocality && tesla.locality !== null">
        <i class="fa fa-map-marker-alt"></i> {{tesla.locality}}
      </div>

    </template>
  </stats-card>
  <loading-card v-else class="mb-4 mb-xl-0"></loading-card>

</template>

<script>
import * as dayjs from 'dayjs'
import duration from 'dayjs/plugin/duration'
dayjs.extend(duration)

import { round, milesToKms } from '@/maths-utils'

import LoadingCard from '@/components/LoadingCard';

export default {
  components: {
    LoadingCard,
  },
  props: {
    tesla: Object,
    title: String,
    showLocality: Boolean,
  },
  data() {
    return {
      round,
      milesToKms,
      locality: null,
    }
  },
  computed: {
    teslaTimeToFull() {
      return this.tesla.vehicle !== null
        ? dayjs.duration(
          this.tesla.vehicle.charge_state.minutes_to_full_charge,
          'minutes'
        ) : null
    },
    teslaIsCharging() {
      return this.tesla.vehicle !== null
        ? this.tesla.vehicle.charge_state.charging_state == 'Charging'
        : null
    },
    teslaBatteryColor() {
      const level = this.tesla.vehicle.charge_state.battery_level
      if (level < 10) {
        return 'danger'
      } else if (level < 20) {
        return 'warning'
      } else if (level < 80) {
        return 'success'
      } else if (level > 80) {
        return 'info'
      } else {
        return 'success'
      }
    }
  },
}
</script>

<style>

</style>
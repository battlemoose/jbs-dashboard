<template>
  
  <stats-card title="Solar production"
              type="gradient-green"
              :sub-title="`${solaredgeWeb.currentPower.PV.currentPower} kW`"
              icon="fa fa-solar-panel"
              class="mb-4 mb-xl-0"
              v-if="solaredgeWeb.currentPower"
  >
      <template slot="footer">
          <span class="text-success mr-2"><i class="fa fa-lightbulb"></i> {{solaredgeApiEnergyToday}} kWh</span>
          <span class="text-nowrap">today</span>

          <div v-if="showAction">
            <base-button class="mt-3" size="sm" type="success" disabled>Actions coming soon</base-button>
          </div>
      </template>
  </stats-card>
  <loading-card v-else class="mb-4 mb-xl-0"></loading-card>

</template>

<script>
import { round } from '@/maths-utils'

import LoadingCard from '@/components/LoadingCard';

export default {
  components: {
    LoadingCard,
  },
  props: {
    solaredgeWeb: Object,
    solaredgeApi: Object,
    showAction: Boolean,
  },
  data() {
    return {
      round,
      locality: null,
    }
  },
  computed: {
    solaredgeApiEnergyToday() {
      return this.solaredgeApi.energyToday !== null
        ? round(this.solaredgeApi.energyToday / 1000, 2)
        : null
    },
  },
}
</script>

<style>

</style>
<template>
  <div class="card">
    <div class="card-header border-0">
      <div class="row align-items-center">
        <div class="col">
          <h3 class="mb-0">Power consumption</h3>
        </div>
        <!-- <div class="col text-right">
          <base-button size="sm" type="primary">See all</base-button>
        </div> -->
      </div>
    </div>

    <div class="table-responsive">
      <base-table thead-classes="thead-light"
                  :data="tableData">
        <template slot="columns">
          <th>Consumer</th>
          <th>Power</th>
          <th></th>
        </template>

        <template slot-scope="{row}">
          <th scope="row" :class="{'pl-5': row.indent}">
            <span :class="`text-${row.iconColor}`"><i :class="row.icon"></i></span>
            <span :class="{'ml-2': row.icon}">{{row.name}}</span>
          </th>
          <td>
            {{round(row.power, 2)}} kW
          </td>
          <td>
            <div class="d-flex align-items-center" v-if="row.percentage !== null && row.percentage !== undefined">
              <span class="mr-2 text-right percentage-label">{{round(row.percentage, 0)}}%</span>
              <base-progress :type="row.progressType"
                             class="pt-0"
                             :show-percentage="false"
                             :value="row.percentage"
              />
            </div>
          </td>
        </template>

      </base-table>
    </div>

  </div>
</template>
<script>
  import { round } from '@/maths-utils'

  export default {
    name: 'power-consumption-table',
    props: {
      solaredgeWeb: Object,
      tesla: Object,
    },
    data() {
      return {
        round,
      }
    },
    computed: {
      tableData() {
        let totalConsumption
        if (this.solaredgeWeb.connections.loadToGrid) {
          totalConsumption = this.solaredgeWeb.currentPower.LOAD.currentPower + this.solaredgeWeb.currentPower.GRID.currentPower
        } else {
          totalConsumption = this.solaredgeWeb.currentPower.LOAD.currentPower
        }
        let gridConsumption
        if (this.solaredgeWeb.connections.loadToGrid) {
          gridConsumption = this.solaredgeWeb.currentPower.GRID.currentPower
        } else {
          gridConsumption = 0
        }

        return [
          {
            name: 'Total',
            power: totalConsumption,
            percentage: null,
            progressType: 'gradient-info',
            indent: false,
          },
          {
            name: 'Household',
            power: this.solaredgeWeb.currentPower.LOAD.currentPower,
            percentage: this.solaredgeWeb.currentPower.LOAD.currentPower / totalConsumption * 100,
            progressType: 'gradient-warning',
            indent: true,
            icon: 'fa fa-home fa-fw',
            iconColor: 'warning'
          },
          {
            name: 'Tesla',
            power: this.tesla.vehicle.charge_state.charger_power,
            percentage: this.tesla.vehicle.charge_state.charger_power / totalConsumption * 100,
            progressType: 'gradient-warning',
            indent: true,
            icon: 'fa fa-car fa-fw',
            iconColor: 'danger'
          },
          {
            name: 'Grid export',
            power: gridConsumption,
            percentage: gridConsumption / totalConsumption * 100,
            progressType: 'gradient-success',
            indent: true,
            icon: 'fa fa-plug fa-fw',
            iconColor: 'success'
          },
        ]
      }
    }

  }
</script>

<style>
  .percentage-label {
    min-width: 34px;
  }
</style>

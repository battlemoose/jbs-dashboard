<template>
  <div class="card">
    <div class="card-header border-0">
      <div class="row align-items-center">
        <div class="col">
          <h3 class="mb-0">Power production</h3>
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
          <th>Source</th>
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
    name: 'power-production-table',
    props: {
      solaredgeWeb: Object,
    },
    data() {
      return {
        round,
      }
    },
    computed: {
      tableData() {
        let totalProduction
        if (this.solaredgeWeb.connections.gridToLoad) {
          totalProduction = this.solaredgeWeb.currentPower.GRID.currentPower + this.solaredgeWeb.currentPower.PV.currentPower
        } else {
          totalProduction = this.solaredgeWeb.currentPower.PV.currentPower
        }
        let gridproduction
        if (this.solaredgeWeb.connections.gridToLoad) {
          gridproduction = this.solaredgeWeb.currentPower.GRID.currentPower
        } else {
          gridproduction = 0
        }

        return [
          {
            name: 'Total',
            power: totalProduction,
            percentage: null,
            progressType: 'gradient-info',
            indent: false,
          },
          {
            name: 'Solar',
            power: this.solaredgeWeb.currentPower.PV.currentPower,
            percentage: this.solaredgeWeb.currentPower.PV.currentPower / totalProduction * 100,
            progressType: 'gradient-success',
            indent: true,
            icon: 'fa fa-solar-panel fa-fw',
            iconColor: 'success'
          },
          {
            name: 'Grid import',
            power: gridproduction,
            percentage: gridproduction / totalProduction * 100,
            progressType: 'gradient-warning',
            indent: true,
            icon: 'fa fa-plug fa-fw',
            iconColor: 'warning'
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

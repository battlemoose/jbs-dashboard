<template>
    <div>

        <base-header type="gradient-danger" class="pb-6 pb-8 pt-5 pt-md-8">
            <!-- Card stats -->
            <div class="row">
                <div class="col-xl-3 col-lg-6">
                    <tesla-battery-stats-card title="Battery" :tesla="tesla"></tesla-battery-stats-card>
                </div>
                <div class="col-xl-3 col-lg-6">
                    <solar-production-stats-card
                      :solaredge-web="solaredgeWeb"
                      :solaredge-api="solaredgeApi"
                      :show-action="true"
                    >
                    </solar-production-stats-card>
                </div>
                <div class="col-xl-3 col-lg-6">
                    <stats-card title="Interior"
                                type="gradient-primary"
                                :sub-title="`${tesla.vehicle.climate_state.inside_temp} °C`"
                                :icon="`fa fa-fan ${tesla.vehicle.climate_state.is_climate_on && 'fa-spin'}`"
                                class="mb-4 mb-xl-0"
                    >
                        <template slot="footer">
                            <div class="text-nowrap">Climate {{tesla.vehicle.climate_state.is_climate_on ? 'on' : 'off'}}</div>
                            <span v-if="tesla.vehicle.climate_state.is_climate_on">
                              <span class="text-primary text-nowrap mr-2"><i class="fa fa-temperature-high"></i> {{tesla.vehicle.climate_state.driver_temp_setting}} °C</span>
                              <span class="text-nowrap mr-3">driver</span>
                              <span class="text-primary text-nowrap mr-2"><i class="fa fa-temperature-high"></i> {{tesla.vehicle.climate_state.passenger_temp_setting}} °C</span>
                              <span class="text-nowrap">passenger</span>
                            </span>
                            <div class="">
                              <base-button class="mt-3" size="sm" type="primary" disabled>Actions coming soon</base-button>
                            </div>
                        </template>
                    </stats-card>
                </div>
                <div class="col-xl-3 col-lg-6">
                    <stats-card title="Status"
                                type="gradient-info"
                                :sub-title="`${tesla.vehicle.drive_state.speed || 0} km/h`"
                                :icon="tesla.vehicle.vehicle_state.locked ? 'fa fa-lock' : 'fa fa-unlock'"
                                class="mb-4 mb-xl-0"
                    >
                        <template slot="footer">
                          <div v-if="tesla.vehicle.vehicle_state.locked">Locked</div><div v-else>Unlocked</div>
                            <span class="mr-2"><i class="fa fa-map-marker-alt"></i> {{tesla.locality}}</span>
                            <span class="text-muted mr-2"><i class="fa fa-tachometer-alt"></i> {{round(tesla.vehicle.vehicle_state.odometer, 1)}} km</span>
                            <div class="">
                              <base-button class="mt-3" size="sm" type="info" disabled>Actions coming soon</base-button>
                            </div>
                        </template>
                    </stats-card>
                </div>
            </div>
        </base-header>

        <div class="container-fluid mt--7">
            <div class="row">
                <div class="col">
                    <div class="card shadow border-0">
                        <div id="map-canvas" class="map-canvas" style="height: 600px;"></div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
  import tesla from "@/service/tesla"
  import { Charts } from '@/components/Charts/config'
  import { round } from '@/maths-utils'

  import TeslaBatteryStatsCard from '@/components/TeslaBatteryStatsCard'
  import SolarProductionStatsCard from '@/components/SolarProductionStatsCard'

  import solaredgeWeb from '@/service/solaredge-web'
  import solaredgeApi from '@/service/solaredge-api'

  const vm = {
    components: {
      TeslaBatteryStatsCard,
      SolarProductionStatsCard,
    },
    data () {
      return {
        tesla,
        map: null,
        marker: null,
        solaredgeWeb,
        solaredgeApi,
        round,
      }
    },
    mounted() {
      let google= window.google
      let map = document.getElementById('map-canvas');
      let lat = tesla.vehicle ? tesla.vehicle.drive_state.latitude : null // map.getAttribute('data-lat');
      let lng = tesla.vehicle ? tesla.vehicle.drive_state.longitude : null // map.getAttribute('data-lng');

      const teslaLatlng = new google.maps.LatLng(lat, lng);
      const mapOptions = {
        zoom: 15,
        scrollwheel: false,
        center: teslaLatlng,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        styles: [
          {"featureType":"administrative","elementType":"labels.text.fill","stylers":[{"color":"#444444"}]},
          {"featureType":"landscape","elementType":"all","stylers":[{"color":"#f2f2f2"}]},
          {"featureType":"poi","elementType":"all","stylers":[{"visibility":"off"}]},
          {"featureType":"road","elementType":"all","stylers":[{"saturation":-100},{"lightness":45}]},
          {"featureType":"road.highway","elementType":"all","stylers":[{"visibility":"simplified"}]},
          {"featureType":"road.arterial","elementType":"labels.icon","stylers":[{"visibility":"off"}]},
          {"featureType":"transit","elementType":"all","stylers":[{"visibility":"off"}]},
          {"featureType":"water","elementType":"all","stylers":[{"color":'#5e72e4'},{"visibility":"on"}]}]
      }

      map = new google.maps.Map(map, mapOptions);

      const marker = new google.maps.Marker({
        position: teslaLatlng,
        icon: {
          path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
          scale: 5,
          rotation: tesla.vehicle ? tesla.vehicle.drive_state.heading : null,
          strokeColor: Charts.colors.theme.danger,
        },
        map: map,
        animation: google.maps.Animation.DROP,
        title: 'JBs Tesla'
      });

      // const contentString = '<div class="info-window-content"><h2>Argon Dashboard</h2>' +
      //   '<p>A beautiful Dashboard for Bootstrap 4. It is Free and Open Source.</p></div>';

      // const infowindow = new google.maps.InfoWindow({
      //   content: contentString
      // });

      google.maps.event.addListener(marker, 'click', function() {
        // infowindow.open(map, marker);
      });

      this.map = map
      this.marker = marker

      this.$watch(
        'tesla',
        function (newTesla, oldTesla) {
          oldTesla
          if (newTesla.vehicle) {
            this.marker.setPosition(new google.maps.LatLng(newTesla.vehicle.drive_state.latitude, newTesla.vehicle.drive_state.longitude))
            let icon = this.marker.getIcon()
            icon.rotation = newTesla.vehicle.drive_state.heading
            this.marker.setIcon(icon)
            this.map.panTo(new google.maps.LatLng(newTesla.vehicle.drive_state.latitude, newTesla.vehicle.drive_state.longitude))
          }
        },
        { deep: true }
      )
    },
  }

  export default vm
</script>
<style>
</style>

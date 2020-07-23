<template>
  <footer class="footer px-4">
    <div class="row align-items-center justify-content-lg-between">
      <div class="col-lg-6">
        <div class="copyright text-center text-lg-left text-muted">
          © {{year}} JB
        </div>
      </div>
      <div class="col-lg-6">
        <ul class="nav nav-footer justify-content-center justify-content-lg-end">
          <li class="nav-item">
            <a href="https://www.wunderground.com/dashboard/pws/ISYDNE193" class="nav-link" target="_blank">Weather Underground</a>
          </li>
          <li class="nav-item">
            <a href="https://openweathermap.org/city/2205978" class="nav-link" target="_blank">OpenWeather</a>
          </li>
          <li class="nav-item">
            <a href="https://monitoring.solaredge.com/solaredge-web/p/site/509283" class="nav-link" target="_blank">SolarEdge</a>
          </li>
          <li class="nav-item">
            <a href="https://www.tesla.com/en_AU/teslaaccount" class="nav-link" target="_blank">Tesla</a>
          </li>
        </ul>
      </div>
    </div>
  </footer>
</template>
<script>
export default {
  data() {
    return {
      year: new Date().getFullYear()
    };
  }
};
</script>
<style></style>

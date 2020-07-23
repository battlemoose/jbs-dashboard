<template>
  <div class="wrapper" :class="{ 'nav-open': $sidebar.showSidebar }">
    <side-bar
      :background-color="sidebarBackground"
      short-title="Jbs Dashboard"
      title="Jbs Dashboard"
    >
      <template slot="links">
        <sidebar-item
          :link="{
            name: 'Dashboard',
            icon: 'fa fa-desktop text-primary',
            path: '/dashboard'
          }"
        />

        <sidebar-item :link="{name: 'Tesla', icon: 'fa fa-car text-orange', path: '/tesla'}"/>
        <sidebar-item :link="{name: 'Weather', icon: 'fa fa-cloud-sun text-yellow', path: '/weather'}"/>
        <sidebar-item :link="{name: 'Power', icon: 'fa fa-bolt text-green', path: '/'}" coming-soon/>
        <sidebar-item :link="{name: 'Pool', icon: 'fa fa-swimmer text-info', path: '/'}" coming-soon/>

      </template>
    </side-bar>
    <div class="main-content" :data="sidebarBackground">
      <dashboard-navbar></dashboard-navbar>

      <div @click="toggleSidebar">
        <fade-transition :duration="200" origin="center top" mode="out-in">
          <!-- your content here -->
          <router-view></router-view>
        </fade-transition>
        <content-footer v-if="!$route.meta.hideFooter"></content-footer>
      </div>
    </div>
  </div>
</template>
<script>
  import DashboardNavbar from './DashboardNavbar.vue';
  import ContentFooter from './ContentFooter.vue';
  import { FadeTransition } from 'vue2-transitions';

  export default {
    components: {
      DashboardNavbar,
      ContentFooter,
      FadeTransition
    },
    data() {
      return {
        sidebarBackground: 'vue' //vue|blue|orange|green|red|primary
      };
    },
    methods: {
      toggleSidebar() {
        if (this.$sidebar.showSidebar) {
          this.$sidebar.displaySidebar(false);
        }
      }
    }
  };
</script>
<style lang="scss">
</style>

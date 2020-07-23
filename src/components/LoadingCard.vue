<template>
  <card>
    <div class="row">
      <div class="col">
        <div class="text-center p-3"><i class="fa fa-circle-notch fa-spin fa-3x"></i></div>
      </div>
    </div>
  </card>
</template>
<script>
  import Card from './Card.vue';

  export default {
    name: 'loading-card',
    components: {
      Card
    },
  };
</script>
<style></style>

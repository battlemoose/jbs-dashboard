<template>
  <modal :show="show"
         body-classes="p-0"
         modal-classes="modal-dialog-centered modal-sm"
         @close="close">
    <card type="secondary" shadow
          header-classes="bg-white pb-5"
          body-classes="px-lg-5 py-lg-5"
          class="border-0">
      <template>
        <div class="text-center mb-2">
          <i class="fa-2x" :class="iconClasses"></i>
        </div>
        <div class="text-center text-muted mb-4">
          <small>{{message}}</small>
        </div>
        <form role="form">
          <base-input alternative
                      class="mb-3"
                      placeholder="Email"
                      addon-left-icon="far fa-envelope"
                      v-model="email">
          </base-input>
          <base-input alternative
                      type="password"
                      placeholder="Password"
                      addon-left-icon="fa fa-key"
                      v-model="password">
          </base-input>
          <div class="text-center">
            <small class="text-danger">{{errorMessage}}</small>
          </div>
          <div class="d-flex flex-column align-items-center">
            <base-button type="primary" class="mt-4 mx-0 mb-2" @click="login" 
                         :disabled="!this.email || !this.password || loading" 
                         :icon="loading ? 'fa fa-circle-notch fa-spin': null">
              Sign In
            </base-button>
            <base-button type="link" class="" @click="close">Close</base-button>
          </div>
        </form>
      </template>
    </card>
  </modal>
</template>

<script>
export default {
  props: {
    show: Boolean,
    message: String,
    errorMessage: String,
    loginCallback: Function,
    successCallback: Function,
    cancelCallback: Function,
    iconClasses: String,
    loading: Boolean,
  },
  data() {
    return {
      email: "",
      password: ""
    }
  },
  methods: {
    async login() {
      if (this.loginCallback) {
        await this.loginCallback(this.email, this.password)
        this.successCallback()
      }
    },
    close() {
      if (this.cancelCallback) {
        this.cancelCallback()
      }
      this.$emit('close')
    }
  }
}
</script>

<style>

</style>
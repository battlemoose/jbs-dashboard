<template>
  <div id="app">
    <notifications></notifications>
    <router-view/>
    <login-modal :show="showLoginModal" 
                 message="Sign in to your Tesla account"
                 :error-message="tesla.loginError.message"
                 icon-classes="fa fa-car"
                 :login-callback="tesla.login"
                 :success-callback="loginSuccess"
                 @close="showLoginModal = false"
                 :loading="tesla.loginLoading"
    ></login-modal>
  </div>
</template>

<script>
import LoginModal from './components/LoginModal'
import tesla from './service/tesla'

export default {
  components: {
    LoginModal,
  },
  data() {
    return {
      showLoginModal: false,
      tesla
    }
  },
  methods: {
    loginSuccess() {
      this.showLoginModal = false
    }
  },
  mounted() {
    if (!this.tesla.loggedIn) {
      this.showLoginModal = true
    }
  },
}
</script>

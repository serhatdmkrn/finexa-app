<template>
  <Navbar />
  <router-view />
  <Footer />
  <ToastifyContainer /> 
</template>

<script setup>
import { onMounted } from 'vue'
import { useStore } from 'vuex'
import { ToastifyContainer } from 'vue3-toastify'

const store = useStore()

onMounted(() => {
  store.dispatch("getCurrentPrices");
  setInterval(() => {
    store.dispatch("getCurrentPrices");
  }, 60000);
})
</script>

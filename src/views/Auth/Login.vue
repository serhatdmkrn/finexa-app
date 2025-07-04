<template>
  <div class="login-container">
    <div class="login-card">
      <h2>Giriş Yap</h2>
      <p>Hoş geldiniz! Lütfen giriş yapınız.</p>

      <form @submit.prevent="loginUser">
        <input type="email" v-model.trim="email" placeholder="E-Posta" required />
        <input type="password" v-model="password" placeholder="Şifre" required />
        <button type="submit" :disabled="isLoading">
          {{ isLoading ? 'Giriş yapılıyor...' : 'Giriş Yap' }}
        </button>
      </form>

      <div class="forgot-password">
        <a href="#" @click.prevent="showForgotPassword">Şifrenizi mi unuttunuz?</a>
      </div>

      <div class="register-link">
        <a href="#" @click.prevent="goToRegister">Kayıt Ol</a>
      </div>
    </div>
  </div>

  <div class="modal-overlay" v-if="showForgotModal">
    <div class="modal">
      <button class="close-btn" @click="showForgotModal = false">&times;</button>
      <h2>Şifre Sıfırlama</h2>
      <p>Lütfen e-posta adresinizi girin. Size sıfırlama bağlantısı göndereceğiz.</p>
      <input type="email" name="forgotEmail" v-model.trim="forgotEmail" placeholder="E-posta adresiniz" required>
      <button @click="submitForgotPassword" :disabled="isLoading">{{ isLoading ? "Gönderiliyor..." : "Gönder"
        }}</button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { appAxios } from '@/utils/appAxios';
import { toastr } from '@/utils/toastr';

const store = useStore();
const email = ref('')
const password = ref('')

const isLoading = ref(false)
const showForgotModal = ref(false)
const forgotEmail = ref('')
const forgotMessage = ref('')

const router = useRouter()

function validateEmail(email) {
  const re = /\S+@\S+\.\S+/
  return re.test(email)
}

async function loginUser() {
  if (!email.value || !password.value) {
    toastr.error('Lütfen e-posta ve şifreyi girin!')
    return
  }

  if (!validateEmail(email.value)) {
    toastr.error('Geçerli bir e-posta adresi girin!')
    return
  }

  isLoading.value = true

  const response = await appAxios.post('/api/auth/login', JSON.stringify({
    email: email.value,
    password: password.value
  }));

  const data = await response.data

  if (response.status == 200) {
    toastr.success('Giriş başarılı! Yönlendiriliyorsunuz...')

    setTimeout(() => {
      router.push('/')
      store.commit("setToken", data.token);
    }, 3000)
  } else {
    toastr.error(data.message || 'Giriş başarısız!')
  }

  isLoading.value = false
}


function showForgotPassword() {
  showForgotModal.value = true
}

async function submitForgotPassword() {
  if (!validateEmail(forgotEmail.value)) {
    toastr.error('Geçerli bir e-posta adresi girin!')
    return
  }

  isLoading.value = true

  const response = await appAxios.post('/api/auth/forgot-password', JSON.stringify({
    email: forgotEmail.value
  }))

  const data = await response.data

  if (response.status == 200) {
    toastr.success('Şifre sıfırlama bağlantısı gönderildi! Anasayfaya yönlendiriliyorsunuz...')
    setTimeout(() => {
      router.push('/')
    }, 3000)
  } else {
    toastr.error(data.message || 'Bir hata oluştu!')
  }
  
  isLoading.value = false
}


function goToRegister() {
  router.push('/register')
}
</script>

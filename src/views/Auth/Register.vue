<template>
  <div class="register-container">
    <div class="register-card">
      <h2>Kayıt Ol</h2>
      <p>Aramıza hoş geldiniz!</p>

      <form @submit.prevent="registerUser">
        <input type="text" v-model.trim="firstName" placeholder="Adınız" required />
        <input type="text" v-model.trim="lastName" placeholder="Soyadınız" required />
        <input type="email" v-model.trim="email" placeholder="E-Posta" required />
        <input type="password" v-model="password" placeholder="Şifre" required />
        <input type="password" v-model="confirmPassword" placeholder="Şifre Tekrarı" required />

        <button type="submit" :disabled="isLoading">
          {{ isLoading ? '🔄 Kayıt yapılıyor...' : 'Kayıt Ol' }}
        </button>
      </form>

      <div class="terms">
        Kayıt olarak <a href="#" @click.prevent="goToKvkk">Şartlar ve Koşulları</a> kabul ediyorum.
      </div>

      <div class="login-link">
        <a href="#" @click.prevent="goToLogin">Giriş Yap</a>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { appAxios } from '@/utils/appAxios'
import { toastr } from '@/utils/toastr'

const firstName = ref('')
const lastName = ref('')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const isLoading = ref(false)

const router = useRouter()

function validateName(name) {
  const pattern = /^[a-zA-ZçÇğĞıİöÖşŞüÜ\s-]+$/
  return pattern.test(name)
}

function validateEmail(email) {
  const pattern = /^[^\s@]+@[a-zA-Z]+\.(com|net|org|edu|gov|mil|co|io|info|biz|me|us|tr)$/i
  return pattern.test(email)
}

function validateStrongPassword(password) {
  const pattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&._-])[A-Za-z\d@$!%*?&._-]{8,}$/
  return pattern.test(password)
}

async function registerUser() {
  if (!firstName.value || !lastName.value || !email.value || !password.value || !confirmPassword.value) {
    toastr.warning('Lütfen tüm alanları doldurun!')
    return
  }

  if (!validateName(firstName.value) || !validateName(lastName.value)) {
    toastr.warning('Ad ve Soyad sadece harf içermelidir!')
    return
  }

  if (!validateEmail(email.value)) {
    toastr.warning('Geçerli bir e-posta adresi girin!')
    return
  }

  if (!validateStrongPassword(password.value)) {
    toastr.warning('Şifreniz en az 8 karakter, büyük/küçük harf, rakam ve özel karakter içermelidir!')
    return
  }

  if (password.value !== confirmPassword.value) {
    toastr.warning('Şifreler eşleşmiyor!')
    return
  }

  isLoading.value = true
  const response = await appAxios.post('/api/auth/register', JSON.stringify({
    firstName: firstName.value,
    lastName: lastName.value,
    email: email.value,
    password: password.value
  }))

  const data = await response.data

  if (response.status == 200) {
    toastr.success('Kayıt başarılı! Giriş sayfasına yönlendiriliyorsunuz...')
    setTimeout(() => {
      router.push('/login')
    }, 2500)
  } else {
    toastr.error(data.message || 'Kayıt başarısız!')
  }

  isLoading.value = false
}

function goToLogin() {
  router.push('/login')
}

function goToKvkk() {
  router.push('/kvkk')
}
</script>

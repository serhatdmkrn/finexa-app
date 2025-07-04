<template>
  <div class="reset-password-container">
    <div class="reset-password-box">
      <h2>Şifre Sıfırlama</h2>
      <p>Yeni şifrenizi girin:</p>

      <form @submit.prevent="resetPassword">
        <input type="password" v-model="newPassword" placeholder="Yeni Şifre" required />
        <input type="password" v-model="confirmPassword" placeholder="Yeni Şifre (Tekrar)" required />

        <button type="submit" :disabled="isLoading">
          {{ isLoading ? 'Değiştiriliyor...' : 'Değiştir' }}
        </button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useRoute } from 'vue-router'
import { appAxios } from '@/utils/appAxios'
import { toastr } from '@/utils/toastr'

const newPassword = ref('')
const confirmPassword = ref('')
const isLoading = ref(false)
const token = ref('')

const router = useRouter()
const route = useRoute()

onMounted(() => {
  const urlParams = new URLSearchParams(window.location.search)
  token.value = route.params.token || ''

  if (!token.value) {
    toastr.error('Token bulunamadı! Bağlantınızı kontrol edin.')
    messageColor.value = 'red'
  }
})

function validateStrongPassword(password) {
  const pattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&._-])[A-Za-z\d@$!%*?&._-]{8,}$/
  return pattern.test(password)
}

async function resetPassword() {
  if (!token.value) {
    toastr.error('Token bulunamadı! Bağlantınızı kontrol edin.')
    return
  }

  if (newPassword.value !== confirmPassword.value) {
    toastr.error('Şifreler eşleşmiyor!')
    return
  }

  if (!validateStrongPassword(newPassword.value)) {
    toastr.warning('Şifreniz en az 8 karakter, büyük/küçük harf, rakam ve özel karakter içermelidir!')
    messageColor.value = 'red'
    return
  }

  isLoading.value = true

  const response = await appAxios.post('/api/Auth/reset-password', JSON.stringify({
    token: token.value,
    newPassword: newPassword.value
  }))

  const data = response?.data

  if (response?.status == 200) {
    toastr.success('Şifreniz başarıyla yenilendi! Yönlendiriliyorsunuz...')

    setTimeout(() => {
      router.push('/login')
    }, 3000)
  } else if (data) {
    toastr.error(data.message || 'Bir hata oluştu!')
  }

  isLoading.value = false
}
</script>
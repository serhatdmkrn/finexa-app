<template>
    <div class="reset-password-container">
        <div class="reset-password-box">
            <h2>Hesabım</h2>
            <p>Mevcut şifrenizi ve yeni şifrenizi girin:</p>

            <form @submit.prevent="changePassword">
                <input type="password" v-model="currentPassword" placeholder="Mevcut Şifre" :disabled="isLoading"
                    required />
                <input type="password" v-model="newPassword" placeholder="Yeni Şifre" :disabled="isLoading" required />
                <input type="password" v-model="confirmPassword" placeholder="Yeni Şifre (Tekrar)" :disabled="isLoading"
                    required />

                <button type="submit" :disabled="isLoading">
                    {{ isLoading ? 'Değiştiriliyor...' : 'Şifreyi Güncelle' }}
                </button>
            </form>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { toastr } from '@/utils/toastr'
import { appAxios } from '@/utils/appAxios';


const router = useRouter()
const currentPassword = ref('')
const newPassword = ref('')
const confirmPassword = ref('')
const isLoading = ref(false)

function validateStrongPassword(password) {
    const pattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&._-])[A-Za-z\d@$!%*?&._-]{8,}$/
    return pattern.test(password)
}

async function changePassword() {

    if (newPassword.value !== confirmPassword.value) {
        toastr.error('Yeni Şifreler eşleşmiyor!')
        return
    }

    if (!validateStrongPassword(newPassword.value)) {
        toastr.warning('Şifreniz en az 8 karakter, büyük/küçük harf, rakam ve özel karakter içermelidir!')
        return
    }

    isLoading.value = true

    const response = await appAxios.post('/api/auth/change-password', JSON.stringify({
        currentPassword: currentPassword.value,
        newPassword: newPassword.value,
    }));

    const data = await response.data

    if (response.status == 200) {
        toastr.success('Şifre değişikliği başarılı! Anasayfaya Yönlendiriliyorsunuz...')

        setTimeout(() => {
            router.push('/')
        }, 3000)
    } else {
        toastr.error(data.message || 'Şifre değişikliği başarısız!')
    }

    isLoading.value = false
}
</script>

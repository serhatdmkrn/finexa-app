<template>
  <div class="content">
    <h1>İletişim</h1>
    <p>Bizimle iletişime geçmek için aşağıdaki bilgilerden bize ulaşabilirsiniz.</p>

    <div class="contact-info">
      <p><strong>📧 E-posta:</strong> destekfinexa@gmail.com</p>
      <p><strong>🏢 </strong> Finexa Teknoloji A.Ş. İstanbul, Türkiye</p>
    </div>

    <div class="contact-form">
      <form @submit.prevent="sendMessage">
        <input type="text" v-model="name" placeholder="Adınız Soyadınız" :disabled="isSending" required />
        <input type="email" v-model="email" placeholder="E-posta Adresiniz" :disabled="isSending" required />
        <textarea v-model="message" rows="5" placeholder="Mesajınız" :disabled="isSending" required></textarea>
        <button type="submit" :disabled="isSending">
          {{ isSending ? 'Gönderiliyor...' : 'Gönder' }}
        </button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { toastr } from '@/utils/toastr'

const router = useRouter()
const name = ref('')
const email = ref('')
const isSending = ref(false)

function sendMessage() {
  isSending.value = true
  toastr.success('Mesajınız gönderildi, anasayfaya yönlendiriliyorsunuz...')

  setTimeout(() => {
    isSending.value = false
  }, 2000)

  setTimeout(() => {
    router.push('/')
  }, 3000)
}
</script>

<style scoped>
.content {
  min-height: 100vh;
  font-size: .875rem;
  max-width: 500px;
  margin: 10px auto;
  padding: 20px;
  color: var(--text-muted);
}

.content h1 {
  margin-bottom: 20px;
  font-size: 25px;
  color: #d4be5a;
}

.contact-info {
  margin-top: 20px;
}

.contact-info p {
  margin: 8px 0;
}

.contact-form {
  margin-top: 30px;
}

.contact-form input,
.contact-form textarea {
  width: 96%;
  padding: 10px;
  margin-bottom: 15px;
  border-radius: 8px;
  font-family: 'Poppins', sans-serif;
}

.contact-form button {
  background-color: #d4be5a;
  color: var(--text-light);;
  font-weight: 700;
  padding: 12px;
  border: none;
  border-radius: 50px;
  font-size: 14px;
  font-weight: bold;
  cursor: pointer;
}

.contact-form button:hover {
  background-color: #c1ab4f;
}

.contact-form button:disabled {
  background-color: #aaa;
  cursor: not-allowed;
}

@keyframes fadeInOut {
  0% {
    opacity: 0;
    transform: translateY(-10px);
  }

  10% {
    opacity: 1;
    transform: translateY(0);
  }

  90% {
    opacity: 1;
  }

  100% {
    opacity: 0;
    transform: translateY(-10px);
  }
}
</style>

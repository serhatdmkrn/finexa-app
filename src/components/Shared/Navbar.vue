<template>
    <div class="navbar">
        <div class="navbar-left">
            <router-link :to="'/'" class="menu-link active open">
                <img src="../../assets/img/finexa.png" alt="Logo" class="logo" />
            </router-link>
        </div>

        <div class="navbar-center" id="navbarCenter">
            <router-link :to="'/'" :class="route.name == 'HOMEPAGE' ? 'active' : ''">
                Anasayfa
            </router-link>

            <router-link :to="'/about-us'" :class="route.name == 'ABOUTUS' ? 'active' : ''">
                Hakkımızda
            </router-link>

            <router-link :to="'/kvkk'" :class="route.name == 'KVKK' ? 'active' : ''">
                Kvkk ve Kullanım Şartları
            </router-link>

            <router-link :to="'/contact'" :class="route.name == 'CONTACT' ? 'active' : ''">
                İletişim
            </router-link>
        </div>

        <div class="navbar-right">
            <div v-if="store.getters._isAuthenticated">
                <img src="../../assets/img/wallet.png" id="walletIcon" class="icon" alt="Cüzdan"
                    @click="toggleWallet" />
                <div class="wallet-popup" :class="isWalletHidden ? 'hidden' : ''">
                    <div class="wallet-header">
                        <h4>Cüzdan</h4>
                        <button @click="isWalletHidden = true">✖</button>
                    </div>

                    <div class="wallet-balance">₺{{ totalValue.toLocaleString('tr-TR', { maximumFractionDigits: 2 }) }}
                    </div>
                    <div class="wallet-change" v-html="differenceHTML"></div>

                    <div class="wallet-summary">
                        <div class="wallet-assets" v-if="walletItems && walletItems.length > 0">
                            <div v-for="item in walletItems" :key="item.id" class="wallet-card">
                                <img :src="getIconUrl(item.type)" :alt="item.type" @error="handleImageError" />
                                <div class="wallet-info">
                                    <div class="line">
                                        <span class="type">{{ item.type.toUpperCase() }}</span>
                                        <span class="total">₺{{ getTotalValue(item).toLocaleString('tr-TR', {
                                            maximumFractionDigits: 2
                                        }) }}</span>
                                    </div>
                                    <div class="line">
                                        <span class="price">
                                            Fiyat: ₺{{ getCurrentPrice(item.type).toLocaleString('tr-TR', {
                                                minimumFractionDigits: 2,
                                                maximumFractionDigits: isCyrpto(item.type) ? 6 : 2
                                            }) }}
                                        </span>
                                        <span class="amount">
                                            {{ item.quantity.toLocaleString('tr-TR', {
                                                minimumFractionDigits: 2,
                                            maximumFractionDigits: isCyrpto(item.type) ? 6 : 2
                                            }) }} adet
                                        </span>
                                    </div>
                                    <div class="line">
                                        <span class="cost">
                                            Alış: ₺{{ (item.purchasePrice || 0).toLocaleString('tr-TR', {
                                                minimumFractionDigits: 2,
                                                maximumFractionDigits: isCyrpto(item.type) ? 6 : 2
                                            }) }}
                                        </span>
                                        <span class="profit" :style="{ color: getProfit(item) >= 0 ? 'green' : 'red' }">
                                            {{ getProfit(item) >= 0 ? '+' : '-' }} ₺{{
                                                Math.abs(getProfit(item)).toFixed(2) }}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="dropdown">
                <img src="../../assets/img/kullanıcı.png" class="icon" />
                <div class="dropdown-content">

                    <router-link :to="'/login'" v-if="!store.getters._isAuthenticated">
                        <span class="material-icons">login</span> Giriş Yap
                    </router-link>

                    <router-link :to="'/register'" v-if="!store.getters._isAuthenticated">
                        <span class="material-icons">person_add</span> Kayıt Ol
                    </router-link>

                    <router-link :to="'/account'" v-if="store.getters._isAuthenticated">
                        <span class="material-icons">account_circle</span> Hesabım
                    </router-link>

                    <a href="javascript:void(0);" v-if="store.getters._isAuthenticated" @click="onLogout">
                        <span class="material-icons">logout</span> Çıkış Yap
                    </a>
                </div>
            </div>
            <div class="navbar-toggle" @click="toggleNavbar()">☰</div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useRoute } from 'vue-router'
import { useStore } from 'vuex'
import { appAxios } from '@/utils/appAxios';
import { toastr } from '@/utils/toastr';

const router = useRouter()
const route = useRoute()
const store = useStore()

const prices = computed(() => ({
    financePrices: store.getters.financePrices || {},
    cryptoPrices: store.getters.cryptoPrices || [],
    financePriceKvp: store.getters.financePriceKvp || {},
    cryptoPriceKvp: store.getters.cryptoPriceKvp || {}
}))

const isWalletHidden = ref(true)
const walletItems = computed(() => store.getters.walletItems)

function toggleNavbar() {
    const navbars = document.querySelectorAll('.navbar:not([style*="display: none;"]) .navbar-center')
    const toggle = document.querySelector('.navbar-toggle')

    navbars.forEach(nav => {
        nav.classList.toggle('open')
    })

    if (toggle) {
        toggle.classList.toggle('open')
    }
}

function onLogout() {
    store.commit('logoutUser')
    router.push({ path: '/login' })
}

function toggleWallet() {
    isWalletHidden.value = !isWalletHidden.value
}

function getIconUrl(type) {

    const key = type.toLowerCase();

    const coin = prices.value.cryptoPrices.find(x => x.symbol.toLowerCase() === key);

    if (coin && coin.image) {
        return coin.image;
    }
    return `src/assets/img/${key}.png`;
}

function handleImageError(event) {
    event.target.src = '.src/assets/img/para.png'
}
function getCurrentPrice(type) {
    if (!type) return;

    const key = type.toUpperCase();

    const cryptoPrice = prices.value.cryptoPriceKvp[key];
    if (cryptoPrice) {
        const usdPrice = prices.value.financePriceKvp["USD"];
        return Number(cryptoPrice) * Number(usdPrice) || 0;
    }

    const financePrice = prices.value.financePriceKvp[key];
    if (financePrice) {
        return Number(financePrice) || 0;
    }

    return 0;
}

function getTotalValue(item) {
    const currentPrice = getCurrentPrice(item.type)
    return currentPrice * item.quantity
}

function getProfit(item) {
    const totalValue = getTotalValue(item)
    const maliyet = (item.purchasePrice || 0) * item.quantity
    return totalValue - maliyet
}

const totalValue = computed(() => {
    return walletItems.value.reduce((sum, item) => {
        return sum + getTotalValue(item)
    }, 0)
})

const totalDifference = computed(() => {
    return walletItems.value.reduce((sum, item) => {
        return sum + getProfit(item)
    }, 0)
})

function isCyrpto(key) {
    return prices.value.cryptoPriceKvp[key]
}

const differenceHTML = computed(() => {
    const differencePercentage = totalValue.value !== 0
        ? (totalDifference.value / (totalValue.value - totalDifference.value)) * 100
        : 0
    const sign = totalDifference.value >= 0 ? '+' : '-'
    const renk = totalDifference.value >= 0 ? '#22c55e' : 'red'


    return `<span style="color: ${renk}">${sign} ₺${Math.abs(totalDifference.value).toFixed(2)} (${Math.abs(differencePercentage).toFixed(2)}%)</span>`
})
</script>
<template>
    <div class="market-table">
        <div v-if="showDeleteModal" class="confirm-modal" @click.self="closeDeleteModal">
            <div class="confirm-modal-content">
                <p>Bu varlığı silmek istediğinize emin misiniz?</p>
                <div class="confirm-modal-buttons">
                    <button class="btn-yes" @click="confirmDelete">Evet, Sil</button>
                    <button class="btn-cancel" @click="closeDeleteModal">İptal</button>
                </div>
            </div>
        </div>

        <div v-if="showUpdateModal" class="confirm-modal" @click.self="closeUpdateModal">
            <div class="confirm-modal-content">
                <h3>Varlık Güncelle</h3>
                <form @submit.prevent="confirmUpdate">
                    <label>Yeni Alış Fiyatı:</label>
                    <input type="number" v-model="updateWalletObj.purchasePrice" step="0.000001" required />

                    <label>Yeni Miktar:</label>
                    <input type="number" v-model="updateWalletObj.quantity" step="0.000001" required />

                    <div class="confirm-modal-buttons">
                        <button type="submit" class="btn-yes">{{ isLoading ? "Güncelleniyor..." : "Güncelle" }}</button>
                        <button type="button" class="btn-cancel" @click="closeUpdateModal">İptal</button>
                    </div>
                </form>
            </div>
        </div>

        <div class="content tab-content">
            <h2>
                Varlıklarım
                <a href="#" class="edit-assets-link" @click.prevent="openAddModal">Varlık Ekle 🖊</a>
            </h2>

            <div class="varlik-card-list" id="varliklar-card-body">
                <div v-for="v in walletItems" :key="v.id" class="varlik-card">
                    <div class="card-header">
                        <img :src="getIconUrl(v.type)" :alt="v.type" @error="onImageError" />
                        <span class="varlik-turu">
                            {{ v.quantity.toLocaleString("tr-TR", {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: isCyrpto(v.type.toUpperCase()) ? 6 : 2,
                            }) }}
                            {{ v.type.toUpperCase() }}
                            {{
                                (parseFloat(getCurrentPrice(v.type)) * v.quantity).toLocaleString("tr-TR", {
                                    maximumFractionDigits: 2,
                                    minimumFractionDigits: 2,
                            })
                            }}
                            ₺
                        </span>
                    </div>

                    <div class="card-info">
                        <p>
                            <strong>Miktar:</strong>
                            {{ v.quantity.toLocaleString("tr-TR", {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: isCyrpto(v.type.toUpperCase()) ? 6 : 2,
                            }) }}
                        </p>
                        <p>
                            <strong>Alış Fiyatı:</strong>
                            {{ v.purchasePrice.toLocaleString("tr-TR", {
                                maximumFractionDigits: isCyrpto(v.type.toUpperCase()) ? 6 : 2,
                                minimumFractionDigits: 2,
                            }) }}
                            ₺
                        </p>
                        <p>
                            <strong>Güncel Fiyat:</strong>
                            {{ getCurrentPrice(v.type).toLocaleString("tr-TR", {
                                maximumFractionDigits: isCyrpto(v.type.toUpperCase()) ? 6 : 2,
                                minimumFractionDigits: 2,
                            }) }}
                            ₺
                        </p>
                        <p>
                            <strong>Kazanç:</strong>
                            <span :class="isProfit(v) ? 'kar' : 'zarar'">
                                {{
                                    getProfit(v).toLocaleString("tr-TR", {
                                        style: "currency",
                                        currency: "TRY",
                                        maximumFractionDigits: 2,
                                minimumFractionDigits: 2,
                                })
                                }}
                                ({{ getProfitPercent(v) }}%)
                            </span>
                        </p>
                        <p><strong>İşlem Tarihi:</strong> {{ new Date(v.date).toLocaleString() }}</p>
                    </div>

                    <div class="card-actions">
                        <button class="update" @click="openUpdateModal(v)">Güncelle</button>
                        <button class="delete" @click="openDeleteModal(v.id)">Sil</button>
                    </div>
                </div>
            </div>
        </div>

        <div v-if="showAddModal" class="confirm-modal" @click.self="closeAddModal">
            <div class="confirm-modal-content">
                <h3>Yeni Varlık Ekle</h3>
                <form @submit.prevent="addWalletItem">
                    <label>Varlık Türü:</label>
                    <ModelListSelect :list="goldAndFinanceNamingArr" v-model="createWalletObj.type" option-value="value"
                        option-text="label" class="form-control search-select-fluid" />
                    <label>Miktar:</label>
                    <input type="number" v-model="createWalletObj.quantity" step="0.000001" required />
                    <label>Alış Fiyatı:</label>
                    <input type="number" v-model="createWalletObj.purchasePrice" step="0.000001" required />
                    <div class="confirm-modal-buttons" style="margin-top: 10px;">
                        <button type="submit" class="btn-yes" :disabled="isLoading">{{ isLoading ? "Varlık Ekleniyor..." : "Varlık Ekle"
                            }}</button>
                        <button type="button" class="btn-cancel" @click="closeAddModal">İptal</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>


<script setup>
import { onMounted, onUnmounted, watch, ref, computed } from 'vue'
import { defineProps } from 'vue'
import { useStore } from 'vuex'
import { appAxios } from '@/utils/appAxios';
import { toastr } from '@/utils/toastr';

const props = defineProps({
    goldAndFinanceNamingArr: {
        type: Array,
        required: true
    }
})

let updateWalletObj = ref({})
let createWalletObj = ref({})
let currentTab = ref('tab-1');
let isLoading = ref(false)
let walletItems = ref([])
const store = useStore()

let showDeleteModal = ref(false)
let selectedItemId = ref(null)

let showUpdateModal = ref(false)
let showAddModal = ref(false)

const prices = computed(() => ({
    financePrices: store.getters.financePrices || {},
    cryptoPrices: store.getters.cryptoPrices || [],
    financePriceKvp: store.getters.financePriceKvp || {},
    cryptoPriceKvp: store.getters.cryptoPriceKvp || {},
}))

async function getWalletItems() {
    try {
        const response = await appAxios.get('/api/wallet');
        const data = response.data

        if (response.status == 200) {
            walletItems.value = data;
            store.commit("setWalletItems", walletItems.value);
        } else {
            toastr.error(data.message || 'Bir hata oluştu!')
        }
    } catch (error) {
        toastr.error(error.response?.data?.message || 'Bir hata oluştu!')
    } finally {
        isLoading.value = false
    }
}

function getIconUrl(type) {
    const key = type.toLowerCase();

    const coin = prices.value.cryptoPrices.find(x => x.symbol.toLowerCase() === key);

    if (coin && coin.image) {
        return coin.image;
    }

    const basePath = process.env.NODE_ENV === "production" ? "finexa-app/" : ""
    return `${basePath}src/assets/img/${key}.png`;
}

function onImageError(event) {
    event.target.onerror = null;
    const basePath = process.env.NODE_ENV === "production" ? "finexa-app/" : ""
    event.target.src = `${basePath}src/assets/img/para.png`;;
}

function getCurrentPrice(type) {
    if (!type) return 0;

    const key = type.toUpperCase();

    const cryptoPrice = prices.value.cryptoPriceKvp[key];
    if (cryptoPrice) {
        const usdPrice = prices.value.financePriceKvp["USD"] || 1;
        return Number(cryptoPrice) * Number(usdPrice) || 0;
    }

    const financePrice = prices.value.financePriceKvp[key];
    if (financePrice) {
        return Number(financePrice) || 0;
    }

    return 0;
}

function getProfit(v) {
    const totalPurchase = v.purchasePrice * v.quantity;
    const totalCurrent = getCurrentPrice(v.type) * v.quantity;
    return totalCurrent - totalPurchase;
}

function isCyrpto(key) {
    return prices.value.cryptoPriceKvp[key]
}

function isProfit(v) {
    return getProfit(v) >= 0;
}

function getProfitPercent(v) {
    const totalPurchase = v.purchasePrice * v.quantity;
    const difference = getProfit(v);
    return totalPurchase
        ? ((difference / totalPurchase) * 100).toFixed(2)
        : '0.00';
}

async function addWalletItem() {
    isLoading.value = true
    try {
        const response = await appAxios.post('/api/wallet', createWalletObj.value);
        const data = response.data

        if (response.status == 200) {
            walletItems.value.push(data)
            store.commit("setWalletItems", walletItems.value);
            toastr.success("Varlık eklendi!")
            showAddModal.value = false;  // modalı kapatıyoruz
            createWalletObj.value = {}
            currentTab.value = "tab-1"
        } else {
            toastr.error(data.message || 'Bir hata oluştu!')
        }
    } catch (error) {
        toastr.error(error.response?.data?.message || 'Bir hata oluştu!')
    } finally {
        isLoading.value = false
    }
}

function openAddModal() {
    createWalletObj.value = {}
    showAddModal.value = true
}

function closeAddModal() {
    createWalletObj.value = {}
    showAddModal.value = false
}

function openUpdateModal(item) {
    updateWalletObj.value = {
        id: item.id,
        purchasePrice: item.purchasePrice,
        quantity: item.quantity
    }
    showUpdateModal.value = true;
}

function closeUpdateModal() {
    updateWalletObj.value = {}
    showUpdateModal.value = false;
}

async function confirmUpdate() {
    if (!updateWalletObj.value.id) return;
    await updateWalletItem();
    closeUpdateModal();
}

async function updateWalletItem() {
    isLoading.value = true;

    try {
        const id = updateWalletObj.value.id;

        const response = await appAxios.put(`/api/wallet/${id}`, updateWalletObj.value);
        const data = response.data;

        if (response.status === 200) {
            const index = walletItems.value.findIndex(item => item.id === id);
            if (index !== -1) {
                walletItems.value[index] = data;
            }
            store.commit("setWalletItems", walletItems.value);
            toastr.success('Varlık güncellendi!');
            currentTab.value = 'tab-1';
            updateWalletObj.value = {};
        } else {
            toastr.error(data.message || 'Bir hata oluştu!');
        }
    } catch (error) {
        toastr.error(error.response?.data?.message || 'Bir hata oluştu!');
    } finally {
        isLoading.value = false;
    }
}

function openDeleteModal(id) {
    selectedItemId.value = id;
    showDeleteModal.value = true;
}

function closeDeleteModal() {
    selectedItemId.value = null;
    showDeleteModal.value = false;
}

async function confirmDelete() {
    if (selectedItemId.value !== null) {
        await deleteWalletItem(selectedItemId.value);
    }
    closeDeleteModal();
}

async function deleteWalletItem(id) {
    isLoading.value = true;

    try {
        const response = await appAxios.delete(`/api/wallet/${id}`);
        const data = response.data;

        if (response.status === 200) {
            walletItems.value = walletItems.value.filter(item => item.id !== id);
            store.commit("setWalletItems", walletItems.value);
            toastr.success('Varlık silindi!');
            currentTab.value = 'tab-1';
            createWalletObj.value = {};
        } else {
            toastr.error(data.message || 'Bir hata oluştu!');
        }
    } catch (error) {
        toastr.error(error.response?.data?.message || 'Bir hata oluştu!');
    } finally {
        isLoading.value = false;
    }
}

onMounted(() => {
    getWalletItems();
    document.addEventListener('keydown', handleKeyDown);
});

onUnmounted(() => {
    document.removeEventListener('keydown', handleKeyDown);
});

function handleKeyDown(e) {
    if (e.key === 'Escape') {
        if (showDeleteModal.value) closeDeleteModal();
        if (showUpdateModal.value) closeUpdateModal();
        if (showAddModal.value) closeAddModal();
    }
}

watch(() => createWalletObj.value.type, (newType) => {
    if (newType) {
        createWalletObj.value.purchasePrice = getCurrentPrice(newType).toFixed(6);
    }
});
</script>
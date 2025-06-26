import SecureLS from "secure-ls";
import { createStore } from "vuex";
import createPersistedState from "vuex-persistedstate";
import { appAxios } from "@/utils/appAxios"; // Yolunu kendi projenize göre düzelt
import { toastr } from "@/utils/toastr";

var ls = new SecureLS({ isCompression: false });

export const store = createStore({
  state: {
    token: null,
    loginUser: null,
    financePrices: {},
    cryptoPrices: {},
    financePriceKvp: {},
    cryptoPriceKvp: {},
    walletItems: []
  },
  mutations: {
    setToken(state, token) {
      state.token = token;
    },
    setLoginUser(state, loginUser) {
      state.loginUser = loginUser;
    },
    logoutUser(state) {
      state.token = null;
      state.loginUser = null;
    },
    setFinancePrices(state, prices) {
      state.financePrices = prices;
    },
    setCryptoPrices(state, prices) {
      state.cryptoPrices = prices;
    },
    setFinancePriceKvp(state, priceKvp) {
      state.financePriceKvp = priceKvp;
    },
    setCryptoPriceKvp(state, priceKvp) {
      state.cryptoPriceKvp = priceKvp;
    },
    setWalletItems(state, walletItems) {
      state.walletItems = walletItems;
    }
  },
  getters: {
    _isAuthenticated: (state) => state.token !== null,
    _token: (state) => state.token,
    financePrices: (state) => state.financePrices,
    cryptoPrices: (state) => state.cryptoPrices,
    financePriceKvp: (state) => state.financePriceKvp,
    cryptoPriceKvp: (state) => state.cryptoPriceKvp,
    walletItems: (state) => state.walletItems,
  },
  actions: {
    async getCurrentPrices({ commit }) {
      try {
        const finansResponse = await appAxios.get('/api/finance/getall');
        if (finansResponse.status !== 200) {
          toastr.error('Finans verisi alınamadı');
          return;
        }
        const finansPriceKvp = {};
        const finansData = finansResponse.data;
        for (const key in finansData) {
          const item = finansData[key];
          if (item && item.Satış) {
            const price = parseFloat(item.Satış.toString().replace(/\./g, '').replace(',', '.'));
            finansPriceKvp[key.toUpperCase()] = isNaN(price) ? null : price;
          }
        }
        commit('setFinancePrices', finansData);
        commit('setFinancePriceKvp', finansPriceKvp);

        const cryptoResponse = await appAxios.get('/api/crypto/top1000');
        if (cryptoResponse.status !== 200) {
          toastr.error('Kripto verisi alınamadı');
          return;
        }
        const cryptoPriceKvp = {};
        const cryptoData = cryptoResponse.data;
        cryptoData.forEach(coin => {
          cryptoPriceKvp[coin.symbol.toUpperCase()] = coin.current_price;
        });
        commit('setCryptoPrices', cryptoData);
        commit('setCryptoPriceKvp', cryptoPriceKvp);

      } catch (err) {
        toastr.error('GetCurrentPrice hatası:', err);
      }
    }
  },
  plugins: [
    createPersistedState({
      storage: {
        getItem: (key) => ls.get(key),
        setItem: (key, value) => ls.set(key, value),
        removeItem: (key) => ls.remove(key),
      },
    }),
  ],
});

export default store;
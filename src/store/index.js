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
    stockPrices: [],
    financePriceKvp: {},
    cryptoPriceKvp: {},
    stockPriceKvp: {},
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
    setStockPrices(state, prices) {
      state.stockPrices = prices;
    },
    setFinancePriceKvp(state, priceKvp) {
      state.financePriceKvp = priceKvp;
    },
    setCryptoPriceKvp(state, priceKvp) {
      state.cryptoPriceKvp = priceKvp;
    },
    setStockPriceKvp(state, priceKvp) {
      state.stockPriceKvp = priceKvp;
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
    stockPrices: (state) => state.stockPrices,
    financePriceKvp: (state) => state.financePriceKvp,
    cryptoPriceKvp: (state) => state.cryptoPriceKvp,
    stockPriceKvp: (state) => state.stockPriceKvp,
    walletItems: (state) => state.walletItems,
  },
  actions: {
async getCurrentPrices({ commit }) {
  try {
    const [finansResponse, cryptoResponse, stockResponse] = await Promise.all([
      appAxios.get('/api/finance/getall'),
      appAxios.get('/api/crypto/top1000'),
      appAxios.get('/api/stock/all'),
    ]);

    // Finans verisi
    if (finansResponse.status === 200) {
      const finansData = finansResponse.data;
      const finansPriceKvp = {};
      for (const key in finansData) {
        const item = finansData[key];
        if (item && item.Satış) {
          const price = parseFloat(item.Satış.toString().replace(/\./g, '').replace(',', '.'));
          finansPriceKvp[key.toUpperCase()] = isNaN(price) ? null : price;
        }
      }
      commit('setFinancePrices', finansData);
      commit('setFinancePriceKvp', finansPriceKvp);
    } else {
      toastr.error('Finans verisi alınamadı');
    }

    // Kripto verisi
    if (cryptoResponse.status === 200) {
      const cryptoData = cryptoResponse.data.filter(x => x.symbol != 'meta');
      const cryptoPriceKvp = {};
      cryptoData.forEach(coin => {
        cryptoPriceKvp[coin.symbol.toUpperCase()] = coin.current_price;
      });
      commit('setCryptoPrices', cryptoData);
      commit('setCryptoPriceKvp', cryptoPriceKvp);
    } else {
      toastr.error('Kripto verisi alınamadı');
    }

    // Hisse verisi
    if (stockResponse.status === 200) {
      const stockData = stockResponse.data;
      const stockPriceKvp = {};
      stockData.forEach(stock => {
        stockPriceKvp[stock.symbol.toUpperCase()] = stock.currentPrice;
      });
      commit('setStockPrices', stockData);
      commit('setStockPriceKvp', stockPriceKvp);
    } else {
      toastr.error('Hisse verisi alınamadı');
    }

  } catch (err) {
    console.error('GetCurrentPrices hatası:', err);
    toastr.error('Veriler alınırken bir hata oluştu.');
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
<template>
    <div class="main-content">
        <div class="tab-container">
            <div class="market-table">
                <div class="tabs" data-group="tab-1">
                    <button class="tab active" @click="showTab('altin-listesi', $event, 'tab-1')">
                        S.Piyasa Ziynet
                    </button>
                    <button class="tab" @click="showTab('doviz-listesi', $event, 'tab-1')">
                        S.Piyasa Döviz
                    </button>
                </div>


                <div id="altin-listesi" class="data-list" data-group="tab-1">
                    <input v-model="searchObj.goldTerm" type="text" placeholder="Ziynet ara..." class="search-box" />
                    <div class="market-row header">
                        <div>Ziynet</div>
                        <div>Alış</div>
                        <div>Satış</div>
                        <div>Değişim</div>
                    </div>
                    <div class="market-items">
                        <div v-for="(goldPrice, key) in goldPricesFiltered" :key="key" v-if="goldPrices"
                            class="market-row">
                            <div>{{goldAndFinanceNamingArr.find(x => x.value === key.toUpperCase()).label}}</div>
                            <div>{{ goldPrice.Alış }} ₺</div>
                            <div>{{ goldPrice.Satış }} ₺</div>
                            <div :style="{ color: goldPrice.Değişim.includes('-') ? 'red' : 'green' }">
                                {{ goldPrice.Değişim }}
                            </div>
                        </div>
                    </div>
                </div>

                <div id="doviz-listesi" class="data-list" data-group="tab-1" style="display: none;">
                    <input v-model="searchObj.financeTerm" type="text" placeholder="Döviz ara..." class="search-box" />
                    <div class="market-row header">
                        <div>Döviz</div>
                        <div>Alış</div>
                        <div>Satış</div>
                        <div>Değişim</div>
                    </div>
                    <div class="market-items">
                        <div v-for="(financePrice, key) in financePricesFiltered" :key="key" v-if="financePrices"
                            class="market-row">
                            <div>{{goldAndFinanceNamingArr.find(x => x.value === key.toUpperCase()).label}}</div>
                            <div>{{ financePrice.Alış }} ₺</div>
                            <div>{{ financePrice.Satış }} ₺</div>
                            <div :style="{ color: financePrice.Değişim.includes('-') ? 'red' : 'green' }">
                                {{ financePrice.Değişim }}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="market-table">
                <div class="tabs" data-group="tab-2">
                    <button class="tab active" @click="showTab('crypto-listesi', $event, 'tab-2')">Crypto</button>
                    <button class="tab" @click="showTab('S&P500-listesi', $event, 'tab-2')">S&P 500</button>
                </div>


                <div id="crypto-listesi" class="data-list" data-group="tab-2">
                    <input v-model="searchObj.cryptoTerm" type="text" placeholder="Kripto ara..." class="search-box" />
                    <div class="market-row header">
                        <div>Kripto (TOP 1000)</div>
                        <div>Fiyat</div>
                        <div>Piyasa Değeri</div>
                        <div>Değişim</div>
                    </div>
                    <div class="market-items">
                        <div v-for="coin in cryptoPricesFiltered" :key="coin.id" class="market-row">
                            <div>
                                <img :src="coin.image" :alt="coin.name" width="30" />
                                {{ coin.name }} ({{ coin.symbol.toUpperCase() }})
                            </div>
                            <div>{{ coin.current_price }} $</div>
                            <div>{{ formatMarketCap(coin.market_cap) }} $</div>
                            <div
                                :style="{ color: coin.price_change_percentage_24h >= 0 ? 'green' : 'red', textAlign: 'center' }">
                                {{ parseFloat(coin.price_change_percentage_24h).toFixed(2) }}%
                            </div>
                        </div>
                    </div>
                </div>

                <div id="S&P500-listesi" class="data-list" data-group="tab-2" style="display: none;">
                    <input v-model="searchObj.sp500Term" type="text" placeholder="Hisse ara..." class="search-box" />
                    <div class="market-row header">
                        <div>Hisse</div>
                        <div>Fiyat</div>
                        <div>Önceki Kapanış</div>
                        <div>Değişim</div>
                    </div>
                    <div class="market-items">
                        <div v-for="stock in sp500Filtered" :key="stock.name" class="market-row">
                            <div>{{ stock.name }} ({{ stock.symbol }})</div>
                            <div>{{ stock.currentPrice.toFixed(2) }} $</div>
                            <div>{{ stock.previousClose.toFixed(2) }} $</div>
                            <div
                                :style="{ color: ((stock.currentPrice - stock.previousClose) >= 0) ? 'green' : 'red' }">
                                {{ ((stock.currentPrice - stock.previousClose) / stock.previousClose * 100).toFixed(2)
                                }}%
                            </div>
                        </div>
                    </div>
                </div>

            </div>

            <div class="calculator-box">
                <h4>Hesaplama Aracı</h4>
                <small>-- Döviz & Ziynet & Crypto & S&P 500 --</small>

                <label>Ürün Seçimi:</label>

                <ModelListSelect :list="goldAndFinanceNamingArr" v-model="calculateObj.sourceType" option-value="value"
                    option-text="label" @update:modelValue="calculate" class="form-control search-select-fluid" />
                <label>Para Birimi:</label>

                <ModelListSelect :list="calculateSymbolMapsArray" v-model="calculateObj.targetType" option-value="value"
                    option-text="label" @update:modelValue="calculate" class="form-control search-select-fluid" />

                <label>Miktar:</label>
                <input v-model="calculateObj.quantity" type="number" @input="calculate" />

                <div class="calc-result">
                    <div>
                        <p>Alış</p>
                        <strong>{{ calculateObj.purchasePrice.toFixed(4) }} {{
                            calculateSymbolMaps[calculateObj.targetType]
                        }}</strong>
                    </div>
                    <div>
                        <p>Satış</p>
                        <strong>{{ calculateObj.salesPrice.toFixed(4) }} {{ calculateSymbolMaps[calculateObj.targetType]
                            }}</strong>
                    </div>
                </div>
            </div>

            <p style="text-align: center; font-size: 12px; color: gray; margin: 2px 0;">
                Finexa.com © Tüm kurlar bilgi amaçlıdır ve her finans verisi dakikada bir güncellenmektedir.
            </p>
        </div>

        <div id="tv_chart"></div>

        <WalletItems v-if="store.getters._isAuthenticated" :gold-and-finance-naming-arr="goldAndFinanceNamingArr" />
    </div>

</template>

<script setup>
import { onMounted, onBeforeUnmount, ref, computed } from 'vue'
import { useStore } from 'vuex'
import WalletItems from '@/components/WalletItems.vue'
import { showTab } from '@/utils/helpers';

let widget = null
const store = useStore()

const calculateSymbolMaps = {
    "TRY": "₺",
    "USD": "$",
    "EUR": "€",
    "GBP": "£"
}

let calculateObj = ref({
    sourceType: "USD",
    targetType: "TRY",
    quantity: 1,
    purchasePrice: 0,
    salesPrice: 0
})

let searchObj = ref({
    goldTerm: "",
    financeTerm: "",
    cryptoTerm: "",
    sp500Term: ""
})

const goldKeys = ["gram-altin", "gram-has-altin", "ceyrek-altin", "yarim-altin", "tam-altin", "cumhuriyet-altini", "ata-altin", "resat-altin", "14-ayar-altin", "18-ayar-altin", "22-ayar-bilezik", "gumus", "gram-platin", "gram-paladyum"];
const financeKeys = ["USD", "EUR", "GBP", "CHF", "CAD", "RUB", "AED", "AUD", "DKK", "SEK", "NOK", "JPY", "KWD", "ZAR", "BHD", "LYD", "SAR", "IQD", "ILS", "IRR", "INR", "MXN", "HUF", "NZD", "BRL", "IDR", "CZK", "PLN", "RON", "CNY", "ARS", "ALL", "AZN", "BAM", "CLP", "COP", "CRC", "DZD", "EGP", "HKD", "ISK", "JOD", "KRW", "KZT", "LBP", "LKR", "MAD", "MDL", "MKD", "MYR", "OMR", "PEN", "PHP", "PKR", "QAR", "RSD", "SGD", "SYP", "THB", "TWD", "UAH", "UYU", "GEL", "TND", "BGN"];

// İsim eşleşmeleri
const goldAndFinanceNamingArr = [
    { value: "GRAM-ALTIN", label: "Gram Altın" },
    { value: "GRAM-HAS-ALTIN", label: "Gram Has Altın" },
    { value: "CEYREK-ALTIN", label: "Çeyrek Altın" },
    { value: "YARIM-ALTIN", label: "Yarım Altın" },
    { value: "TAM-ALTIN", label: "Tam Altın" },
    { value: "CUMHURIYET-ALTINI", label: "Cumhuriyet Altını" },
    { value: "ATA-ALTIN", label: "Ata Altın" },
    { value: "RESAT-ALTIN", label: "Reşat Altın" },
    { value: "14-AYAR-ALTIN", label: "14 Ayar Altın" },
    { value: "18-AYAR-ALTIN", label: "18 Ayar Altın" },
    { value: "22-AYAR-BILEZIK", label: "22 Ayar Bilezik" },
    { value: "GUMUS", label: "Gümüş" },
    { value: "GRAM-PLATIN", label: "Platinum (GPL)" },
    { value: "GRAM-PALADYUM", label: "Paladyum (PAL)" },
    { value: "USD", label: "Amerikan Doları (USD)" },
    { value: "EUR", label: "Euro (EUR)" },
    { value: "GBP", label: "İngiliz Sterlini (GBP)" },
    { value: "CHF", label: "İsviçre Frangı (CHF)" },
    { value: "CAD", label: "Kanada Doları (CAD)" },
    { value: "RUB", label: "Rus Rublesi (RUB)" },
    { value: "AED", label: "BAE Dirhemi (AED)" },
    { value: "AUD", label: "Avustralya Doları (AUD)" },
    { value: "DKK", label: "Danimarka Kronu (DKK)" },
    { value: "SEK", label: "İsveç Kronu (SEK)" },
    { value: "NOK", label: "Norveç Kronu (NOK)" },
    { value: "JPY", label: "Japon Yeni (JPY)" },
    { value: "KWD", label: "Kuveyt Dinarı (KWD)" },
    { value: "ZAR", label: "Güney Afrika Randı (ZAR)" },
    { value: "BHD", label: "Bahreyn Dinarı (BHD)" },
    { value: "LYD", label: "Libya Dinarı (LYD)" },
    { value: "SAR", label: "Suudi Arabistan Riyali (SAR)" },
    { value: "IQD", label: "Irak Dinarı (IQD)" },
    { value: "ILS", label: "İsrail Şekeli (ILS)" },
    { value: "IRR", label: "İran Riyali (IRR)" },
    { value: "INR", label: "Hindistan Rupisi (INR)" },
    { value: "MXN", label: "Meksika Pesosu (MXN)" },
    { value: "HUF", label: "Macar Forinti (HUF)" },
    { value: "NZD", label: "Yeni Zelanda Doları (NZD)" },
    { value: "BRL", label: "Brezilya Reali (BRL)" },
    { value: "IDR", label: "Endonezya Rupisi (IDR)" },
    { value: "CZK", label: "Çek Korunası (CZK)" },
    { value: "PLN", label: "Polonya Zlotisi (PLN)" },
    { value: "RON", label: "Romen Leyi (RON)" },
    { value: "CNY", label: "Çin Yuanı (CNY)" },
    { value: "ARS", label: "Arjantin Pesosu (ARS)" },
    { value: "ALL", label: "Arnavutluk Leki (ALL)" },
    { value: "AZN", label: "Azerbaycan Manatı (AZN)" },
    { value: "BAM", label: "Bosna-Hersek Markı (BAM)" },
    { value: "CLP", label: "Şili Pesosu (CLP)" },
    { value: "COP", label: "Kolombiya Pesosu (COP)" },
    { value: "CRC", label: "Kosta Rika Kolonu (CRC)" },
    { value: "DZD", label: "Cezayir Dinarı (DZD)" },
    { value: "EGP", label: "Mısır Lirası (EGP)" },
    { value: "HKD", label: "Hong Kong Doları (HKD)" },
    { value: "ISK", label: "İzlanda Kronu (ISK)" },
    { value: "JOD", label: "Ürdün Dinarı (JOD)" },
    { value: "KRW", label: "Güney Kore Wonu (KRW)" },
    { value: "KZT", label: "Kazakistan Tengesi (KZT)" },
    { value: "LBP", label: "Lübnan Lirası (LBP)" },
    { value: "LKR", label: "Sri Lanka Rupisi (LKR)" },
    { value: "MAD", label: "Fas Dirhemi (MAD)" },
    { value: "MDL", label: "Moldova Leyi (MDL)" },
    { value: "MKD", label: "Kuzey Makedonya Dinarı (MKD)" },
    { value: "MYR", label: "Malezya Ringgiti (MYR)" },
    { value: "OMR", label: "Umman Riyali (OMR)" },
    { value: "PEN", label: "Peru Solu (PEN)" },
    { value: "PHP", label: "Filipin Pesosu (PHP)" },
    { value: "PKR", label: "Pakistan Rupisi (PKR)" },
    { value: "QAR", label: "Katar Riyali (QAR)" },
    { value: "RSD", label: "Sırp Dinarı (RSD)" },
    { value: "SGD", label: "Singapur Doları (SGD)" },
    { value: "SYP", label: "Suriye Lirası (SYP)" },
    { value: "THB", label: "Tayland Bahtı (THB)" },
    { value: "TWD", label: "Tayvan Doları (TWD)" },
    { value: "UAH", label: "Ukrayna Grivnası (UAH)" },
    { value: "UYU", label: "Uruguay Pesosu (UYU)" },
    { value: "GEL", label: "Gürcistan Larisi (GEL)" },
    { value: "TND", label: "Tunus Dinarı (TND)" },
    { value: "BGN", label: "Bulgar Levası (BGN)" },
];

const sp500NamingArr = [
    { symbol: "AAPL", name: "Apple" },
    { symbol: "MSFT", name: "Microsoft" },
    { symbol: "GOOGL", name: "Alphabet (Class A)" },
    { symbol: "GOOG", name: "Alphabet (Class C)" },
    { symbol: "NVDA", name: "NVIDIA" },
    { symbol: "META", name: "Meta Platforms" },
    { symbol: "AMZN", name: "Amazon" },
    { symbol: "TSLA", name: "Tesla" },
    { symbol: "ADBE", name: "Adobe" },
    { symbol: "CRM", name: "Salesforce" },
    { symbol: "INTC", name: "Intel" },
    { symbol: "AMD", name: "Advanced Micro Devices" },
    { symbol: "QCOM", name: "Qualcomm" },
    { symbol: "CSCO", name: "Cisco Systems" },
    { symbol: "ORCL", name: "Oracle" },
    { symbol: "AVGO", name: "Broadcom" },
    { symbol: "TXN", name: "Texas Instruments" },
    { symbol: "MU", name: "Micron Technology" },
    { symbol: "IBM", name: "IBM" },
    { symbol: "NOW", name: "ServiceNow" },
    { symbol: "PLTR", name: "Palantir Technologies" },
    { symbol: "SNOW", name: "Snowflake" },
    { symbol: "DDOG", name: "Datadog" },
    { symbol: "NET", name: "Cloudflare" },
    { symbol: "CRWD", name: "CrowdStrike" },
    { symbol: "ZS", name: "Zscaler" },
    { symbol: "PANW", name: "Palo Alto Networks" },
    { symbol: "MDB", name: "MongoDB" },
    { symbol: "DOCU", name: "DocuSign" },
    { symbol: "TWLO", name: "Twilio" },
    { symbol: "V", name: "Visa" },
    { symbol: "MA", name: "Mastercard" },
    { symbol: "PYPL", name: "PayPal" },
    { symbol: "INTU", name: "Intuit" },
    { symbol: "FIS", name: "FIS" },
    { symbol: "ADP", name: "ADP" },
    { symbol: "GPN", name: "Global Payments" },
    { symbol: "JPM", name: "JPMorgan Chase" },
    { symbol: "BAC", name: "Bank of America" },
    { symbol: "WFC", name: "Wells Fargo" },
    { symbol: "C", name: "Citigroup" },
    { symbol: "GS", name: "Goldman Sachs" },
    { symbol: "MS", name: "Morgan Stanley" },
    { symbol: "USB", name: "U.S. Bancorp" },
    { symbol: "SCHW", name: "Charles Schwab" },
    { symbol: "BLK", name: "BlackRock" },
    { symbol: "AXP", name: "American Express" },
    { symbol: "TFC", name: "Truist Financial" },
    { symbol: "BK", name: "Bank of New York Mellon" },
    { symbol: "COF", name: "Capital One" },
    { symbol: "ALLY", name: "Ally Financial" },
    { symbol: "UNH", name: "UnitedHealth" },
    { symbol: "JNJ", name: "Johnson & Johnson" },
    { symbol: "PFE", name: "Pfizer" },
    { symbol: "MRK", name: "Merck" },
    { symbol: "LLY", name: "Eli Lilly" },
    { symbol: "ABBV", name: "AbbVie" },
    { symbol: "TMO", name: "Thermo Fisher Scientific" },
    { symbol: "BMY", name: "Bristol Myers Squibb" },
    { symbol: "MDT", name: "Medtronic" },
    { symbol: "VRTX", name: "Vertex Pharmaceuticals" },
    { symbol: "ISRG", name: "Intuitive Surgical" },
    { symbol: "REGN", name: "Regeneron" },
    { symbol: "GILD", name: "Gilead Sciences" },
    { symbol: "CI", name: "Cigna" },
    { symbol: "HCA", name: "HCA Healthcare" },
    { symbol: "XOM", name: "ExxonMobil" },
    { symbol: "CVX", name: "Chevron" },
    { symbol: "COP", name: "ConocoPhillips" },
    { symbol: "PSX", name: "Phillips 66" },
    { symbol: "SLB", name: "Schlumberger" },
    { symbol: "HAL", name: "Halliburton" },
    { symbol: "MPC", name: "Marathon Petroleum" },
    { symbol: "EOG", name: "EOG Resources" },
    { symbol: "DVN", name: "Devon Energy" },
    { symbol: "OKE", name: "ONEOK" },
    { symbol: "CAT", name: "Caterpillar" },
    { symbol: "DE", name: "Deere & Co." },
    { symbol: "HON", name: "Honeywell" },
    { symbol: "LMT", name: "Lockheed Martin" },
    { symbol: "RTX", name: "RTX Corporation" },
    { symbol: "BA", name: "Boeing" },
    { symbol: "GE", name: "General Electric" },
    { symbol: "NOC", name: "Northrop Grumman" },
    { symbol: "ETN", name: "Eaton" },
    { symbol: "EMR", name: "Emerson Electric" },
    { symbol: "MMM", name: "3M" },
    { symbol: "WMT", name: "Walmart" },
    { symbol: "HD", name: "Home Depot" },
    { symbol: "LOW", name: "Lowe's" },
    { symbol: "TGT", name: "Target" },
    { symbol: "COST", name: "Costco" },
    { symbol: "DG", name: "Dollar General" },
    { symbol: "DLTR", name: "Dollar Tree" },
    { symbol: "BBY", name: "Best Buy" },
    { symbol: "MCD", name: "McDonald's" },
    { symbol: "SBUX", name: "Starbucks" },
    { symbol: "NKE", name: "Nike" },
    { symbol: "TSCO", name: "Tractor Supply" },
    { symbol: "KR", name: "Kroger" },
    { symbol: "ROST", name: "Ross Stores" },
    { symbol: "PG", name: "Procter & Gamble" },
    { symbol: "KO", name: "Coca-Cola" },
    { symbol: "PEP", name: "PepsiCo" },
    { symbol: "CL", name: "Colgate-Palmolive" },
    { symbol: "KMB", name: "Kimberly-Clark" },
    { symbol: "MO", name: "Altria" },
    { symbol: "PM", name: "Philip Morris" },
    { symbol: "TAP", name: "Molson Coors" },
    { symbol: "HSY", name: "Hershey" },
    { symbol: "MDLZ", name: "Mondelez" },
    { symbol: "T", name: "AT&T" },
    { symbol: "VZ", name: "Verizon" },
    { symbol: "CMCSA", name: "Comcast" },
    { symbol: "DIS", name: "Walt Disney" },
    { symbol: "CHTR", name: "Charter Communications" },
    { symbol: "PARA", name: "Paramount Global" },
    { symbol: "FOXA", name: "Fox Corporation" },
    { symbol: "NFLX", name: "Netflix" },
    { symbol: "ROKU", name: "Roku" },
    { symbol: "SPOT", name: "Spotify" },
    { symbol: "F", name: "Ford" },
    { symbol: "GM", name: "General Motors" },
    { symbol: "RIVN", name: "Rivian" },
    { symbol: "LCID", name: "Lucid Motors" },
    { symbol: "TM", name: "Toyota" },
    { symbol: "HMC", name: "Honda" },
    { symbol: "STLA", name: "Stellantis" },
    { symbol: "PLD", name: "Prologis" },
    { symbol: "AMT", name: "American Tower" },
    { symbol: "CCI", name: "Crown Castle" },
    { symbol: "EQIX", name: "Equinix" },
    { symbol: "O", name: "Realty Income" },
    { symbol: "SPG", name: "Simon Property Group" },
    { symbol: "DLR", name: "Digital Realty" },
    { symbol: "WY", name: "Weyerhaeuser" },
    { symbol: "FDX", name: "FedEx" },
    { symbol: "UPS", name: "UPS" },
    { symbol: "CHRW", name: "C.H. Robinson" },
    { symbol: "BKNG", name: "Booking Holdings" },
    { symbol: "ABNB", name: "Airbnb" },
    { symbol: "MAR", name: "Marriott" },
    { symbol: "HLT", name: "Hilton" },
    { symbol: "LUV", name: "Southwest Airlines" },
    { symbol: "UAL", name: "United Airlines" },
    { symbol: "DAL", name: "Delta Air Lines" },
    { symbol: "AAL", name: "American Airlines" },
    { symbol: "NEE", name: "NextEra Energy" },
    { symbol: "DUK", name: "Duke Energy" },
    { symbol: "SO", name: "Southern Company" },
    { symbol: "D", name: "Dominion Energy" },
    { symbol: "SRE", name: "Sempra Energy" },
    { symbol: "XEL", name: "Xcel Energy" },
    { symbol: "AEP", name: "American Electric Power" },
    { symbol: "COIN", name: "Coinbase" },
    { symbol: "HOOD", name: "Robinhood" },
    { symbol: "BKR", name: "Baker Hughes" },
    { symbol: "SNPS", name: "Synopsys" },
    { symbol: "CDNS", name: "Cadence Design Systems" },
    { symbol: "KLAC", name: "KLA Corporation" },
    { symbol: "LRCX", name: "Lam Research" },
    { symbol: "ASML", name: "ASML Holding" },
    { symbol: "ADSK", name: "Autodesk" },
    { symbol: "TEAM", name: "Atlassian" },
    { symbol: "WDAY", name: "Workday" },
    { symbol: "OKTA", name: "Okta" },
    { symbol: "ANET", name: "Arista Networks" },
    { symbol: "FTNT", name: "Fortinet" },
    { symbol: "TYL", name: "Tyler Technologies" },
    { symbol: "FSLR", name: "First Solar" },
    { symbol: "ENPH", name: "Enphase Energy" },
    { symbol: "SEDG", name: "SolarEdge Technologies" }
];

// Finance verisini al
const financeData = store.getters.financePrices || {};
const goldPrices = Object.entries(financeData)
    .filter(([key]) => goldKeys.includes(key.toLowerCase()))
    .reduce((obj, [key, value]) => { obj[key] = value; return obj; }, {});
const financePrices = Object.entries(financeData)
    .filter(([key]) => financeKeys.includes(key.toUpperCase()))
    .reduce((obj, [key, value]) => { obj[key] = value; return obj; }, {});
const cryptoPrices = store.getters.cryptoPrices || [];
const stockPrices = store.getters.stockPrices.map(stock => {
    const found = sp500NamingArr.find(x => x.symbol === stock.symbol);
    return {
        ...stock,
        name: found ? found.name : ''
    };
}) || [];

const stockPriceKvp = store.getters.stockPriceKvp || {};

// Arama filtreleri
const goldPricesFiltered = computed(() => {
    if (!searchObj.value.goldTerm || searchObj.value.goldTerm == "") return goldPrices;
    const term = searchObj.value.goldTerm.toLowerCase();
    return Object.fromEntries(Object.entries(goldPrices).filter(([key, value]) =>
        key.replace(/-/g, ' ').toLowerCase().includes(term) ||
        (value?.name?.toLowerCase()?.includes(term) ?? false)
    ));
});

const financePricesFiltered = computed(() => {
    if (!searchObj.value.financeTerm || searchObj.value.financeTerm == "") return financePrices;

    const term = searchObj.value.financeTerm?.toLowerCase();
    const filterKeys = goldAndFinanceNamingArr
        .filter(x => x.label.toLowerCase().includes(term))
        .map(x => x.value);

    return Object.fromEntries(
        Object.entries(financePrices).filter(([key]) =>
            key.replace(/-/g, ' ').toLowerCase().includes(term) ||
            filterKeys.includes(key.toUpperCase())
        )
    );
});

const cryptoPricesFiltered = computed(() => {
    if (!searchObj.value.cryptoTerm || searchObj.value.cryptoTerm == "") return cryptoPrices;

    const term = searchObj.value.cryptoTerm.toLowerCase();
    return cryptoPrices.filter(x =>
        x.symbol.toLowerCase().includes(term) || x.name.toLowerCase().includes(term)
    );
});

const sp500Filtered = computed(() => {
    if (!searchObj.value.sp500Term || searchObj.value.sp500Term == "") return stockPrices;

    const term = searchObj.value.sp500Term.toLowerCase();
    return stockPrices.filter(x =>
        x.symbol.toLowerCase().includes(term) || x.name.toLowerCase().includes(term)
    );
});

const calculateSymbolMapsArray = computed(() => {
    return Object.entries(calculateSymbolMaps).map(([key, value]) => ({
        value: key,
        label: `${key} ${value}`
    }));
});

goldAndFinanceNamingArr.push(
    ...cryptoPrices.map(x => ({
        value: x.symbol.toUpperCase(),
        label: `${x.name} (${x.symbol.toUpperCase()})`
    }))
);

goldAndFinanceNamingArr.push(
    ...stockPrices.map(x => ({
        value: x.symbol.toUpperCase(),
        label: `${x.name} (${x.symbol.toUpperCase()})`
    }))
);


// Hesaplama
function calculate() {
    const usdPrice = store.getters.financePriceKvp["USD"] || 1;
    const targetPrice = calculateObj.value.targetType.toUpperCase() === "TRY"
        ? 1
        : (store.getters.financePriceKvp[calculateObj.value.targetType.toUpperCase()] || 1);

    let purchasePrice = 0, salesPrice = 0;
    const key = calculateObj.value.sourceType.toUpperCase();

    if (financeData[key] || financeData[key.toLowerCase()]) {
        const data = financeData[key] || financeData[key.toLowerCase()];
        const purchase = parseFloat(data.Alış.replace(/\./g, '').replace(',', '.'));
        const sales = parseFloat(data.Satış.replace(/\./g, '').replace(',', '.'));
        purchasePrice = purchase * calculateObj.value.quantity;
        salesPrice = sales * calculateObj.value.quantity;
    } else if (stockPriceKvp[key]) {
        purchasePrice = stockPriceKvp[key] * usdPrice * calculateObj.value.quantity;
        salesPrice = stockPriceKvp[key] * usdPrice * calculateObj.value.quantity;
    } else {
        const coin = cryptoPrices.find(c => c.symbol.toLowerCase() === calculateObj.value.sourceType.toLowerCase());
        if (coin) {
            purchasePrice = coin.current_price * usdPrice * calculateObj.value.quantity;
            salesPrice = coin.current_price * usdPrice * calculateObj.value.quantity;
        }
    }

    calculateObj.value.purchasePrice = purchasePrice / targetPrice;
    calculateObj.value.salesPrice = salesPrice / targetPrice;
}

// TradingView
function getChartHeight() {
    return window.innerWidth < 768 ? 400 : 750;
}

function loadChart(symbol) {
    const container = document.getElementById('tv_chart');
    if (container) container.innerHTML = '';

    widget = new TradingView.widget({
        container_id: 'tv_chart',
        symbol: symbol,
        interval: 'D',
        timezone: 'Europe/Istanbul',
        theme: 'dark',
        locale: 'tr',
        style: 1,
        width: '100%',
        height: getChartHeight(),
        toolbar_bg: '#0c1c2c',
        enable_publishing: false,
        allow_symbol_change: true,
        save_image: true,
        hide_top_toolbar: false,
        details: true,
        hotlist: false,
        calendar: false,
        studies: [],
        overrides: {
            'paneProperties.background': '#0c1c2c',
            'paneProperties.vertGridProperties.color': '#1f2d3d',
            'paneProperties.horzGridProperties.color': '#1f2d3d',
            'symbolWatermarkProperties.transparency': 90,
            'scalesProperties.textColor': '#AAA',
            'mainSeriesProperties.candleStyle.upColor': '#26a69a',
            'mainSeriesProperties.candleStyle.downColor': '#ef5350',
            'mainSeriesProperties.candleStyle.borderUpColor': '#26a69a',
            'mainSeriesProperties.candleStyle.borderDownColor': '#ef5350',
            'mainSeriesProperties.candleStyle.wickUpColor': '#26a69a',
            'mainSeriesProperties.candleStyle.wickDownColor': '#ef5350',
        },
    });
}

function onResize() {
    if (widget) {
        const symbol = widget.symbol || 'BINANCE:BTCUSDT';
        loadChart(symbol);
    }
}

function formatMarketCap(number) {
    if (number >= 1_000_000_000_000) return (number / 1_000_000_000_000).toFixed(2) + ' T';
    if (number >= 1_000_000_000) return (number / 1_000_000_000).toFixed(2) + ' B';
    if (number >= 1_000_000) return (number / 1_000_000).toFixed(2) + ' M';
    return number.toLocaleString('en-US');
}

// Mount & Cleanup
onMounted(() => {
    loadChart('BINANCE:BTCUSDT');
    window.addEventListener('resize', onResize);
    calculate();
});

onBeforeUnmount(() => {
    window.removeEventListener('resize', onResize);
    const container = document.getElementById('tv_chart');
    if (container) container.innerHTML = '';
    widget = null;
});
</script>
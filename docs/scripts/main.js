import { createApp, ref, computed } from 'vue'
import { createVuetify } from 'vuetify'
import { translation } from './translation.js'
import { checkIPN } from './checkTaxId.js'
import { checkCreditCard } from './checkCreditCard.js'
import { checkIBAN } from './checkIban.js'
import { translit } from './transliterate.js'

const vuetify = createVuetify({
  theme: {
    defaultTheme: 'myCustomTheme',
    themes: {
      myCustomTheme: {
        dark: false,
        colors: {
          primary: '#0072bc',
          secondary: '#D8F0F0',
          accent: '#303030',
          error: '#F72A38',
          warning: '#F5E582',
          info: '#F0F0F0',
          success: '#789078'
        }
      }
    }
  }
})

createApp({
  setup() {
    // Global setup
    const lang = ref('en')
    const isBulk = ref(false)

    // Bulk page
    const text = ref('')
    const chips = ['Tax ID', 'Credit card', 'IBAN', 'Transliteration']
    const selected = ref(chips[0])

    // Buffer copy
    const snackbar = ref(false)

    // Main page
    const ipn = ref('')
    const ipnResult = computed(() => checkIPN(ipn.value, true))

    const creditCard = ref('')
    const creditCardResult = computed(() => checkCreditCard(creditCard.value, true))

    const iban = ref('')
    const ibanResult = computed(() => checkIBAN(iban.value, true))

    const transliteration = ref('')
    const transliterated = computed(() => {
      if (transliteration.value.match(/[a-z]/)) return false
      return translit(transliteration.value)
    })

    const ipnRules = [v => !v || /^\d{10}$/.test(v) || 'Enter 10 digits']
    const creditCardRules = [v => !v || /^\d{16}$/.test(v.replace(/\s+/g, '')) || 'Enter 16 digits']

    const ibanRules = [v => !v || /^[A-Z]{2}\d{27}$/.test(v.replace(/\s+/g, '')) || 'Invalid IBAN']
    const transliterationRules = [v => !!v || 'Required']

    const copyclipboard = async val => {
      await navigator.clipboard.writeText(val)
      snackbar.value = true
    }

    // Bulk processing
    const processText = () => {
      const entities = text.value.split(/\n/)
      let results
      if (selected.value === 'Tax ID') {
        results = entities.map(el => {
          const res = checkIPN(el, true, true)
          if (!res) return 'Invalid,,'
          return res
        })
      }
      if (selected.value === 'Credit card') {
        results = entities.map(el => {
          console.log(el)
          const res = checkCreditCard(el, true, true)
          return res
        })
      }
      if (selected.value === 'IBAN') {
        results = entities.map(el => {
          const res = checkIBAN(el, true, true)
          return res
        })
      }
      if (selected.value === 'Transliteration') {
        results = entities.map(el => {
          return translit(el)
        })
      }
      text.value = results.join('\n')
    }

    // Interface translation
    const t = (s) => {
      if (lang.value === 'uk') return translation[s]
      return s
    }

    return {
      lang,
      isBulk,
      chips,
      selected,
      text,
      snackbar,
      ipn,
      ipnResult,
      ipnRules,
      creditCard,
      creditCardResult,
      creditCardRules,
      iban,
      ibanResult,
      ibanRules,
      transliteration,
      transliterated,
      transliterationRules,
      translit,
      copyclipboard,
      processText,
      t
    }
  }
})
  .use(vuetify)
  .mount('#app')

window.addEventListener('load', () => {
  const splash = document.getElementById('splash')
  if (splash) splash.style.display = 'none'
})

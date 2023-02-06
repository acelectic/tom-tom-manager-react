import i18next from 'i18next'
import { initReactI18next } from 'react-i18next'
import th from './th.json'
import en from './en.json'

const resources = {
  th: {
    translation: th,
  },
  en: {
    translation: en,
  },
}

i18next.use(initReactI18next).init({
  resources,
  fallbackLng: 'en',
  lng: 'th',
  // debug: true,
})

export default i18next

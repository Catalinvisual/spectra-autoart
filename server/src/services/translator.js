import axios from 'axios'

const endpoint = process.env.AZURE_TRANSLATOR_ENDPOINT
const key = process.env.AZURE_TRANSLATOR_KEY
const region = process.env.AZURE_TRANSLATOR_REGION

export async function translateBatch(texts, from, toLocales) {
  if (!endpoint || !key || !region) {
    console.warn('Translator API neconfigurat, returnez textele originale')
    return texts.map(text => ({ translations: toLocales.map(locale => ({ to: locale, text })) }))
  }

  try {
    const url = `${endpoint}/translate?api-version=3.0&from=${from}&to=${toLocales.join(',')}`
    const response = await axios.post(url, texts.map(text => ({ Text: text })), {
      headers: {
        'Ocp-Apim-Subscription-Key': key,
        'Ocp-Apim-Subscription-Region': region,
        'Content-Type': 'application/json'
      }
    })
    return response.data
  } catch (error) {
    console.error('Eroare traducere:', error.response?.data || error.message)
    return texts.map(text => ({ translations: toLocales.map(locale => ({ to: locale, text })) }))
  }
}

export async function translateText(text, from, to) {
  const result = await translateBatch([text], from, [to])
  return result[0]?.translations?.[0]?.text || text
}
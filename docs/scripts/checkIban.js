import { countries, banks } from './dicts.js'

const codes = countries.map(el => el.alpha2).join('|')
const generalPattern = `(?<countryCode>${codes})\\s*(?<control>\\d{2})\\s*(?<mfo>\\d{6})\\s*(?<code>\\d{6,26})`
const fullPattern = new RegExp(`${generalPattern}`)

const enrich = entity => {
  let country = countries.find(el => el.alpha2 === entity.countryCode)
  if (country) {
    entity.country = country.ukrname
    entity.countryRus = country.rusname
    entity.countryEng = country.country
  }
  let bank = banks.find(el => el.mfo === entity.mfo)
  if (bank) {
    entity.bank = bank.ukrName
    entity.bankRus = bank.name
  }
  entity.personal = /0*2620/.test(entity.id.substring(entity.id.length - 19, entity.id.length))
  entity.id = entity.countryCode + entity.control + entity.mfo + entity.code
  entity.alpha2 = entity.countryCode
  delete entity.countryCode
  return entity
}

const CODE_LENGTHS = {
  AD: 24, AE: 23, AT: 20, AZ: 28, BA: 20, BE: 16, BG: 22, BH: 22, BR: 29,
  CH: 21, CR: 22, CY: 28, CZ: 24, DE: 22, DK: 18, DO: 28, EE: 20, ES: 24,
  FI: 18, FO: 18, FR: 27, GB: 22, GI: 23, GL: 18, GR: 27, GT: 28, HR: 21,
  HU: 28, IE: 22, IL: 23, IS: 26, IT: 27, JO: 30, KW: 30, KZ: 20, LB: 28,
  LI: 21, LT: 20, LU: 20, LV: 21, MC: 27, MD: 24, ME: 22, MK: 19, MR: 27,
  MT: 31, MU: 30, NL: 18, NO: 15, PK: 24, PL: 28, PS: 29, PT: 25, QA: 29,
  RO: 24, RS: 22, SA: 24, SE: 24, SI: 19, SK: 24, SM: 27, TN: 24, TR: 26,   
  AL: 28, BY: 28, EG: 29, GE: 22, IQ: 23, LC: 32, SC: 31, ST: 25, SV: 28,
  TL: 23, UA: 29, VA: 22, VG: 24, XK: 20
}

const mod97 = string => {
  let checksum = string.slice(0, 2)
  for (let offset = 2; offset < string.length; offset += 7) {
    let fragment = String(checksum) + string.substring(offset, offset + 7)
    checksum = parseInt(fragment, 10) % 97
  }
  return checksum
}

const calculateIBAN = s => {
  const iban = String(s).toUpperCase().replace(/[^A-Z0-9]/g, '')
  const code = iban.match(/^([A-Z]{2})(\d{2})([A-Z\d]+)$/)
  if (!code) return false
  if (iban.length !== CODE_LENGTHS[code[1]]) return false
  const digits = (code[3] + code[1] + code[2]).replace(/[A-Z]/g, letter => letter.charCodeAt(0) - 55)
  return mod97(digits) === 1
}

const validate = entity => {
  return calculateIBAN(entity.id)
}

export const checkIBAN = (iban, details, csv) => {
  const id = iban
  if (!iban) return false
  let match = iban.match(fullPattern)
  if (!match) {
    if (csv) return 'Invalid,,,,,'
    return { result: 'Invalid' }
  }
  let entity = Object.assign({}, { id }, match.groups)
  entity = enrich(entity)
  entity.result = validate(entity)
  if (!details) return entity.result
  if (csv) return [
    entity.result ? 'Valid' : 'Invalid',
    entity.alpha2 ?? '',
    entity.country ?? '',
    entity.countryEng ?? '',
    entity.mfo ?? '',
    entity.bank ?? ''
  ].join(',')
  entity.result = entity.result ? 'Valid' : 'Invalid'
  delete entity.control
  delete entity.code
  delete entity.countryRus
  delete entity.bankRus
  return entity
}

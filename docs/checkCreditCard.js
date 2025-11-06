const detectCardTypePattern = /(?:(?<visa>4[0-9]{12}(?:[0-9]{3})?)|(?<mastercard>5[1-5][0-9]{14})|(?<discover>6(?:011|5[0-9][0-9])[0-9]{12})|(?<amex>3[47][0-9]{13})|(?<diners>3(?:0[0-5]|[68][0-9])[0-9]{11})|(?<jcb>(?:2131|1800|35\d{3})\d{11}))/

const validateCreditCard = entity => {
  let value = entity.id
  if (/[^0-9-\s]+/.test(value)) return false
  // The Luhn Algorithm
  let nCheck = 0, bEven = false
  value = value.replace(/\D/g, '')
  for (let n = value.length - 1; n >= 0; n--) {
    let cDigit = value.charAt(n)
    let nDigit = parseInt(cDigit, 10)
    if (bEven && (nDigit *= 2) > 9) nDigit -= 9
    nCheck += nDigit
    bEven = !bEven
  }
  return (nCheck % 10) === 0
}

const enrichCreditCard = entity => {
  let cardTypes = entity.id.match(detectCardTypePattern)
  if (!cardTypes) {
    entity.type = 'Other'
    return entity
  }
  for (let [key, value] of Object.entries(cardTypes.groups)) {
    if (value) {
      entity.type = key
      break
    }
  }
  return entity
}

const creditCardPattern = new RegExp(`^\\d{4}[ -]*\\d{4}[ -]*\\d{4}[ -]*\\d{4}$`)

export const checkCreditCard = (creditCard, details, csv) => {
  const id = creditCard
  if (!creditCard) return false
  let match = creditCard.match(creditCardPattern)
  if (!match) return false
  let entity = Object.assign({}, { id })
  entity = enrichCreditCard(entity)
  entity.result = validateCreditCard(entity)
  if (!details) return entity.result
  entity.result = entity.result ? 'Valid' : 'Invalid'
  return entity
}

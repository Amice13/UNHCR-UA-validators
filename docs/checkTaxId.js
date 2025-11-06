const mult = [-1, 5, 7, 9, 4, 6, 10, 5, 7]
const sourceDate = new Date('1899-12-31')

export const checkIPN = (str, details, csv) => {
  if (!str) return false
  if (!str.match(/^\d{10}$/)) return false
  // Get first five symbols
  let daysSinceBirthday = parseInt(str.slice(0, 5))
  if (str[0] === '8') daysSinceBirthday = daysSinceBirthday - 63475
  // Get the numeric represntation of 1899-12-31 and add the number of days + 1 
  let birthday = new Date(sourceDate).setTime(sourceDate.getTime() + daysSinceBirthday * 24 * 3600 * 1000)
  // Return to ISO 9601
  birthday = new Date(birthday).toISOString().substr(0, 10)
  const age = new Date(Date.now() - new Date(birthday).getTime()).getUTCFullYear() - 1970
  const gender = parseInt(str.slice(8,9)) % 2 === 0 ? 'Female' : 'Male'
  const numbers = str.slice(0,9).split('').map(el => parseInt(el))
  const checkSum = numbers.reduce((acc, val, i) => acc + val * mult[i], 0) % 11 % 10
  const result = parseInt(str.slice(9, 10)) === checkSum ? 'Valid' : 'Invalid'
  if (!details) return result
  if (csv) return [result, birthday, gender].join(',')
  return { result, birthday, gender, age }
}

// The rules of transliteration were introduced by the Decree #55 (27.01.2010) by The Cabinet of the Minister of Ukraine
// For the reference: https://zakon.rada.gov.ua/laws/show/55-2010-%D0%BF

// The list of letters which must be handled differently if they are in the beginning of the word
const firstLettersPattern = /(?<=^|[^а-яєіїґё'’`]'?)([єїйюя])/gi

// All Ukrainian letters
const allLetters = /[а-яєіїґ]/gi

// The pattern "зг" must treated in a different way.
// The direct transliteration "zh" means "ж". Therefore, the proper transliteration must be "zgh"
const zgLettersPattern = /зг/gi

// All apostrophes must be removed
// Note that the apostrophes must be unified in advance
const replaceApostrophePattern = /(?<=[а-яєіїґ])['’`](?=[а-яєіїґ])/gi

// Transliateration of the first letters
const firstLetters = {
  Є: 'Ye',
  Ї: 'Yi',
  Й: 'Y',
  Ю: 'Yu',
  Я: 'Ya',
  є: 'ye',
  ї: 'yi',
  й: 'y',
  ю: 'yu',
  я: 'ya'
}

// Transliteration of Ukrainian letters on other positions
const otherLetters = {
  А: 'A',
  Б: 'B',
  В: 'V',
  Г: 'H',
  Ґ: 'G',
  Д: 'D',
  Е: 'E',
  Є: 'Ie',
  Ж: 'Zh',
  З: 'Z',
  И: 'Y',
  І: 'I',
  Ї: 'I',
  Й: 'I',
  К: 'K',
  Л: 'L',
  М: 'M',
  Н: 'N',
  О: 'O',
  П: 'P',
  Р: 'R',
  С: 'S',
  Т: 'T',
  У: 'U',
  Ф: 'F',
  Х: 'Kh',
  Ц: 'Ts',
  Ч: 'Ch',
  Ш: 'Sh',
  Щ: 'Shch',
  Ь: '',
  Ъ: '',
  Ы: 'Y',
  Э: 'E',
  Ю: 'Iu',
  Я: 'Ia',
  а: 'a',
  б: 'b',
  в: 'v',
  г: 'h',
  ґ: 'g',
  д: 'd',
  е: 'e',
  є: 'ie',
  ж: 'zh',
  з: 'z',
  и: 'y',
  і: 'i',
  ї: 'i',
  й: 'i',
  к: 'k',
  л: 'l',
  м: 'm',
  н: 'n',
  о: 'o',
  п: 'p',
  р: 'r',
  с: 's',
  т: 't',
  у: 'u',
  ф: 'f',
  х: 'kh',
  ц: 'ts',
  ч: 'ch',
  ш: 'sh',
  щ: 'shch',
  ь: '',
  ъ: '',
  ы: 'y',
  э: 'E',
  ю: 'iu',
  я: 'ia'
}

// Transliteration of "зг"
const zgLetters = { Зг: 'Zgh', зг: 'zgh', ЗГ: 'ZGH' }

// Helper function to check if the string contains cyryllic letters
const hasCyrillic = (s) => {
  return /[а-яєіїґ]/gis.test(s)
}

// Transliteration function
export function translit (s) {
  if (typeof s !== 'string') throw Error('Not a string')
  if (s.length === 0) return ''
  if (!hasCyrillic(s)) return s
  s = s.replace(replaceApostrophePattern, '')
  s = s.replace(zgLettersPattern, letter => zgLetters[letter])
  s = s.replace(firstLettersPattern, letter => firstLetters[letter])
  s = s.replace(allLetters, letter => otherLetters[letter])
  return s
}

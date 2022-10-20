const currencySymbols = {
  AED: 'د.إ',
  AFN: '؋',
  ALL: 'L',
  AMD: '֏',
  ANG: 'ƒ',
  AOA: 'Kz',
  ARS: '$',
  AUD: '$',
  AWG: 'ƒ',
  AZN: '₼',
  BAM: 'KM',
  BBD: '$',
  BDT: '৳',
  BGN: 'лв',
  BHD: '.د.ب',
  BIF: 'FBu',
  BMD: '$',
  BND: '$',
  BOB: '$b',
  BOV: 'BOV',
  BRL: 'R$',
  BSD: '$',
  BTC: '₿',
  BTN: 'Nu.',
  BWP: 'P',
  BYN: 'Br',
  BYR: 'Br',
  BZD: 'BZ$',
  CAD: '$',
  CDF: 'FC',
  CHE: 'CHE',
  CHF: 'CHF',
  CHW: 'CHW',
  CLF: 'CLF',
  CLP: '$',
  CNH: '¥',
  CNY: '¥',
  COP: '$',
  COU: 'COU',
  CRC: '₡',
  CUC: '$',
  CUP: '₱',
  CVE: '$',
  CZK: 'Kč',
  DJF: 'Fdj',
  DKK: 'kr',
  DOP: 'RD$',
  DZD: 'دج',
  EEK: 'kr',
  EGP: '£',
  ERN: 'Nfk',
  ETB: 'Br',
  ETH: 'Ξ',
  EUR: '€',
  FJD: '$',
  FKP: '£',
  GBP: '£',
  GEL: '₾',
  GGP: '£',
  GHC: '₵',
  GHS: 'GH₵',
  GIP: '£',
  GMD: 'D',
  GNF: 'FG',
  GTQ: 'Q',
  GYD: '$',
  HKD: '$',
  HNL: 'L',
  HRK: 'kn',
  HTG: 'G',
  HUF: 'Ft',
  IDR: 'Rp',
  ILS: '₪',
  IMP: '£',
  INR: '₹',
  IQD: 'ع.د',
  IRR: '﷼',
  ISK: 'kr',
  JEP: '£',
  JMD: 'J$',
  JOD: 'JD',
  JPY: '¥',
  KES: 'KSh',
  KGS: 'лв',
  KHR: '៛',
  KMF: 'CF',
  KPW: '₩',
  KRW: '₩',
  KWD: 'KD',
  KYD: '$',
  KZT: '₸',
  LAK: '₭',
  LBP: '£',
  LKR: '₨',
  LRD: '$',
  LSL: 'M',
  LTC: 'Ł',
  LTL: 'Lt',
  LVL: 'Ls',
  LYD: 'LD',
  MAD: 'MAD',
  MDL: 'lei',
  MGA: 'Ar',
  MKD: 'ден',
  MMK: 'K',
  MNT: '₮',
  MOP: 'MOP$',
  MRO: 'UM',
  MRU: 'UM',
  MUR: '₨',
  MVR: 'Rf',
  MWK: 'MK',
  MXN: '$',
  MXV: 'MXV',
  MYR: 'RM',
  MZN: 'MT',
  NAD: '$',
  NGN: '₦',
  NIO: 'C$',
  NOK: 'kr',
  NPR: '₨',
  NZD: '$',
  OMR: '﷼',
  PAB: 'B/.',
  PEN: 'S/.',
  PGK: 'K',
  PHP: '₱',
  PKR: '₨',
  PLN: 'zł',
  PYG: 'Gs',
  QAR: '﷼',
  RMB: '￥',
  RON: 'lei',
  RSD: 'Дин.',
  RUB: '₽',
  RWF: 'R₣',
  SAR: '﷼',
  SBD: '$',
  SCR: '₨',
  SDG: 'ج.س.',
  SEK: 'kr',
  SGD: 'S$',
  SHP: '£',
  SLL: 'Le',
  SOS: 'S',
  SRD: '$',
  SSP: '£',
  STD: 'Db',
  STN: 'Db',
  SVC: '$',
  SYP: '£',
  SZL: 'E',
  THB: '฿',
  TJS: 'SM',
  TMT: 'T',
  TND: 'د.ت',
  TOP: 'T$',
  TRL: '₤',
  TRY: '₺',
  TTD: 'TT$',
  TVD: '$',
  TWD: 'NT$',
  TZS: 'TSh',
  UAH: '₴',
  UGX: 'USh',
  USD: '$',
  UYI: 'UYI',
  UYU: '$U',
  UYW: 'UYW',
  UZS: 'лв',
  VEF: 'Bs',
  VES: 'Bs.S',
  VND: '₫',
  VUV: 'VT',
  WST: 'WS$',
  XAF: 'FCFA',
  XBT: 'Ƀ',
  XCD: '$',
  XOF: 'CFA',
  XPF: '₣',
  XSU: 'Sucre',
  XUA: 'XUA',
  YER: '﷼',
  ZAR: 'R',
  ZMW: 'ZK',
  ZWD: 'Z$',
  ZWL: '$'
} as const;

const dups = Object.entries(currencySymbols).reduce((result, [_, symbol]) => {
  if (result[symbol]) {
    result[symbol] = result[symbol] + 1;
  } else {
    result[symbol] = 1;
  }

  return result;
}, {});

export const currencySymbolMap: Record<string, string> = Object.entries(
  currencySymbols
).reduce((result, [key, symbol]) => {
  if (['GBP', 'USD'].includes(key)) {
    // special case for GBP - no prefix
    result[key] = symbol;
  } else if (dups[symbol] > 1) {
    result[key] = key.slice(0, 2) + symbol;
  } else {
    result[key] = symbol;
  }

  return result;
}, {});

export type CurrencyCode = keyof typeof currencySymbols;

type Currency = {
  code: CurrencyCode;
  name: string;
};

export type CurrencySymbol = typeof currencySymbolMap[CurrencyCode];

export type CurrencyMeta = {
  [code in CurrencyCode]: {
    name: string;
    symbol: CurrencySymbol;
    rateToBaseCurrency: number;
  };
};

export const baseCurrencyCode: CurrencyCode = 'USD';

export const preferredCurrencies: Currency[] = [
  {
    code: 'AED',
    name: 'Emirati Dirham'
  },
  {
    code: 'AUD',
    name: 'Australian dollar'
  },
  {
    code: 'BGN',
    name: 'Bulgarian lev'
  },
  {
    code: 'BRL',
    name: 'Brazilian real'
  },
  {
    code: 'CAD',
    name: 'Canadian dollar'
  },
  {
    code: 'CHF',
    name: 'Swiss franc'
  },
  {
    code: 'CZK',
    name: 'Czech koruna'
  },
  {
    code: 'DKK',
    name: 'Danish krone'
  },
  {
    code: 'EUR',
    name: 'Euro'
  },
  {
    code: 'GBP',
    name: 'British pound'
  },
  {
    code: 'HKD',
    name: 'Hong Kong dollar'
  },
  {
    code: 'HRK',
    name: 'Croatian kuna'
  },
  {
    code: 'HUF',
    name: 'Hungarian forint'
  },
  {
    code: 'IDR',
    name: 'Indonesian rupiah'
  },
  {
    code: 'INR',
    name: 'Indian rupee'
  },
  {
    code: 'JPY',
    name: 'Japanese yen'
  },
  {
    code: 'MYR',
    name: 'Malaysian ringgit'
  },
  {
    code: 'NOK',
    name: 'Norwegian krone'
  },
  {
    code: 'NZD',
    name: 'New Zealand dollar'
  },
  {
    code: 'PLN',
    name: 'Polish złoty'
  },
  {
    code: 'RON',
    name: 'Romanian leu'
  },
  {
    code: 'TRY',
    name: 'Turkish lira'
  },
  {
    code: 'SEK',
    name: 'Swedish krona'
  },
  {
    code: 'SGD',
    name: 'Singapore dollar'
  },
  {
    code: 'USD',
    name: 'US dollar'
  },
  {
    code: 'ARS',
    name: 'Argentine peso'
  },
  {
    code: 'BDT',
    name: 'Bangladeshi taka'
  },
  {
    code: 'BWP',
    name: 'Botswana pula'
  },
  {
    code: 'CLP',
    name: 'Chilean peso'
  },
  {
    code: 'CNY',
    name: 'Chinese yuan'
  },
  {
    code: 'COP',
    name: 'Colombian peso'
  },
  {
    code: 'CRC',
    name: 'Costa Rica Colón'
  },
  {
    code: 'EGP',
    name: 'Egyptian pound'
  },
  {
    code: 'FJD',
    name: 'Fijian dollar'
  },
  {
    code: 'GEL',
    name: 'Georgian lari'
  },
  {
    code: 'GHS',
    name: 'Ghana Cedi'
  },
  {
    code: 'ILS',
    name: 'Israeli shekels'
  },
  {
    code: 'KES',
    name: 'Kenyan shillings'
  },
  {
    code: 'KRW',
    name: 'South Korean won'
  },
  {
    code: 'LKR',
    name: 'Sri Lankan rupee'
  },
  {
    code: 'MAD',
    name: 'Moroccan dirham'
  },
  {
    code: 'MXN',
    name: 'Mexican peso'
  },
  {
    code: 'NPR',
    name: 'Nepalese Rupee'
  },
  {
    code: 'PHP',
    name: 'Philippine peso'
  },
  {
    code: 'PKR',
    name: 'Pakistani rupee'
  },
  {
    code: 'THB',
    name: 'Thai baht'
  },
  {
    code: 'UAH',
    name: 'Ukranian hryvna'
  },
  {
    code: 'UGX',
    name: 'Ugandan shilling'
  },
  {
    code: 'UYU',
    name: 'Uruguayan pesos'
  },
  {
    code: 'VND',
    name: 'Vietnamese dong'
  },
  {
    code: 'ZAR',
    name: 'South African Rand'
  },
  {
    code: 'ZMW',
    name: 'Zambian kwacha'
  }
];

const mockPreferredCurrencies: CurrencyMeta = preferredCurrencies.reduce(
  (allCurrencies, currency): CurrencyMeta | Record<string, never> => {
    const significantDigits = 8;

    allCurrencies[currency.code] = {
      name: currency.name,
      symbol: currencySymbolMap[currency.code],
      rateToBaseCurrency:
        currency.code === baseCurrencyCode
          ? 1
          : Math.round(Math.random() * Math.pow(10, significantDigits)) /
            Math.pow(10, significantDigits)
    };

    return allCurrencies;
  },
  {}
) as CurrencyMeta;

export const getPreferredCurrencies = () => {
  // build currencies meta
  return mockPreferredCurrencies;
};

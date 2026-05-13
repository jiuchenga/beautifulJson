// src/lib/convert-utils.ts

// === Timestamp Conversion ===

export function timestampToDate(timestamp: string): string {
  const ts = Number(timestamp);
  if (isNaN(ts)) throw new Error('Invalid timestamp');
  // Auto-detect seconds vs milliseconds
  const ms = ts > 1e12 ? ts : ts * 1000;
  const d = new Date(ms);
  if (isNaN(d.getTime())) throw new Error('Invalid timestamp');
  return d.toISOString();
}

export function dateToTimestamp(dateStr: string, unit: 's' | 'ms' = 's'): string {
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) throw new Error('Invalid date');
  return unit === 'ms' ? String(d.getTime()) : String(Math.floor(d.getTime() / 1000));
}

export function getCurrentTimestamp(): { seconds: number; milliseconds: number; iso: string } {
  const now = new Date();
  return {
    seconds: Math.floor(now.getTime() / 1000),
    milliseconds: now.getTime(),
    iso: now.toISOString(),
  };
}

// === HTML Escape/Unescape ===

export function htmlEscape(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

export function htmlUnescape(text: string): string {
  const doc = typeof document !== 'undefined' ? document : undefined;
  if (doc) {
    const el = doc.createElement('textarea');
    el.innerHTML = text;
    return el.value;
  }
  return text
    .replace(/&#039;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&gt;/g, '>')
    .replace(/&lt;/g, '<')
    .replace(/&amp;/g, '&');
}

// === Word Counter ===

export interface WordCount {
  characters: number;
  charactersNoSpaces: number;
  words: number;
  lines: number;
  paragraphs: number;
  bytes: number;
}

export function countWords(text: string): WordCount {
  const encoder = new TextEncoder();
  return {
    characters: text.length,
    charactersNoSpaces: text.replace(/\s/g, '').length,
    words: text.trim() ? text.trim().split(/\s+/).length : 0,
    lines: text ? text.split('\n').length : 0,
    paragraphs: text.trim() ? text.trim().split(/\n\s*\n/).filter(Boolean).length : 0,
    bytes: encoder.encode(text).length,
  };
}

// === Unit Conversion ===

export type UnitCategory = 'length' | 'area' | 'volume' | 'temperature' | 'weight' | 'speed' | 'time' | 'data' | 'angle' | 'energy' | 'power' | 'pressure' | 'density' | 'force';

interface UnitDef {
  label: string;
  toBase: (v: number) => number;
  fromBase: (v: number) => number;
}

export const unitTables: Record<UnitCategory, Record<string, UnitDef>> = {
  length: {
    m: { label: 'Meter (m)', toBase: (v) => v, fromBase: (v) => v },
    km: { label: 'Kilometer (km)', toBase: (v) => v * 1000, fromBase: (v) => v / 1000 },
    cm: { label: 'Centimeter (cm)', toBase: (v) => v / 100, fromBase: (v) => v * 100 },
    mm: { label: 'Millimeter (mm)', toBase: (v) => v / 1000, fromBase: (v) => v * 1000 },
    mi: { label: 'Mile (mi)', toBase: (v) => v * 1609.344, fromBase: (v) => v / 1609.344 },
    yd: { label: 'Yard (yd)', toBase: (v) => v * 0.9144, fromBase: (v) => v / 0.9144 },
    ft: { label: 'Foot (ft)', toBase: (v) => v * 0.3048, fromBase: (v) => v / 0.3048 },
    in: { label: 'Inch (in)', toBase: (v) => v * 0.0254, fromBase: (v) => v / 0.0254 },
    nm: { label: 'Nautical Mile (nmi)', toBase: (v) => v * 1852, fromBase: (v) => v / 1852 },
  },
  area: {
    sqm: { label: 'Square Meter (m²)', toBase: (v) => v, fromBase: (v) => v },
    sqkm: { label: 'Square Kilometer (km²)', toBase: (v) => v * 1e6, fromBase: (v) => v / 1e6 },
    ha: { label: 'Hectare (ha)', toBase: (v) => v * 10000, fromBase: (v) => v / 10000 },
    acre: { label: 'Acre', toBase: (v) => v * 4046.856, fromBase: (v) => v / 4046.856 },
    sqft: { label: 'Square Foot (ft²)', toBase: (v) => v * 0.0929, fromBase: (v) => v / 0.0929 },
    sqmi: { label: 'Square Mile (mi²)', toBase: (v) => v * 2589988.11, fromBase: (v) => v / 2589988.11 },
  },
  volume: {
    l: { label: 'Liter (L)', toBase: (v) => v, fromBase: (v) => v },
    ml: { label: 'Milliliter (mL)', toBase: (v) => v / 1000, fromBase: (v) => v * 1000 },
    gal: { label: 'US Gallon (gal)', toBase: (v) => v * 3.78541, fromBase: (v) => v / 3.78541 },
    qt: { label: 'US Quart (qt)', toBase: (v) => v * 0.946353, fromBase: (v) => v / 0.946353 },
    pt: { label: 'US Pint (pt)', toBase: (v) => v * 0.473176, fromBase: (v) => v / 0.473176 },
    cup: { label: 'US Cup', toBase: (v) => v * 0.236588, fromBase: (v) => v / 0.236588 },
    floz: { label: 'US Fluid Ounce (fl oz)', toBase: (v) => v * 0.0295735, fromBase: (v) => v / 0.0295735 },
    cbm: { label: 'Cubic Meter (m³)', toBase: (v) => v * 1000, fromBase: (v) => v / 1000 },
  },
  temperature: {
    c: { label: 'Celsius (°C)', toBase: (v) => v, fromBase: (v) => v },
    f: { label: 'Fahrenheit (°F)', toBase: (v) => (v - 32) * 5 / 9, fromBase: (v) => v * 9 / 5 + 32 },
    k: { label: 'Kelvin (K)', toBase: (v) => v - 273.15, fromBase: (v) => v + 273.15 },
  },
  weight: {
    kg: { label: 'Kilogram (kg)', toBase: (v) => v, fromBase: (v) => v },
    g: { label: 'Gram (g)', toBase: (v) => v / 1000, fromBase: (v) => v * 1000 },
    mg: { label: 'Milligram (mg)', toBase: (v) => v / 1e6, fromBase: (v) => v * 1e6 },
    lb: { label: 'Pound (lb)', toBase: (v) => v * 0.453592, fromBase: (v) => v / 0.453592 },
    oz: { label: 'Ounce (oz)', toBase: (v) => v * 0.0283495, fromBase: (v) => v / 0.0283495 },
    t: { label: 'Metric Ton (t)', toBase: (v) => v * 1000, fromBase: (v) => v / 1000 },
    st: { label: 'Stone (st)', toBase: (v) => v * 6.35029, fromBase: (v) => v / 6.35029 },
  },
  speed: {
    ms: { label: 'Meter/second (m/s)', toBase: (v) => v, fromBase: (v) => v },
    kmh: { label: 'Kilometer/hour (km/h)', toBase: (v) => v / 3.6, fromBase: (v) => v * 3.6 },
    mph: { label: 'Mile/hour (mph)', toBase: (v) => v * 0.44704, fromBase: (v) => v / 0.44704 },
    kn: { label: 'Knot (kn)', toBase: (v) => v * 0.514444, fromBase: (v) => v / 0.514444 },
    mach: { label: 'Mach', toBase: (v) => v * 343, fromBase: (v) => v / 343 },
    c: { label: 'Speed of Light (c)', toBase: (v) => v * 299792458, fromBase: (v) => v / 299792458 },
  },
  time: {
    s: { label: 'Second (s)', toBase: (v) => v, fromBase: (v) => v },
    min: { label: 'Minute (min)', toBase: (v) => v * 60, fromBase: (v) => v / 60 },
    hr: { label: 'Hour (hr)', toBase: (v) => v * 3600, fromBase: (v) => v / 3600 },
    day: { label: 'Day', toBase: (v) => v * 86400, fromBase: (v) => v / 86400 },
    wk: { label: 'Week', toBase: (v) => v * 604800, fromBase: (v) => v / 604800 },
    mo: { label: 'Month (30d)', toBase: (v) => v * 2592000, fromBase: (v) => v / 2592000 },
    yr: { label: 'Year (365d)', toBase: (v) => v * 31536000, fromBase: (v) => v / 31536000 },
  },
  data: {
    b: { label: 'Byte (B)', toBase: (v) => v, fromBase: (v) => v },
    kb: { label: 'Kilobyte (KB)', toBase: (v) => v * 1024, fromBase: (v) => v / 1024 },
    mb: { label: 'Megabyte (MB)', toBase: (v) => v * 1048576, fromBase: (v) => v / 1048576 },
    gb: { label: 'Gigabyte (GB)', toBase: (v) => v * 1073741824, fromBase: (v) => v / 1073741824 },
    tb: { label: 'Terabyte (TB)', toBase: (v) => v * 1099511627776, fromBase: (v) => v / 1099511627776 },
    pb: { label: 'Petabyte (PB)', toBase: (v) => v * 1125899906842624, fromBase: (v) => v / 1125899906842624 },
    bit: { label: 'Bit', toBase: (v) => v / 8, fromBase: (v) => v * 8 },
    kbit: { label: 'Kilobit (Kbit)', toBase: (v) => v * 128, fromBase: (v) => v / 128 },
    mbit: { label: 'Megabit (Mbit)', toBase: (v) => v * 131072, fromBase: (v) => v / 131072 },
    gbit: { label: 'Gigabit (Gbit)', toBase: (v) => v * 134217728, fromBase: (v) => v / 134217728 },
  },
  angle: {
    deg: { label: 'Degree (°)', toBase: (v) => v, fromBase: (v) => v },
    rad: { label: 'Radian (rad)', toBase: (v) => v * 180 / Math.PI, fromBase: (v) => v * Math.PI / 180 },
    grad: { label: 'Gradian (grad)', toBase: (v) => v * 0.9, fromBase: (v) => v / 0.9 },
    arcmin: { label: 'Arcminute (\')', toBase: (v) => v / 60, fromBase: (v) => v * 60 },
    arcsec: { label: 'Arcsecond (")', toBase: (v) => v / 3600, fromBase: (v) => v * 3600 },
  },
  energy: {
    j: { label: 'Joule (J)', toBase: (v) => v, fromBase: (v) => v },
    kj: { label: 'Kilojoule (kJ)', toBase: (v) => v * 1000, fromBase: (v) => v / 1000 },
    cal: { label: 'Calorie (cal)', toBase: (v) => v * 4.184, fromBase: (v) => v / 4.184 },
    kcal: { label: 'Kilocalorie (kcal)', toBase: (v) => v * 4184, fromBase: (v) => v / 4184 },
    wh: { label: 'Watt-hour (Wh)', toBase: (v) => v * 3600, fromBase: (v) => v / 3600 },
    kwh: { label: 'Kilowatt-hour (kWh)', toBase: (v) => v * 3600000, fromBase: (v) => v / 3600000 },
    btu: { label: 'BTU', toBase: (v) => v * 1055.06, fromBase: (v) => v / 1055.06 },
    ev: { label: 'Electronvolt (eV)', toBase: (v) => v * 1.602e-19, fromBase: (v) => v / 1.602e-19 },
  },
  power: {
    w: { label: 'Watt (W)', toBase: (v) => v, fromBase: (v) => v },
    kw: { label: 'Kilowatt (kW)', toBase: (v) => v * 1000, fromBase: (v) => v / 1000 },
    mw: { label: 'Megawatt (MW)', toBase: (v) => v * 1e6, fromBase: (v) => v / 1e6 },
    hp: { label: 'Horsepower (hp)', toBase: (v) => v * 745.7, fromBase: (v) => v / 745.7 },
    ps: { label: 'Metric HP (PS)', toBase: (v) => v * 735.499, fromBase: (v) => v / 735.499 },
    btuh: { label: 'BTU/hour', toBase: (v) => v * 0.29307107, fromBase: (v) => v / 0.29307107 },
  },
  pressure: {
    pa: { label: 'Pascal (Pa)', toBase: (v) => v, fromBase: (v) => v },
    kpa: { label: 'Kilopascal (kPa)', toBase: (v) => v * 1000, fromBase: (v) => v / 1000 },
    mpa: { label: 'Megapascal (MPa)', toBase: (v) => v * 1e6, fromBase: (v) => v / 1e6 },
    bar: { label: 'Bar', toBase: (v) => v * 1e5, fromBase: (v) => v / 1e5 },
    atm: { label: 'Atmosphere (atm)', toBase: (v) => v * 101325, fromBase: (v) => v / 101325 },
    psi: { label: 'PSI', toBase: (v) => v * 6894.76, fromBase: (v) => v / 6894.76 },
    mmhg: { label: 'mmHg (Torr)', toBase: (v) => v * 133.322, fromBase: (v) => v / 133.322 },
  },
  density: {
    kgm3: { label: 'kg/m³', toBase: (v) => v, fromBase: (v) => v },
    gcm3: { label: 'g/cm³', toBase: (v) => v * 1000, fromBase: (v) => v / 1000 },
    gl: { label: 'g/L', toBase: (v) => v, fromBase: (v) => v },
    lbft3: { label: 'lb/ft³', toBase: (v) => v * 16.0185, fromBase: (v) => v / 16.0185 },
    lbgal: { label: 'lb/gal (US)', toBase: (v) => v * 119.826, fromBase: (v) => v / 119.826 },
  },
  force: {
    n: { label: 'Newton (N)', toBase: (v) => v, fromBase: (v) => v },
    kn: { label: 'Kilonewton (kN)', toBase: (v) => v * 1000, fromBase: (v) => v / 1000 },
    lbf: { label: 'Pound-force (lbf)', toBase: (v) => v * 4.44822, fromBase: (v) => v / 4.44822 },
    kgf: { label: 'Kilogram-force (kgf)', toBase: (v) => v * 9.80665, fromBase: (v) => v / 9.80665 },
    dyn: { label: 'Dyne (dyn)', toBase: (v) => v * 1e-5, fromBase: (v) => v / 1e-5 },
    ozf: { label: 'Ounce-force (ozf)', toBase: (v) => v * 0.278014, fromBase: (v) => v / 0.278014 },
  },
};

export function convertUnit(value: number, category: UnitCategory, fromUnit: string, toUnit: string): number {
  const table = unitTables[category];
  if (!table[fromUnit] || !table[toUnit]) throw new Error('Invalid unit');
  const base = table[fromUnit].toBase(value);
  return table[toUnit].fromBase(base);
}

// === Subnet Mask ===

export interface SubnetInfo {
  cidr: number;
  mask: string;
  wildcard: string;
  network: string;
  broadcast: string;
  hosts: number;
  firstHost: string;
  lastHost: string;
}

export function calculateSubnet(ip: string, cidrOrMask: string): SubnetInfo {
  const ipParts = ip.split('.').map(Number);
  if (ipParts.length !== 4 || ipParts.some(p => isNaN(p) || p < 0 || p > 255)) {
    throw new Error('Invalid IP address');
  }

  let cidr: number;
  if (cidrOrMask.startsWith('/')) {
    cidr = parseInt(cidrOrMask.slice(1));
  } else if (cidrOrMask.includes('.')) {
    const parts = cidrOrMask.split('.').map(Number);
    const binary = parts.map(p => p.toString(2).padStart(8, '0')).join('');
    const ones = binary.match(/^1*/)?.[0].length || 0;
    if (!binary.match(/^1*0*$/)) throw new Error('Invalid subnet mask');
    cidr = ones;
  } else {
    cidr = parseInt(cidrOrMask);
  }

  if (isNaN(cidr) || cidr < 0 || cidr > 32) throw new Error('CIDR must be 0-32');

  const ipNum = (ipParts[0] << 24) | (ipParts[1] << 16) | (ipParts[2] << 8) | ipParts[3];
  const maskNum = cidr === 0 ? 0 : (~0 << (32 - cidr)) >>> 0;
  const networkNum = (ipNum & maskNum) >>> 0;
  const broadcastNum = (networkNum | ~maskNum) >>> 0;

  const toIp = (n: number) => [(n >>> 24) & 255, (n >>> 16) & 255, (n >>> 8) & 255, n & 255].join('.');
  const hosts = cidr >= 31 ? (cidr === 32 ? 1 : 2) : Math.pow(2, 32 - cidr) - 2;

  return {
    cidr,
    mask: toIp(maskNum),
    wildcard: toIp((~maskNum) >>> 0),
    network: toIp(networkNum),
    broadcast: toIp(broadcastNum),
    hosts,
    firstHost: toIp(cidr >= 31 ? networkNum : (networkNum + 1) >>> 0),
    lastHost: toIp(cidr >= 31 ? broadcastNum : (broadcastNum - 1) >>> 0),
  };
}


export interface Country {
  name: string;
  flag: string;
  code: string;
  population?: number;
}

export const countries: Country[] = [
  { name: 'United States', flag: '🇺🇸', code: 'US', population: 331900000 },
  { name: 'Canada', flag: '🇨🇦', code: 'CA', population: 38000000 },
  { name: 'United Kingdom', flag: '🇬🇧', code: 'GB', population: 67000000 },
  { name: 'France', flag: '🇫🇷', code: 'FR', population: 68000000 },
  { name: 'Germany', flag: '🇩🇪', code: 'DE', population: 83200000 },
  { name: 'Italy', flag: '🇮🇹', code: 'IT', population: 59100000 },
  { name: 'Spain', flag: '🇪🇸', code: 'ES', population: 47400000 },
  { name: 'Japan', flag: '🇯🇵', code: 'JP', population: 125000000 },
  { name: 'China', flag: '🇨🇳', code: 'CN', population: 1412000000 },
  { name: 'Brazil', flag: '🇧🇷', code: 'BR', population: 215000000 },
  { name: 'Australia', flag: '🇦🇺', code: 'AU', population: 25700000 },
  { name: 'India', flag: '🇮🇳', code: 'IN', population: 1380000000 },
  { name: 'Russia', flag: '🇷🇺', code: 'RU', population: 146000000 },
  { name: 'Mexico', flag: '🇲🇽', code: 'MX', population: 128900000 },
  { name: 'South Korea', flag: '🇰🇷', code: 'KR', population: 51800000 },
  { name: 'Netherlands', flag: '🇳🇱', code: 'NL', population: 17400000 },
  { name: 'Sweden', flag: '🇸🇪', code: 'SE', population: 10400000 },
  { name: 'Norway', flag: '🇳🇴', code: 'NO', population: 5400000 },
  { name: 'Switzerland', flag: '🇨🇭', code: 'CH', population: 8700000 },
  { name: 'Argentina', flag: '🇦🇷', code: 'AR', population: 45400000 },
  { name: 'South Africa', flag: '🇿🇦', code: 'ZA', population: 60400000 },
  { name: 'Egypt', flag: '🇪🇬', code: 'EG', population: 104000000 },
  { name: 'Turkey', flag: '🇹🇷', code: 'TR', population: 84300000 },
  { name: 'Greece', flag: '🇬🇷', code: 'GR', population: 10700000 },
  { name: 'Portugal', flag: '🇵🇹', code: 'PT', population: 10300000 },
  { name: 'Belgium', flag: '🇧🇪', code: 'BE', population: 11600000 },
  { name: 'Denmark', flag: '🇩🇰', code: 'DK', population: 5800000 },
  { name: 'Finland', flag: '🇫🇮', code: 'FI', population: 5500000 },
  { name: 'Poland', flag: '🇵🇱', code: 'PL', population: 38000000 },
  { name: 'Thailand', flag: '🇹🇭', code: 'TH', population: 70000000 }
];

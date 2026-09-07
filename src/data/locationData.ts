// ============================================================================
// AI CAREER OS — GEOGRAPHIC LOCATION DATA REFERENCE & NORMALIZATION ENGINE
// Structured Countries, States, Cities, Abbreviations, and Location Matching
// ============================================================================

export interface CountryLocationData {
  country: string;
  code: string;
  states: string[];
}

export const COUNTRY_LOCATION_DATA: CountryLocationData[] = [
  {
    country: 'India',
    code: 'IN',
    states: [
      'Andhra Pradesh',
      'Telangana',
      'Karnataka',
      'Tamil Nadu',
      'Maharashtra',
      'Delhi NCR',
      'Gujarat',
      'West Bengal',
      'Kerala',
      'Punjab',
      'Haryana',
      'Rajasthan',
      'Uttar Pradesh',
      'Madhya Pradesh',
      'Odisha',
      'Bihar',
      'Assam',
      'Jharkhand',
      'Goa',
      'Uttarakhand'
    ]
  },
  {
    country: 'United States',
    code: 'US',
    states: [
      'California',
      'Texas',
      'New York',
      'Washington',
      'Florida',
      'Illinois',
      'Massachusetts',
      'North Carolina',
      'Virginia',
      'Georgia',
      'Colorado',
      'Pennsylvania',
      'Ohio',
      'Michigan',
      'New Jersey',
      'Arizona',
      'Oregon',
      'Minnesota',
      'Maryland',
      'Utah'
    ]
  },
  {
    country: 'Canada',
    code: 'CA',
    states: [
      'Ontario',
      'British Columbia',
      'Quebec',
      'Alberta',
      'Manitoba',
      'Saskatchewan',
      'Nova Scotia',
      'New Brunswick'
    ]
  },
  {
    country: 'United Kingdom',
    code: 'GB',
    states: [
      'England',
      'Scotland',
      'Wales',
      'Northern Ireland',
      'Greater London'
    ]
  },
  {
    country: 'Australia',
    code: 'AU',
    states: [
      'New South Wales',
      'Victoria',
      'Queensland',
      'Western Australia',
      'South Australia',
      'Australian Capital Territory',
      'Tasmania'
    ]
  },
  {
    country: 'Germany',
    code: 'DE',
    states: [
      'Bavaria',
      'Berlin',
      'North Rhine-Westphalia',
      'Baden-Württemberg',
      'Hesse',
      'Saxony',
      'Hamburg'
    ]
  },
  {
    country: 'Singapore',
    code: 'SG',
    states: ['Singapore Central', 'Singapore North', 'Singapore East', 'Singapore West']
  },
  {
    country: 'United Arab Emirates',
    code: 'AE',
    states: ['Dubai', 'Abu Dhabi', 'Sharjah']
  }
];

export const STATE_CITIES_MAP: Record<string, string[]> = {
  'Andhra Pradesh': ['Visakhapatnam', 'Vijayawada', 'Kakinada', 'Guntur', 'Tirupati', 'Rajahmundry', 'Nellore', 'Kurnool', 'Anantapur'],
  'Telangana': ['Hyderabad', 'Warangal', 'Nizamabad', 'Karimnagar', 'Khammam'],
  'Karnataka': ['Bengaluru', 'Mysuru', 'Mangaluru', 'Hubballi', 'Belagavi'],
  'Tamil Nadu': ['Chennai', 'Coimbatore', 'Madurai', 'Tiruchirappalli', 'Salem'],
  'Maharashtra': ['Mumbai', 'Pune', 'Nagpur', 'Nashik', 'Thane', 'Navi Mumbai'],
  'Delhi NCR': ['Delhi', 'Noida', 'Gurugram', 'Faridabad', 'Ghaziabad'],
  'California': ['San Francisco', 'Los Angeles', 'San Jose', 'San Diego', 'Sacramento', 'Oakland', 'Palo Alto', 'Mountain View', 'Sunnyvale', 'Cupertino'],
  'New York': ['New York City', 'Buffalo', 'Rochester', 'Albany', 'Syracuse'],
  'Texas': ['Austin', 'Houston', 'Dallas', 'San Antonio', 'Fort Worth'],
  'Washington': ['Seattle', 'Bellevue', 'Redmond', 'Tacoma', 'Spokane'],
  'Ontario': ['Toronto', 'Ottawa', 'Mississauga', 'Waterloo', 'Hamilton'],
  'British Columbia': ['Vancouver', 'Victoria', 'Burnaby', 'Surrey'],
  'England': ['London', 'Manchester', 'Birmingham', 'Leeds', 'Bristol', 'Cambridge', 'Oxford'],
  'Greater London': ['London', 'Westminster', 'City of London'],
  'New South Wales': ['Sydney', 'Newcastle', 'Wollongong'],
  'Victoria': ['Melbourne', 'Geelong', 'Ballarat'],
  'Bavaria': ['Munich', 'Nuremberg', 'Augsburg'],
  'Berlin': ['Berlin'],
  'Dubai': ['Dubai'],
  'Abu Dhabi': ['Abu Dhabi'],
  'Singapore Central': ['Singapore']
};

// Country Code Normalization Map
export const COUNTRY_CODE_MAP: Record<string, string> = {
  'india': 'in',
  'in': 'india',
  'ind': 'india',
  'united states': 'us',
  'us': 'united states',
  'usa': 'united states',
  'united kingdom': 'gb',
  'gb': 'united kingdom',
  'uk': 'united kingdom',
  'canada': 'ca',
  'ca': 'canada',
  'can': 'canada',
  'australia': 'au',
  'au': 'australia',
  'aus': 'australia',
  'germany': 'de',
  'de': 'germany',
  'deu': 'germany',
  'singapore': 'sg',
  'sg': 'singapore',
  'sgp': 'singapore',
  'united arab emirates': 'ae',
  'ae': 'united arab emirates',
  'uae': 'united arab emirates'
};

// State Abbreviations Normalization Map
export const STATE_ABBREVIATIONS: Record<string, string> = {
  'andhra pradesh': 'ap',
  'ap': 'andhra pradesh',
  'telangana': 'ts',
  'ts': 'telangana',
  'karnataka': 'ka',
  'ka': 'karnataka',
  'tamil nadu': 'tn',
  'tn': 'tamil nadu',
  'maharashtra': 'mh',
  'mh': 'maharashtra',
  'california': 'ca',
  'ca': 'california',
  'new york': 'ny',
  'ny': 'new york',
  'texas': 'tx',
  'tx': 'texas',
  'washington': 'wa',
  'wa': 'washington',
  'florida': 'fl',
  'fl': 'florida',
  'illinois': 'il',
  'il': 'illinois',
  'ontario': 'on',
  'on': 'ontario',
  'british columbia': 'bc',
  'bc': 'british columbia',
  'new south wales': 'nsw',
  'nsw': 'new south wales',
  'victoria': 'vic',
  'vic': 'victoria'
};

export function getStatesForCountry(countryName: string): string[] {
  if (!countryName) return [];
  const found = COUNTRY_LOCATION_DATA.find(
    c => c.country.toLowerCase() === countryName.trim().toLowerCase()
  );
  return found ? found.states : [];
}

export function getCitiesForState(countryName: string, stateName: string): string[] {
  if (!stateName) return [];
  const cities = STATE_CITIES_MAP[stateName];
  if (cities && cities.length > 0) return cities;
  return [];
}

/**
 * Robust, generic location matching comparator supporting case-insensitivity,
 * punctuation stripping, state/country abbreviations, and city verification.
 */
export function isLocationMatching(
  rawCity: string,
  rawState: string,
  rawCountry: string,
  rawFullLocation: string,
  targetCity?: string,
  targetState?: string,
  targetCountry?: string
): boolean {
  if (!targetCountry && !targetState && !targetCity) return true;

  const cityNorm = (rawCity || '').toLowerCase().trim();
  const stateNorm = (rawState || '').toLowerCase().trim();
  const countryNorm = (rawCountry || '').toLowerCase().trim();
  const fullNorm = (rawFullLocation || '').toLowerCase().trim();
  const combined = `${cityNorm} ${stateNorm} ${countryNorm} ${fullNorm}`;

  // 1. Country Check
  if (targetCountry && targetCountry.trim()) {
    const tCountry = targetCountry.trim().toLowerCase();
    const altCode = COUNTRY_CODE_MAP[tCountry] || '';

    const matchesCountry =
      combined.includes(tCountry) ||
      (altCode && combined.includes(altCode)) ||
      countryNorm === tCountry ||
      countryNorm === altCode;

    // If country is specified in API and clearly conflicts (e.g. US vs India)
    if (countryNorm && countryNorm !== tCountry && countryNorm !== altCode && !matchesCountry) {
      return false;
    }
  }

  // 2. State Check
  if (targetState && targetState.trim()) {
    const tState = targetState.trim().toLowerCase();
    const tStateAbbr = STATE_ABBREVIATIONS[tState] || '';

    const matchesState =
      combined.includes(tState) ||
      (tStateAbbr && (combined.includes(` ${tStateAbbr} `) || combined.endsWith(` ${tStateAbbr}`) || combined.includes(`, ${tStateAbbr}`) || stateNorm === tStateAbbr));

    // If raw state exists and conflicts with target state
    if (stateNorm && stateNorm !== tState && stateNorm !== tStateAbbr && !matchesState) {
      if (isConflictingState(stateNorm, tState)) {
        return false;
      }
    }
  }

  // 3. City Check
  if (targetCity && targetCity.trim()) {
    const tCity = targetCity.trim().toLowerCase();

    const matchesCity =
      combined.includes(tCity) ||
      cityNorm.includes(tCity) ||
      tCity.includes(cityNorm);

    if (cityNorm && !matchesCity) {
      if (isConflictingMajorCity(cityNorm, tCity)) {
        return false;
      }
    }
  }

  return true;
}

function isConflictingState(rawStateNorm: string, targetStateNorm: string): boolean {
  const rawAbbr = STATE_ABBREVIATIONS[rawStateNorm] || rawStateNorm;
  const targetAbbr = STATE_ABBREVIATIONS[targetStateNorm] || targetStateNorm;
  return rawAbbr !== targetAbbr && rawStateNorm !== targetStateNorm;
}

function isConflictingMajorCity(rawCityNorm: string, targetCityNorm: string): boolean {
  if (!rawCityNorm || !targetCityNorm) return false;
  if (rawCityNorm === targetCityNorm || rawCityNorm.includes(targetCityNorm) || targetCityNorm.includes(rawCityNorm)) {
    return false;
  }

  // Known major distinct cities that should not be cross-matched
  const distinctCities = [
    'hyderabad', 'visakhapatnam', 'vijayawada', 'bengaluru', 'mumbai', 'pune',
    'chennai', 'delhi', 'san francisco', 'los angeles', 'new york', 'seattle',
    'austin', 'london', 'toronto', 'vancouver', 'sydney', 'melbourne'
  ];

  return distinctCities.includes(rawCityNorm) && distinctCities.includes(targetCityNorm);
}

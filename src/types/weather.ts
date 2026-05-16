export interface WeatherData {
  city: string;
  country: string;
  coordinates: {
    lat: number;
    lon: number;
  };
  current: CurrentWeather;
  hourly: HourlyForecast[];
  daily: DailyForecast[];
  alerts: WeatherAlert[];
  airQuality: AirQuality;
}

export interface CurrentWeather {
  temp: number;
  feelsLike: number;
  tempMin: number;
  tempMax: number;
  humidity: number;
  windSpeed: number;
  windDirection: number;
  windGust: number;
  pressure: number;
  visibility: number;
  uvIndex: number;
  condition: string;
  description: string;
  icon: string;
  sunrise: number;
  sunset: number;
  clouds: number;
  dewPoint: number;
}

export interface HourlyForecast {
  dt: number;
  temp: number;
  feelsLike: number;
  condition: string;
  icon: string;
  pop: number; // probability of precipitation
  humidity: number;
  windSpeed: number;
}

export interface DailyForecast {
  dt: number;
  temp: {
    min: number;
    max: number;
    day: number;
    night: number;
    eve: number;
    morn: number;
  };
  feelsLike: {
    day: number;
    night: number;
    eve: number;
    morn: number;
  };
  condition: string;
  description: string;
  icon: string;
  sunrise: number;
  sunset: number;
  humidity: number;
  windSpeed: number;
  pop: number;
  pressure: number;
  clouds: number;
  uvIndex: number;
}

export interface WeatherAlert {
  senderName: string;
  event: string;
  start: number;
  end: number;
  description: string;
  severity: 'minor' | 'moderate' | 'severe' | 'extreme';
}

export interface AirQuality {
  aqi: number;
  components: {
    co: number;
    no: number;
    no2: number;
    o3: number;
    so2: number;
    pm2_5: number;
    pm10: number;
    nh3: number;
  };
}

export interface CitySearchResult {
  name: string;
  country: string;
  state?: string;
  lat: number;
  lon: number;
}

export type WeatherCondition =
  | 'clear'
  | 'cloudy'
  | 'rain'
  | 'drizzle'
  | 'thunderstorm'
  | 'snow'
  | 'mist'
  | 'fog'
  | 'haze'
  | 'dust'
  | 'tornado'
  | 'squall';

export type TemperatureUnit = 'celsius' | 'fahrenheit';

export interface FavoriteCity {
  name: string;
  country: string;
  lat: number;
  lon: number;
  addedAt: number;
}

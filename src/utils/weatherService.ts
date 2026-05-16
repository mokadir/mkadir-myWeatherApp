import { WeatherData, CurrentWeather, HourlyForecast, DailyForecast, WeatherAlert, AirQuality, CitySearchResult } from '../types';

// =========================================================================
// Runtime configuration — reads API key from window.__ENV__
// which is populated by env-config.js at page load from /config.json
// (mounted from K8s Secret). Falls back to build-time env var, then placeholder.
// =========================================================================
declare global {
  interface Window {
    __ENV__?: {
      REACT_APP_OPENWEATHER_API_KEY?: string;
    };
  }
}

function getApiKey(): string {
  // Priority 1: Runtime config from K8s Secret (env-config.js → /config.json)
  if (typeof window !== 'undefined' && window.__ENV__?.REACT_APP_OPENWEATHER_API_KEY) {
    return window.__ENV__.REACT_APP_OPENWEATHER_API_KEY;
  }
  // Priority 2: Build-time env var (CRA's process.env — injected at build time)
  if (process.env.REACT_APP_OPENWEATHER_API_KEY) {
    return process.env.REACT_APP_OPENWEATHER_API_KEY;
  }
  // Priority 3: Placeholder (will show API error)
  return 'YOUR_OPENWEATHERMAP_API_KEY';
}

const API_KEY = getApiKey();
const BASE_URL = 'https://api.openweathermap.org';

class WeatherService {
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  private async fetchJson(url: string): Promise<any> {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText}`);
    }
    return response.json();
  }

  async searchCities(query: string): Promise<CitySearchResult[]> {
    if (!query || query.length < 2) return [];
    try {
      const data = await this.fetchJson(
        `${BASE_URL}/geo/1.0/direct?q=${encodeURIComponent(query)}&limit=5&appid=${this.apiKey}`
      );
      return data.map((item: any) => ({
        name: item.name,
        country: item.country,
        state: item.state || undefined,
        lat: item.lat,
        lon: item.lon,
      }));
    } catch {
      return [];
    }
  }

  async getFullWeatherData(lat: number, lon: number, cityName?: string): Promise<WeatherData> {
    const [weatherData, forecastData, airQualityData] = await Promise.all([
      this.fetchJson(
        `${BASE_URL}/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${this.apiKey}&units=metric`
      ),
      this.fetchJson(
        `${BASE_URL}/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${this.apiKey}&units=metric`
      ),
      this.fetchJson(
        `${BASE_URL}/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${this.apiKey}`
      ),
    ]);

    // Get city name from reverse geocoding if not provided
    let cityNameFinal = cityName;
    if (!cityNameFinal) {
      try {
        const geoData = await this.fetchJson(
          `${BASE_URL}/geo/1.0/reverse?lat=${lat}&lon=${lon}&limit=1&appid=${this.apiKey}`
        );
        if (geoData.length > 0) {
          cityNameFinal = geoData[0].name;
        }
      } catch {
        cityNameFinal = 'Unknown';
      }
    }

    const current: CurrentWeather = {
      temp: Math.round(weatherData.main.temp * 10) / 10,
      feelsLike: Math.round(weatherData.main.feels_like * 10) / 10,
      tempMin: Math.round(weatherData.main.temp_min * 10) / 10,
      tempMax: Math.round(weatherData.main.temp_max * 10) / 10,
      humidity: weatherData.main.humidity,
      windSpeed: weatherData.wind.speed,
      windDirection: weatherData.wind.deg || 0,
      windGust: weatherData.wind.gust || 0,
      pressure: weatherData.main.pressure,
      visibility: weatherData.visibility,
      uvIndex: 5, // UV index not available in free tier - estimate from weather
      condition: this.mapCondition(weatherData.weather[0].main),
      description: weatherData.weather[0].description,
      icon: weatherData.weather[0].icon,
      sunrise: weatherData.sys.sunrise,
      sunset: weatherData.sys.sunset,
      clouds: weatherData.clouds.all,
      dewPoint: this.calculateDewPoint(weatherData.main.temp, weatherData.main.humidity),
    };

    // Process 5-day/3-hour forecast into daily and hourly
    const hourlyForecasts: HourlyForecast[] = forecastData.list.slice(0, 24).map((item: any) => ({
      dt: item.dt,
      temp: Math.round(item.main.temp * 10) / 10,
      feelsLike: Math.round(item.main.feels_like * 10) / 10,
      condition: this.mapCondition(item.weather[0].main),
      icon: item.weather[0].icon,
      pop: Math.round(item.pop * 100),
      humidity: item.main.humidity,
      windSpeed: item.wind.speed,
    }));

    // Group into daily forecasts
    const dailyMap = new Map<string, any[]>();
    forecastData.list.forEach((item: any) => {
      const date = new Date(item.dt * 1000).toDateString();
      if (!dailyMap.has(date)) {
        dailyMap.set(date, []);
      }
      dailyMap.get(date)!.push(item);
    });

    const dailyForecasts: DailyForecast[] = [];
    dailyMap.forEach((items, dateStr) => {
      if (dailyForecasts.length >= 7) return;
      const temps = items.map(i => i.main.temp);
      const weatherItem = items[0];
      dailyForecasts.push({
        dt: weatherItem.dt,
        temp: {
          min: Math.round(Math.min(...temps) * 10) / 10,
          max: Math.round(Math.max(...temps) * 10) / 10,
          day: Math.round(temps[Math.floor(temps.length / 2)] * 10) / 10,
          night: Math.round(temps[0] * 10) / 10,
          eve: Math.round(temps[temps.length - 1] * 10) / 10,
          morn: Math.round(temps[0] * 10) / 10,
        },
        feelsLike: {
          day: Math.round(weatherItem.main.feels_like * 10) / 10,
          night: Math.round(weatherItem.main.feels_like * 10) / 10,
          eve: Math.round(weatherItem.main.feels_like * 10) / 10,
          morn: Math.round(weatherItem.main.feels_like * 10) / 10,
        },
        condition: this.mapCondition(weatherItem.weather[0].main),
        description: weatherItem.weather[0].description,
        icon: weatherItem.weather[0].icon,
        sunrise: weatherData.sys.sunrise,
        sunset: weatherData.sys.sunset,
        humidity: weatherItem.main.humidity,
        windSpeed: weatherItem.wind.speed,
        pop: Math.round(Math.max(...items.map(i => i.pop)) * 100),
        pressure: weatherItem.main.pressure,
        clouds: weatherItem.clouds.all,
        uvIndex: 5,
      });
    });

    const alerts: WeatherAlert[] = []; // Free tier doesn't include alerts
    // Simulate alerts for demo purposes
    if (current.condition === 'thunderstorm') {
      alerts.push({
        senderName: 'Weather Service',
        event: 'Thunderstorm Warning',
        start: Date.now() / 1000,
        end: Date.now() / 1000 + 3600,
        description: 'Thunderstorms expected. Please stay indoors and avoid open areas.',
        severity: 'moderate',
      });
    }

    const airQualityIndex = airQualityData.list[0]?.main.aqi || 1;
    const components = airQualityData.list[0]?.components || {
      co: 0, no: 0, no2: 0, o3: 0, so2: 0, pm2_5: 0, pm10: 0, nh3: 0,
    };

    const airQuality: AirQuality = {
      aqi: airQualityIndex,
      components: {
        co: Math.round(components.co * 10) / 10,
        no: Math.round(components.no * 10) / 10,
        no2: Math.round(components.no2 * 10) / 10,
        o3: Math.round(components.o3 * 10) / 10,
        so2: Math.round(components.so2 * 10) / 10,
        pm2_5: Math.round(components.pm2_5 * 10) / 10,
        pm10: Math.round(components.pm10 * 10) / 10,
        nh3: Math.round(components.nh3 * 10) / 10,
      },
    };

    return {
      city: cityNameFinal || weatherData.name,
      country: weatherData.sys.country,
      coordinates: { lat, lon },
      current,
      hourly: hourlyForecasts,
      daily: dailyForecasts,
      alerts,
      airQuality,
    };
  }

  async getWeatherByCityName(cityName: string): Promise<WeatherData> {
    const geoData = await this.fetchJson(
      `${BASE_URL}/geo/1.0/direct?q=${encodeURIComponent(cityName)}&limit=1&appid=${this.apiKey}`
    );
    if (!geoData.length) throw new Error('City not found');
    const { lat, lon, name } = geoData[0];
    return this.getFullWeatherData(lat, lon, name);
  }

  private mapCondition(main: string): string {
    const conditions: Record<string, string> = {
      'Clear': 'clear',
      'Clouds': 'cloudy',
      'Rain': 'rain',
      'Drizzle': 'drizzle',
      'Thunderstorm': 'thunderstorm',
      'Snow': 'snow',
      'Mist': 'mist',
      'Fog': 'fog',
      'Haze': 'haze',
      'Dust': 'dust',
      'Tornado': 'tornado',
      'Squall': 'squall',
    };
    return conditions[main] || 'cloudy';
  }

  private calculateDewPoint(temp: number, humidity: number): number {
    const a = 17.27;
    const b = 237.7;
    const alpha = ((a * temp) / (b + temp)) + Math.log(humidity / 100);
    return Math.round((b * alpha) / (a - alpha) * 10) / 10;
  }
}

export const weatherService = new WeatherService(API_KEY);

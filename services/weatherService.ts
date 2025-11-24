
import type { WeatherData, LocationPreference } from '../types';

/**
 * バックエンドAPI (/api/weather) から天気データを取得します。
 * APIキーはバックエンド側で管理されるため、フロントエンドには露出させません。
 */
export const fetchWeather = async (params: LocationPreference): Promise<WeatherData> => {
  let url = '/api/weather?';

  if (params.method === 'auto' && params.lat !== undefined && params.lon !== undefined) {
    // 緯度経度による自動取得
    url += `lat=${params.lat}&lon=${params.lon}`;
  } else if (params.method === 'manual' && params.zip) {
    // 郵便番号による手動取得 (国コードJPは固定)
    url += `zip=${params.zip}&country=JP`;
  } else {
    throw new Error("位置情報パラメータが不足しています。");
  }

  try {
    const response = await fetch(url);
    
    if (!response.ok) {
        throw new Error(`Weather API Error: ${response.status} ${response.statusText}`);
    }

    const data: WeatherData = await response.json();
    return data;
  } catch (error) {
    console.error("Failed to fetch weather:", error);
    throw error;
  }
};

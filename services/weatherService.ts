import type { WeatherData, LocationPreference } from '../types';

/**
 * ダミーの天気データを作成する関数
 * (テスト用：通信せずに成功したフリをする)
 */
const getMockWeather = (): WeatherData => {
  const mockData: WeatherData = {
    condition: 'sun',
    temp_c: 22.5,
    message: 'これはテスト用のデータです。表示されていますか？',
    updated_at: new Date().toISOString(),
    // もし types.ts に他にも必須項目があれば、ここに追加が必要です
  } as WeatherData;

  return mockData;
};

/**
 * 天気データを取得する関数（現在はテストモード）
 */
export const fetchWeather = async (params: LocationPreference): Promise<WeatherData> => {
  
  // 1. ログを出して確認
  console.log("【テストモード】通信を開始します...", params);

  try {
    // 2. 通信している雰囲気を出すために0.5秒待つ
    await new Promise(resolve => setTimeout(resolve, 500));

    // 3. ダミーデータを取得
    const data = getMockWeather();

    console.log("【テストモード】データ取得成功:", data);

    // 4. データを返す
    return data;

  } catch (error) {
    console.error("エラーが発生しました:", error);
    throw error;
  }
};
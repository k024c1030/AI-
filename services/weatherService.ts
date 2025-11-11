import type { WeatherData, LocationPreference } from '../types';

// これは、/api/weatherへのバックエンドAPI呼び出しをシミュレートするためのモックサービスです。
// 実際のアプリケーションでは、これはPythonバックエンドへのfetch()呼び出しになります。
// その後、バックエンドは秘密鍵を使用してOpenWeatherMap APIを呼び出します。
// TODO: バックエンドが完成したら、このモックを実際の `fetch` 呼び出しに置き換えてください。

const MOCK_WEATHER_DATA: Record<string, WeatherData> = {
  sunny: {
    icon: '01d',
    temp_c: 25,
    description: '快晴',
    message: '良い天気！ちょっと散歩でもしてみる？',
    fetched_at: new Date().toISOString(),
  },
  cloudy: {
    icon: '04d',
    temp_c: 18,
    description: '曇り',
    message: '曇りだけど、心は晴れやかにいこう。',
    fetched_at: new Date().toISOString(),
  },
  rainy: {
    icon: '10d',
    temp_c: 15,
    description: '雨',
    message: '雨の日はゆっくりしよ。温かいものでも飲もう。',
    fetched_at: new Date().toISOString(),
  },
};

export const fetchWeather = async (params: LocationPreference): Promise<WeatherData> => {
  console.log("Fetching weather for:", params);

  // ネットワークの遅延をシミュレート
  await new Promise(resolve => setTimeout(resolve, 800));

  // ランダムにAPIの失敗をシミュレート
  if (Math.random() < 0.1) {
    throw new Error("Failed to fetch weather data.");
  }
  
  // 実際のアプリではlat/lon/qを使ってデータを取得します。ここではモックを循環させるだけです。
  const weatherTypes = Object.keys(MOCK_WEATHER_DATA);
  const randomWeather = weatherTypes[Math.floor(Math.random() * weatherTypes.length)];
  
  const weatherData = MOCK_WEATHER_DATA[randomWeather];

  // 場所名が提供されていればそれを使用し、なければデフォルト値を使用
  const locationName = params.name || (params.query ? params.query : "あなたの場所");

  return {
      ...weatherData,
      description: `${locationName}は${weatherData.description}`, // 説明に場所を追加
      fetched_at: new Date().toISOString(),
  };
};

import type { WeatherData, LocationPreference } from '../types';

// これは、/api/weatherへのバックエンドAPI呼び出しをシミュレートするためのモックサービスです。
// 実際のアプリケーションでは、これはPythonバックエンドへのfetch()呼び出しになります。
// その後、バックエンドは秘密鍵を使用してOpenWeatherMap APIを呼び出します。
// TODO: バックエンドが完成したら、このモックを実際の `fetch` 呼び出しに置き換えてください。

const weatherConditions: Omit<WeatherData, 'temp_c' | 'feels_like_c' | 'fetched_at' | 'description'>[] = [
    { icon: 'sun', message: '今日は良い天気！肩の力抜こう', code: 800, ttl_seconds: 7200 },
    { icon: 'cloud', message: '曇り空でも、ペースは自分で', code: 803, ttl_seconds: 7200 },
    { icon: 'cloud', message: '気張っていこう。とりあえず深呼吸', code: 804, ttl_seconds: 7200 },
    { icon: 'rain', message: '今日１日は無理はしないで', code: 501, ttl_seconds: 7200 },
    { icon: 'storm', message: '安全第一で、今日はゆっくり', code: 211, ttl_seconds: 7200 },
    { icon: 'snow', message: 'あったかくしてね、足元注意', code: 601, ttl_seconds: 7200 },
    { icon: 'fog', message: '視界ぼんやり、予定もゆるっと', code: 741, ttl_seconds: 7200 },
    { icon: 'wind', message: '風強め。移動は余裕をもって', code: 771, ttl_seconds: 7200 },
    { icon: 'hot', message: 'こまめに水分、自分を労わろう', code: 904, ttl_seconds: 7200 },
    { icon: 'cold', message: '冷え込み注意。小さな温かさを', code: 903, ttl_seconds: 7200 },
];

const descriptionMap: Record<string, string> = {
    sun: '快晴',
    cloud: '曇り',
    rain: '雨',
    storm: '雷雨',
    snow: '雪',
    fog: '霧',
    wind: '強風',
    hot: '猛暑',
    cold: '寒い',
};


export const fetchWeather = async (params: LocationPreference): Promise<WeatherData> => {
  console.log("Fetching weather for:", params);

  // ネットワークの遅延をシミュレート
  await new Promise(resolve => setTimeout(resolve, 800));

  // ランダムにAPIの失敗をシミュレート
  if (Math.random() < 0.1) {
    throw new Error("Failed to fetch weather data.");
  }
  
  const randomCondition = weatherConditions[Math.floor(Math.random() * weatherConditions.length)];
  const temp = randomCondition.icon === 'hot' ? 32 : randomCondition.icon === 'cold' ? 5 : 15 + Math.random() * 10;
  
  const locationName = params.name || (params.query ? params.query : "あなたの場所");

  return {
      ...randomCondition,
      temp_c: Math.round(temp),
      feels_like_c: Math.round(temp - 2 + Math.random() * 4),
      description: `${locationName}は${descriptionMap[randomCondition.icon]}`,
      fetched_at: new Date().toISOString(),
  };
};
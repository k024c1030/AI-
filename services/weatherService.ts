import type { WeatherData, LocationPreference } from '../types';

// ダミーの天気データを作成する関数
const getMockWeather = (): WeatherData => {
  const mockData: WeatherData = = {
    condition: 'sun',
    temp_c: 22.5,
    message: '素晴らしい天気です！散歩日和ですね。',
    updated_at: new Date().toISOString(),
    //ほかに必要な項目があれば追加
  }as WeatherData;
  return mockData; //作ったデータを返す
};

export const fetchWeather = async (params: LocationPreference): Promise<WeatherData> => {
  //ログを出して動いてるか確認する。
  console.log("[テストモード]天気データを取得したフリをします...", params);

  try {
  //通信してる雰囲気を出すための0.5秒待ち
  await new Promise(resolve => setTimeout(resolve, 500));

  //ダミーデータを取得
  const data = getMockWeather();

  //ログを出します
  console.log("[テストモード]データ取得成功", data);

  //データを画面に出す
  return data;
  } catch (error) {

    //もしエラーが起きたらここに飛ぶ
    console.error("エラーが発生しました:", error);
    throw error;
  }
};
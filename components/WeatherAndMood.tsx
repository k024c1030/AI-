import React, { useState, useEffect, useCallback } from 'react';
import type { LocationPreference, WeatherData, MoodRecord } from '../types';
import { fetchWeather } from '../services/weatherService';
import ManualLocationModal from './ManualLocationModal';
import MoodPickerModal from './MoodPickerModal';

const LOCATION_PREF_KEY = 'locationPreference';

interface WeatherAndMoodProps {
    moodHistory: MoodRecord[];
    onSaveMood: (record: MoodRecord) => void;
}

const WeatherAndMood: React.FC<WeatherAndMoodProps> = ({ moodHistory, onSaveMood }) => {
    const [locationPref, setLocationPref] = useState<LocationPreference | null>(null);
    const [weather, setWeather] = useState<WeatherData | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [showManualModal, setShowManualModal] = useState(false);
    const [showMoodModal, setShowMoodModal] = useState(false);

    const today = new Date().toISOString().split('T')[0];
    const todaysMood = moodHistory.find(m => m.date === today);

    // 初回レンダリング時にlocalStorageから位置情報設定を読み込む
    useEffect(() => {
        try {
            const savedPref = localStorage.getItem(LOCATION_PREF_KEY);
            if (savedPref) {
                setLocationPref(JSON.parse(savedPref));
            }
        } catch (e) {
            console.error("Failed to parse location preference", e);
        }
    }, []);

    const saveLocationPref = (pref: LocationPreference) => {
        setLocationPref(pref);
        localStorage.setItem(LOCATION_PREF_KEY, JSON.stringify(pref));
    };

    const getWeatherData = useCallback(async (pref: LocationPreference) => {
        setIsLoading(true);
        setError(null);
        try {
            const data = await fetchWeather(pref);
            setWeather(data);
        } catch (err) {
            setError('天気の取得に失敗しました。');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    }, []);

    // 位置情報設定が利用可能または変更されたときに天気を取得
    useEffect(() => {
        if (locationPref) {
            getWeatherData(locationPref);
        }
    }, [locationPref, getWeatherData]);

    const handleAllowLocation = () => {
        setIsLoading(true);
        setError(null);
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                // 実際のアプリでは、逆ジオコーディングAPIを使用して都市名を取得することがあります
                const pref: LocationPreference = { method: 'auto', lat: latitude, lon: longitude, name: '現在地' };
                saveLocationPref(pref);
            },
            (err) => {
                setError('位置情報の取得に失敗しました。手動で設定してください。');
                console.error(err);
                setIsLoading(false);
            },
            { enableHighAccuracy: false, timeout: 8000, maximumAge: 600000 } // 10 minutes
        );
    };

    const handleSaveManualLocation = (query: string, name: string) => {
        // 実際のアプリでは、バックエンドがジオコーディングを処理します。ここではクエリを保存するだけです。
        const pref: LocationPreference = { method: 'manual', query, name };
        saveLocationPref(pref);
        setShowManualModal(false);
    };
    
    const handleResetLocation = () => {
        setLocationPref(null);
        setWeather(null); // 表示されている天気情報もクリア
        setError(null);
        localStorage.removeItem(LOCATION_PREF_KEY);
    };

    const renderWeatherContent = () => {
        if (isLoading) {
            return <p className="text-slate-500 text-sm">天気情報を取得中...</p>;
        }
        if (error) {
            return (
                <div>
                    <p className="text-red-500 text-sm">{error}</p>
                    <button onClick={() => locationPref && getWeatherData(locationPref)} className="text-xs text-blue-500 hover:underline">再試行</button>
                </div>
            );
        }
        if (weather) {
            const fetchedDate = new Date(weather.fetched_at);
            const timeString = fetchedDate.toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit' });
            return (
                <div className="text-left w-full">
                    <div className="flex items-center gap-2">
                         <img src={`https://openweathermap.org/img/wn/${weather.icon}@2x.png`} alt={weather.description} className="w-12 h-12" />
                         <div>
                            <div className="flex items-baseline gap-2">
                                <p className="font-bold text-2xl text-slate-700">{Math.round(weather.temp_c)}°C</p>
                                <p className="text-[10px] text-slate-400">({timeString}取得)</p>
                            </div>
                            <p className="text-xs text-slate-500">{weather.description}</p>
                         </div>
                    </div>
                    <p className="text-xs text-slate-600 mt-1">{weather.message}</p>
                    <div className="text-right mt-1">
                        <button onClick={handleResetLocation} className="text-xs text-slate-500 hover:text-slate-700 hover:underline">
                            再設定する
                        </button>
                    </div>
                </div>
            );
        }
        // 位置情報が未設定の場合、設定を促すカードを表示
        return (
             <div className="text-center p-4">
                <p className="text-sm font-semibold text-slate-700 mb-2">天気表示のため位置情報を設定</p>
                <div className="flex gap-2 justify-center">
                    <button onClick={handleAllowLocation} className="text-xs px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600">はい (推奨)</button>
                    <button onClick={() => setShowManualModal(true)} className="text-xs px-3 py-1 bg-slate-200 rounded-md hover:bg-slate-300">手動で設定</button>
                </div>
            </div>
        );
    };

    const renderMoodContent = () => {
        return (
            <div className="text-center p-2 cursor-pointer h-full flex flex-col justify-center" onClick={() => setShowMoodModal(true)} role="button" aria-label="今日の状態を選択する">
                <p className="text-sm font-semibold text-slate-700 mb-1">今日の状態</p>
                {todaysMood ? (
                    <div>
                        <span className="text-4xl">{todaysMood.emoji}</span>
                        <p className="font-bold text-slate-700">{todaysMood.score > 0 ? '+' : ''}{todaysMood.score}</p>
                    </div>
                ) : (
                    <div>
                         <span className="text-4xl">🙂</span>
                        <p className="font-bold text-slate-400">
                        <span className="text-sm font-normal"> (タップで選択)</span></p>
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className="w-full max-w-2xl mb-8 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white/70 backdrop-blur-sm p-4 rounded-xl shadow-md border border-slate-200 flex items-center justify-center min-h-[120px]">
                {renderWeatherContent()}
            </div>
             <div className="bg-white/70 backdrop-blur-sm p-4 rounded-xl shadow-md border border-slate-200 flex items-center justify-center min-h-[120px]">
                {renderMoodContent()}
            </div>
            {showManualModal && <ManualLocationModal onClose={() => setShowManualModal(false)} onSave={handleSaveManualLocation} />}
            {showMoodModal && <MoodPickerModal onClose={() => setShowMoodModal(false)} onSave={onSaveMood} moodHistory={moodHistory} />}
        </div>
    );
};

export default WeatherAndMood;
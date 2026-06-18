import { useState, useEffect } from 'react';
import { CloudSun, Thermometer, Wind, Droplets, Eye, AlertTriangle, CheckCircle, AlertOctagon } from 'lucide-react';

const cities = [
  { name: 'Passo Fundo', lat: -28.2628, lng: -52.4067 },
  { name: 'Marau', lat: -28.4494, lng: -52.1986 },
];

const fallback = [
  { temperature: 24, windSpeed: 12, precipitation: 0, visibility: 10000, weatherCode: 0 },
  { temperature: 22, windSpeed: 8, precipitation: 0, visibility: 12000, weatherCode: 0 },
];

function getWeatherDesc(code) {
  if (code === 0) return 'Ceu limpo';
  if (code <= 3) return 'Parcialmente nublado';
  if (code <= 20) return 'Nevoeiro';
  if (code <= 30) return 'Trovoadas';
  if (code <= 50) return 'Chuva fraca';
  if (code <= 60) return 'Chuva moderada';
  if (code <= 70) return 'Chuva forte';
  if (code <= 80) return 'Pancadas de chuva';
  return 'Tempestade';
}

function getWeatherIcon(code) {
  if (code === 0) return '☀️';
  if (code <= 3) return '⛅';
  if (code <= 20) return '🌫️';
  if (code <= 50) return '🌦️';
  return '🌧️';
}

function getFlightStatus(windSpeed, precipitation) {
  if (precipitation > 5) return { label: 'Operacao Suspensa', color: 'text-red-400', bg: 'bg-red-500/15', icon: AlertOctagon };
  if (windSpeed > 60) return { label: 'Voo Nao Recomendado', color: 'text-red-400', bg: 'bg-red-500/15', icon: AlertTriangle };
  if (windSpeed > 40) return { label: 'Atencao', color: 'text-yellow-400', bg: 'bg-yellow-500/15', icon: AlertTriangle };
  return { label: 'Voo Liberado', color: 'text-green-400', bg: 'bg-green-500/15', icon: CheckCircle };
}

export default function WeatherWidget() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  async function fetchWeather() {
    setError(false);
    try {
      const results = await Promise.all(
        cities.map((c) =>
          fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${c.lat}&longitude=${c.lng}&current=temperature_2m,precipitation,wind_speed_10m,visibility,weather_code&timezone=auto`
          ).then((r) => r.json())
        )
      );
      setData(
        results.map((r, i) => ({
          city: cities[i].name,
          temperature: r.current?.temperature_2m ?? fallback[i].temperature,
          windSpeed: r.current?.wind_speed_10m ?? fallback[i].windSpeed,
          precipitation: r.current?.precipitation ?? fallback[i].precipitation,
          visibility: r.current?.visibility ?? fallback[i].visibility,
          weatherCode: r.current?.weather_code ?? fallback[i].weatherCode,
        }))
      );
    } catch {
      setError(true);
      setData(
        cities.map((c, i) => ({ city: c.name, ...fallback[i] }))
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchWeather();
    const interval = setInterval(fetchWeather, 600000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="glass-card rounded-2xl p-6 lg:p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-sky-500/20 flex items-center justify-center">
            <CloudSun className="w-5 h-5 text-sky-400" />
          </div>
          <h2 className="text-lg font-bold text-white">Condicoes de Voo</h2>
        </div>
        <div className="animate-pulse space-y-4">
          {[1, 2].map((i) => (
            <div key={i} className="glass rounded-xl p-4">
              <div className="h-4 bg-white/5 rounded w-24 mb-3" />
              <div className="grid grid-cols-2 gap-3">
                {[1, 2, 3, 4].map((j) => (
                  <div key={j} className="h-3 bg-white/5 rounded" />
                ))}
              </div>
            </div>
          ))}
          <div className="h-12 bg-white/5 rounded-xl" />
        </div>
      </div>
    );
  }

  const allFree = data?.every((d) => d.windSpeed <= 40 && d.precipitation <= 5);
  const overallStatus = getFlightStatus(
    Math.max(...(data?.map((d) => d.windSpeed) || [0])),
    Math.max(...(data?.map((d) => d.precipitation) || [0]))
  );
  const StatusIcon = overallStatus.icon;

  return (
    <div className="glass-card rounded-2xl p-6 lg:p-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-sky-500/20 flex items-center justify-center">
            <CloudSun className="w-5 h-5 text-sky-400" />
          </div>
          <h2 className="text-lg font-bold text-white">Condicoes de Voo</h2>
        </div>
        {error && <span className="text-[10px] text-gray-600">Dados simulados</span>}
      </div>

      <div className="space-y-4">
        {data?.map((c) => (
          <div key={c.city} className="glass rounded-xl p-4 lg:p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-white font-semibold text-sm">{c.city}</span>
              <span className="text-xl">{getWeatherIcon(c.weatherCode)}</span>
            </div>
            <div className="grid grid-cols-2 gap-y-3 gap-x-4 text-sm">
              <div className="flex items-center gap-2">
                <Thermometer className="w-4 h-4 text-orange-400" />
                <span className="text-gray-400">Temp:</span>
                <span className="text-white font-medium">{Math.round(c.temperature)}°C</span>
              </div>
              <div className="flex items-center gap-2">
                <Wind className="w-4 h-4 text-cyan-400" />
                <span className="text-gray-400">Vento:</span>
                <span className="text-white font-medium">{Math.round(c.windSpeed)} km/h</span>
              </div>
              <div className="flex items-center gap-2">
                <Droplets className="w-4 h-4 text-blue-400" />
                <span className="text-gray-400">Chuva:</span>
                <span className="text-white font-medium">{c.precipitation > 0 ? `${c.precipitation} mm` : 'Nao'}</span>
              </div>
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4 text-purple-400" />
                <span className="text-gray-400">Visibilidade:</span>
                <span className="text-white font-medium">{c.visibility ? `${(c.visibility / 1000).toFixed(1)} km` : '---'}</span>
              </div>
            </div>
            <p className="text-gray-500 text-xs mt-2">{getWeatherDesc(c.weatherCode)}</p>
          </div>
        ))}
      </div>

      <div className={`mt-4 flex items-center gap-3 px-5 py-4 rounded-xl ${overallStatus.bg}`}>
        <StatusIcon className={`w-5 h-5 ${overallStatus.color}`} />
        <div>
          <p className={`text-sm font-semibold ${overallStatus.color}`}>{overallStatus.label}</p>
          <p className="text-gray-500 text-xs mt-0.5">
            {allFree ? 'Condicoes favoraveis para voo' : 'Verifique as condicoes antes de operar'}
          </p>
        </div>
      </div>
    </div>
  );
}

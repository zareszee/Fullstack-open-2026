
const Header = ({ header }) => <h2>{header}</h2>

const WeatherData = ({ data }) => {
  if (!data || !data.main || !data.weather) {
    return <p>Chargement de la météo...</p>
  }

  return (
    <div>
      <p>Temperature: {data.main.temp} °C</p>
      <p>Max temperature: {data.main.temp_max} °C</p>
      <p>Min temperature: {data.main.temp_min} °C</p>
      <p>Wind speed: {data.wind?.speed} m/s</p>
      <p>Wind degrees: {data.wind?.deg}°</p>
      <p>Humidity: {data.main.humidity}%</p>
      <p>Description: {data.weather[0].description}</p>

      <img
        src={`https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`}
        alt={data.weather[0].description}
      />
    </div>
  )
}

const Weather = ({ capital, weatherData }) => {
  if (!capital) return null

  return (
    <div>
      <Header header={`Weather in ${capital}`} />

      {weatherData
        ? <WeatherData data={weatherData} />
        : <p>Chargement de la météo...</p>
      }
    </div>
  )
}

export default Weather

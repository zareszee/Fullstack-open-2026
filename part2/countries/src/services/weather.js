
import axios from 'axios'

const baseUrl = 'https://api.openweathermap.org/data/2.5/weather'

const apiKey = import.meta.env.VITE_WEATHER_API_KEY

const getWeather = (capital) => {
  return axios
    .get(baseUrl, {
      params: {
        q: capital,
        appid: apiKey,
        units: 'metric',
        lang: 'fr'
      }
    })
    .then(res => res.data)
}

export default { getWeather }

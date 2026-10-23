
import Weather from './Weather'

const Header = ({ header }) => <h2>{header}</h2>

const BasicData = ({ capital, area, languages, flag }) => {
  return (
    <div>
      <p>Capital: {capital}</p>
      <p>Area: {area} km²</p>

      <h3>Languages:</h3>
      <ul>
        {Object.values(languages || {}).map((language) => (
          <li key={language}>{language}</li>
        ))}
      </ul>

      <img src={flag} alt="Flag" />
    </div>
  )
}

const Country = ({ country, show = true, weatherData = null }) => {
  if (!show) return null

  const capital = country.capital?.[0]

  return (
    <div>
      <Header header={country.name.common} />

      <BasicData
        capital={capital || 'Unknown'}
        area={country.area}
        languages={country.languages}
        flag={country.flags.png}
      />

      <Weather
        capital={capital}
        weatherData={weatherData}
      />
    </div>
  )
}

export default Country

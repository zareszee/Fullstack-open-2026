import { useState, useEffect } from 'react'
import countriesService from './services/countries'
import weatherService from './services/weather'
import Filter from './components/Filter'
import Country from './components/Country'

const App = () => {
  const [countries, setCountries] = useState([])
  const [countriesFilter, setCountriesFilter] = useState([])
  const [showContries,setShowContries]=useState([])//booleans to show countries
  const [weatherData,setWeatherData]=useState([])
  const [filter, setFilter] = useState('')

  useEffect(()=>{
    countriesService.getAll()
      .then(response => {
        setCountries(response)
      })
  },[])
  
  useEffect(() => {
    if (countriesFilter.length !== 1) return

    const capital = countriesFilter[0].capital?.[0]

    if (!capital) return

    weatherService.getWeather(capital)
      .then(response => {
        setWeatherData([response])
      })
      .catch(error => {
        console.error('Error fetching weather:', error)
      })
  }, [countriesFilter])
  
  const handleFilterChange = (e) => {
    const newFilter = e.target.value
    setFilter(newFilter)

    if (newFilter.trim() === '') {
      setCountriesFilter([])
      setShowContries([])
      setWeatherData([])
      return
    }

    const filtered = countries.filter(c =>
      c.name.common.toUpperCase().includes(newFilter.toUpperCase())
    )

    setCountriesFilter(filtered)
    setShowContries(filtered.map(() => false))
    setWeatherData(filtered.map(() => null))
  }

  const handleShow = async (e, index, country) => {
    e.preventDefault()

    setShowContries(prev =>
      prev.map((value, i) => i === index ? !value : value)
    )

    const capital = country.capital?.[0]

    if (!capital) return

    try {
      const response = await weatherService.getWeather(capital)

      setWeatherData(prev =>
        prev.map((value, i) => i === index ? response : value)
      )
    } catch (error) {
      console.error('Error fetching weather:', error)
    }
  }

  const getCountriesView=()=>{
    if(countries.length>0){
      let nCountries=countriesFilter.length
      if(nCountries>10 || nCountries===0)
        return <><p>Too many matches, specify another filter</p></>
      else{
        if(nCountries>1){
          return <>
            {countriesFilter.map((c, i) => (
              <div key={c.cca3}>
                {c.name.common}

                <button onClick={(e) => handleShow(e, i, c)}>
                  {showContries[i] ? 'hide' : 'show'}
                </button>

                {showContries[i] && (
                  <Country
                    country={c}
                    show={true}
                    weatherData={weatherData[i]}
                  />
                )}
              </div>
            ))}
          </>
        }else{
          return <>
            {countriesFilter.map((c, i) => (
              <Country
                key={c.cca3}
                country={c}
                show={true}
                weatherData={weatherData[i]}
              />
            ))}
          </>
        }
      }
    }
    return <></>
  }
  return (
    <div>
      <Filter
        filter={filter}
        control={handleFilterChange}
      />
      {getCountriesView()}
    </div>
  )
}

export default App
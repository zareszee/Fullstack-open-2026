import { useEffect, useState } from 'react'
import personService from "./services/persons"



const Notification = ({ message, type }) => {
  if (message === null) {
    return null
  }

  return (
    <div className={type}>
      {message}
    </div>
  )
}

const Filter = ({searchPerson, handleSearchPersonChange}) => {
  return (
    <div>
      filter shown with <input value={searchPerson} onChange={handleSearchPersonChange} />
    </div>
  )
}

const PersonForm = ({addPerson, newName, newNumber, handleNewNameChange, handleNewNumberChange}) => {
  return (
    <div>
      <form onSubmit={addPerson}>
        <div>
          name: <input value={newName} onChange={handleNewNameChange} />
        </div>
        <div>
          number: <input value={newNumber} onChange={handleNewNumberChange} />
        </div>
        <div>
          <button type="submit" >add</button>
        </div>
      </form>
    </div>
  )
}

const Persons = ({personsToShow, handleDeletePerson}) => {
  return (
    <div>
      {personsToShow.map(person => {
        return (<p key={person.name}>
          {person.name} {person.number} <button onClick={() => handleDeletePerson(person.id)} >delete</button>
        </p>)
      })} 
    </div>
  )
}

const App = () => {
  const [persons, setPersons] = useState([]) 
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [searchPerson, setSearchPerson] = useState('')
  const [showAll, setShowAll] = useState(true)
  const [message, setMessage] = useState(null)
  const [notificationType, setNotificationType] = useState("good")


  useEffect(() => {
    personService
      .getAll()
      .then(initialPersons => {
        setPersons(initialPersons)
      })
      .catch(error => {
        console.error('Error fetching persons:', error)
        setNotificationType("error")
        setMessage("Failed to load contacts from the server.")
        setTimeout(() => {
            setMessage(null)
          }, 5000)
      })
  }, [])

  const personsToShow = showAll 
    ? persons
    : persons.filter(person => person.name.toLowerCase().includes(searchPerson.toLowerCase()))


  const handleNewNameChange = (event) => {
    setNewName(event.target.value)
  } 

  const handleNewNumberChange = (event) => {
    setNewNumber(event.target.value)
  }

  const handleSearchPersonChange = (event) => {
    const searchValue = event.target.value
    setSearchPerson(searchValue)
    setShowAll(searchValue === "")
  }

  const addPerson = (event) => {
    event.preventDefault()

    const existingPerson = persons.find(person => person.name.toLowerCase() === newName.toLowerCase())

    const personObjet = {
      name: newName,
      number: newNumber
    }

    if (existingPerson) {
      const confirm = window.confirm(`${existingPerson.name} is already added to phonebook, replace the old number with a new one?`)
      if(!confirm){
        setNewName("")
        setNewNumber("")
        return
      }
      personService
        .update(existingPerson.id, personObjet)
        .then(returnedPerson => {
          setPersons(persons.map(person => 
            person.id === returnedPerson.id ? returnedPerson : person))
          setNewName("")
          setNewNumber("")
          setNotificationType("good")
          setMessage(`${returnedPerson.name}'s number has been successfully changed`)
          setTimeout(() => {
            setMessage(null)
          }, 5000)
        })
        .catch(error => {
          console.error('Error updating person:', error)
          setNotificationType("error")
          setMessage(`Failed to update ${existingPerson.name}.`)
          setTimeout(() => {
            setMessage(null)
          }, 5000)
        })
      return
    } 

    
    personService
      .create(personObjet)
      .then(returnedPerson => {
        setPersons(persons.concat(returnedPerson))
        setNewName("")
        setNewNumber("")
        setNotificationType("good")
        setMessage(`${returnedPerson.name} has been added successfully`)
        setTimeout(() => {
          setMessage(null)
        }, 5000)
      })
      .catch(error => {
        console.error('Error adding person:', error)
        setNotificationType("error")
        setMessage(`Failed to add ${newName} to the phonebook.`)
        setTimeout(() => {
          setMessage(null)
        }, 5000)
      })
    
  }

  const handleDeletePerson = (id) => {
    const person = persons.find(person => person.id === id)
    const confirm = window.confirm(`Delete ${person.name}`)
    if(!confirm) {
      return
    }
    personService
      .deletePerson(id)
      .then(returnedPerson => {
        setPersons(persons.filter(person => person.id !== returnedPerson.id))
        setNotificationType("good")
        setMessage(`${returnedPerson.name} has been successfully removed from the directory`)
        setTimeout(() => {
          setMessage(null)
        }, 5000)
      })
      .catch(error => {
        console.error('Error deleting person:', error)
        setNotificationType("error")
        setMessage("The contact could not be deleted. It may have already been removed from the server.")
        setTimeout(() => {
          setMessage(null)
        }, 5000)
        setPersons(persons.filter(person => person.id !== id))
      })
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={message} type={notificationType} />
      <Filter searchPerson={searchPerson} handleSearchPersonChange={handleSearchPersonChange} />
      <h3>add a new</h3>
      <PersonForm 
        addPerson={addPerson} 
        newName={newName} 
        newNumber={newNumber} 
        handleNewNameChange={handleNewNameChange}
        handleNewNumberChange={handleNewNumberChange} 
      />
      <h3>Numbers</h3>
      <Persons personsToShow={personsToShow} handleDeletePerson={handleDeletePerson} />
    </div>
  )

}

export default App

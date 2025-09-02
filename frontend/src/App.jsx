import { useState, useEffect } from 'react'
import { Filter, Personform, Persons } from './Mycomponents'
import PbServices from './pbservices'

const SysMessage = ({sysmsg}) => {
  const sysmsgstyle = {
    color: (sysmsg===null?'black':sysmsg.color),
    background: 'lightgrey',
    fontSize: '20px',
    borderStyle: 'solid',
    borderRadius: '5px',
    padding: '10px',
    marginBottom: '10px'
  }
  console.log(`SysMessage: `, sysmsg)
  return (sysmsg!==null?
    <div style={sysmsgstyle}>
      {sysmsg.message}
    </div>
    :<></>
  )
}

const App = () => {
  const [persons, setPersons] = useState([]) 
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filterString, setFilterString] = useState('')
  const [sysmessage, setSysMessage] = useState(null)

  const setUsername = (event)=> {
    console.log('setUsername:', event.target.value)
    setNewName(event.target.value)
  }

  const setUsernumber = (event)=> {
    console.log('setUsernumber:', event.target.value)
    setNewNumber(event.target.value)
  }

  const setFilter = (event) => {
    console.log('setFilterString:', event.target.value)
    setFilterString(event.target.value)
  }

  const addNewContact = (event) => {
    event.preventDefault()
    const newContact = {name: newName, number: newNumber}
    const index = persons.findIndex(person=>person.name.toUpperCase()===newContact.name.toUpperCase())
    if (index == -1) {
      addPerson(newContact)
    }
    else {
      if (window.confirm(`${newContact.name} is already added to phonebook, replace the old number with a new one?`)){
        updatePerson(index, newContact)
      } else {
        window.alert(`No update to ${newContact.name}`)
      }
    }
  }

  const addPerson = (newContact) => {
    console.log(`${newContact.name} is being added to phonebook.`)
    PbServices.add(newContact)
    .then(response=>{newContact.id = response.data.id; const np=persons.concat(newContact); setPersons(np)})
    .then(response=>{showSysMessage(`'${newContact.name}'is successfully added.`, 'green')})
    .catch(error=>{console.log(`Error is encountered: ${error}. None is added.`)})
  }

  const updatePerson = (index, newContact) => {
    const id = persons[index].id
    console.log(`${newContact.name} is being added to phonebook.`)
    PbServices.update(id, newContact)
    .then(response=>{newContact.id = response.data.id; const np = persons.map(person=>(person.id===id)?{...person, number:newNumber}:person); setPersons(np) })
    .then(response=>{showSysMessage(`'${newContact.name}'is successfully updated.`, 'green')})
    .catch(error=>{showSysMessage(`Error is encountered: ${error}. None is updated.`,'red'); console.log('failed to update data in the server.')})
  }

  const deleteContact = (index) => {
    const id = persons[index].id
    if (window.confirm(`Delete ${persons[index].name}?`)){
      deletePerson(persons[index])
    } else {
      console.log(`Delete is cancelled.`)
    }
  }

  const deletePerson = (person) => {
      PbServices.remove(person.id)
      .then(response=>{console.log(`${person.name} is successfully deleted.`); const np=persons.filter(p=>p.id!==person.id);setPersons(np)})
      .catch(error=>{console.log(`Error is encountered during delete ${person.name}: ${error}. None is deleted.`)})
  }

  const showSysMessage = (message, color) => {
    console.log(`message=${message}, color=${color} `)
    const msg = {message, color}
    console.log(msg)
    setSysMessage(msg); 
    setTimeout(()=>{setSysMessage(null)}, 2000)
  }

  const filterenabled = filterString.length>0
  const results = filterenabled?persons.filter(person=>person.name.toLowerCase()===filterString.toString().toLowerCase()):[]
  console.log('filterString length:', filterString.length)
  const dataurl = 'http://localhost:3001/persons'
  useEffect(()=>{
    PbServices.getAll()
         .then(response=>{console.log(response.data); setPersons(response.data)})
         .catch(error=>console.log(`Failed to load phonebook data. ${error}, url:${dataurl}`))
  },[])

  return (
    <div>
      <h2>Phonebook</h2>
      <SysMessage sysmsg={sysmessage}/>
      <Filter onChange={(event)=>setFilter(event)}/>
      <Personform onNameChange={(event)=>setUsername(event)} onNumberChange={(event)=>setUsernumber(event)} onFormSubmit={(event)=>addNewContact(event)}/>
      <h2>Contacts</h2>
      <Persons persons={persons} showresults={filterenabled} results={results} cbDeletePerson={deleteContact}/>
    </div>
  )
}

export default App 
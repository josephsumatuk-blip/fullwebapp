import { useState, useEffect } from 'react'
import axios from 'axios'

export const Filter = ({onChange}) => <div>filter shown with: <input onChange={onChange}/></div>

export const Personform = ({onNameChange, onNumberChange, onFormSubmit}) => 
<form onSubmit={onFormSubmit}>
    <h2>Add new contact info</h2>
    <p>
        name: <input onChange={onNameChange}/>
    </p>
    <p>
        number: <input onChange={onNumberChange}/>
    </p>
    <p>
        <button type="submit">add</button>
    </p>
</form>


const Person = (props) => {
  console.log('Person:', props.person.name, props.person.number)
  return <>{props.person.name} {props.person.number} </>
}

export const Persons = ({persons, showresults, results, cbDeletePerson}) => {
  console.log(`results: ${results}`, persons)

  const onDeleteButtonClicked = (e) => {
    const dataid = e.target.getAttribute("dataindex")
    cbDeletePerson(dataid)
  }

  const formatPerson = (person, index) => {
    console.log(person, index)
    return(
    <p key={person.name}><Person person={person}/><button dataindex={index} onClick={onDeleteButtonClicked}>delete</button></p>
  )}

  return (
    <div>
        {
            showresults
            ?results.map((person, index)=>formatPerson(person, index))
            :persons.map((person, index)=>formatPerson(person, index))
        }
    </div>
    )
}


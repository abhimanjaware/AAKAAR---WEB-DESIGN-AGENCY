import React from 'react'

const movies = [
    {id:'1' ,name:"INCEPTION", year:"2004"},
    {id:'2' ,name:"MONEYHEIST", year:"2006"},
    {id:'3' ,name:"AIB", year:"1999"},
    {id:'4' ,name:"XYZ", year:"1804"},
    {id:'5' ,name:"DHAMAAL", year:"7777"},

]

function practice() {
  return (
    <div>
      <h1>MOVIES ARE :</h1>
      <ul>
        {movies.map((movie)=>(
            <li key={movie.id}>{movie.name}({movie.year})</li> 
        ))}
      </ul>
    </div>
  )
}

export default practice

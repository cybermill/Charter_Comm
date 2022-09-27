import logo from './logo.svg';
import './App.css';
import React, { useState, useEffect, useref } from 'react';
import Button from '@mui/material/Button';
import { TextField } from '@mui/material';

function App() {
  const [selectedUser, setSelectedUser] = useState('');
  const [userTransactions, setUserTransactions] = useState([]);
  const [totalPoints, setTotalPoints] = useState(0);

  //Functions
  function handleSubmit(e){
    e.preventDefault();
    resetState();
    async function fetchData(){
      const response = await fetch(
        `http://localhost:3000/Data/${selectedUser}`,
        {
          method: "GET",
          headers: {
            'Content-Type': 'application/json'
          }
        }
      )
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      calculatePoints(data);
    }
    fetchData();
  };

  function resetState(){
    setUserTransactions([]);
    setTotalPoints(0);
  }

  function calculatePoints(data){
    for(let i = 0; i < data.Transactions.length; i++){
      let { amount } = data.Transactions[i];
      let points = 0;
      if(amount > 50 && amount <= 100){
        let diff = amount - 50;
        points += Math.floor(diff) * 1;
      } else if(amount > 100){
        let diff = amount - 100;
        points += Math.floor(diff) * 2 + 50;
      }
      setTotalPoints(totalPoints => totalPoints + points);
      data.Transactions[i].pointsEarned = points;
      setUserTransactions(state => [...state, data.Transactions[i]]);
    }
  }

  return (
    <>
    <div className="Container">
      <form onSubmit={handleSubmit}>
        <div className='search-container'>
          <TextField id="input" label="Search Client ..." variant="outlined" sx={{ mr: 1 }}value={selectedUser} size="small" onChange={(event) => setSelectedUser(event.target.value)}></TextField>
          <Button variant="contained" size="small" type='submit'>Submit</Button>
        </div>
      </form>
      <h1>Welcome, {selectedUser}</h1>
      <div className='circle'>
        <h2>{totalPoints}</h2>
        <h5>Total Points Earned</h5>
      </div>
      <h3>Transactions History</h3>
      {userTransactions.map(({id, transactionName, date, amount, pointsEarned}) => {
        return(
          <div className='transaction-container' key={id}>
            <div className='left-transaction-vertical-container'>
              <h4>{transactionName}</h4>
              <p style={{ color: 'gray'}}>{date}</p>
            </div>
            <div className='right-transaction-vertical-container'>
              <p>${amount}</p>
              <p>{pointsEarned} pts</p>
            </div>
          </div>
          );
        })
      }
    </div>
    </>
  );
}

export default App;
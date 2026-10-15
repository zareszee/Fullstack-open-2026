import { useState } from 'react'

const Button = (props) => {
  return (
    <button onClick={props.handleClick}>
      {props.text}
    </button>
  )
}

const StatisticLine = (props) => {

  return (
    <tr>
      <td>
        {props.text}
      </td>
      <td>
        {props.value} {props.text === "positive" ? "%" : ""}
      </td>
    </tr>
  )
}

const Statistics = (props) => {

  if (props.all === 0) {
    return (
      <div>
        <h1>Statistics</h1>
        <p>
          No feedback given
        </p>
      </div>
    )
  }
  
  return (
    <div>
      <h1>Statistics</h1>
      <table>
        <tbody>
          <StatisticLine text="good" value={props.good}/>
          <StatisticLine text="neutral" value={props.neutral}/>
          <StatisticLine text="bad" value={props.bad}/>
          <StatisticLine text="all" value={props.all}/>
          <StatisticLine text="average" value={props.all === 0 ? 0 : (props.good - props.bad) / props.all} />
          <StatisticLine text="positive" value={(props.good / props.all) * 100} />
        </tbody>
      </table>
    </div>
  )
}

function App() {
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  const all = good + neutral + bad

  return (
    <div>
     <h1>Give feedback</h1>
     <Button text="good" handleClick={() => setGood(good + 1)} />
     <Button text="neutral" handleClick={() => setNeutral(neutral + 1)} />
     <Button text="bad" handleClick={() => setBad(bad + 1)} />
     <Statistics good={good} neutral={neutral} bad={bad} all={all}/>
    </div>
  )
}

export default App

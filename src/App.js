import React, {useState, useEffect} from "react"
import Confetti from "react-confetti"
import Die from "./components/Die"

export default function App() {
    const [dice, setDice] = useState(allNewDice())
    const [tenzies, setTenzies] = useState(false)
    const [numOfRolls, setNumOfRolls] = useState(0)
    const [bestScore, setBestScore] = useState(
        JSON.parse(localStorage.getItem("bestScore")) || Number.POSITIVE_INFINITY
      );
    
    useEffect(() => {
        const allHeld = dice.every(die => die.held)
        const allSameNumber = dice.every(die => die.value === dice[0].value)
        if(allHeld && allSameNumber) {
            setTenzies(true)
            
            const highScore = Math.min(numOfRolls, bestScore);
            setBestScore(highScore);
            localStorage.setItem("bestScore", highScore);
        }
    }, [dice])
    
    
    function randomDieValue() {
        return Math.ceil(Math.random() * 6)
    }

    function allNewDice() {
        const newArray = []
        for(let i = 0; i < 12; i++) {
            const newDie = {
                value: randomDieValue(),
                held: false,
                id: i + 1
            }
            newArray.push(newDie)
        }
        return newArray
    }

    function rollUnheldDice() {
        if (!tenzies) {
            setDice((oldDice) => oldDice.map((die, i) =>
                die.held ? 
                    die : 
                    { value: randomDieValue(), held: false, id: i + 1 }
            ))
            setNumOfRolls(numOfRolls + 1)
        } else {
            setDice(allNewDice())
            setTenzies(false)
            setNumOfRolls(0)
        }
    }

    function holdDice(id) {
        setDice(prevDice => prevDice.map(die => {
            return die.id === id ? 
                {...die, held: !die.held} : 
                die
        }))
    }

    const diceElements = dice.map((die) => (
        <Die key={die.id} {...die} hold={() => holdDice(die.id)} />
    ))


    return (
        <main>
            {tenzies && <Confetti />}
            <h1>Tenzies</h1>
            <p>Roll until all dice are the same. Click each die to freeze it at its current value between rolls.</p>
            <div className="die-container">{diceElements}</div>
            <button className="roll-dice" onClick={rollUnheldDice}>
                {tenzies ? "Reset Game" : "Roll"}
            </button>

            <div className="score-board">
                <p>Number of rolls: {numOfRolls}</p> 
                {localStorage.getItem("bestScore") && (
                <div >
                <p>Best score: {bestScore}</p> 
                </div>
                )}
            </div>
        </main>
    )
}

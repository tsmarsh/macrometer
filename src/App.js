import React from 'react';
import {useState} from 'react';
import './App.css';
import MacroCalculator from './MacroCalculator'

function App() {
    const [weight, setWeight] = useState(125);
    const [activity, setActivity] = useState(1.4);
    const [fat, setFat] = useState(35);

    return (
        <div className="container-fluid app">
            <h1>Macrometer</h1>
            <MacroCalculator weight={weight} setWeight={setWeight}
                             fat={fat} setFat={setFat}
                             activity={activity} setActivity={setActivity} />
        </div>
    );

}

export default App;

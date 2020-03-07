import React from 'react';
import './App.css';
import MacroCalculator from './MacroCalculator'

class App extends React.Component{

    render(){
        return (
            <div className="container-fluid app">
                <h1>Macrometer</h1>
                <MacroCalculator name={"Bob"} weight={125} fat={35} activity={1.4}/>
            </div>
        );
    }
}

export default App;

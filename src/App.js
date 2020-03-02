import React from 'react';
import './App.css';
import MacroCalculator from './MacroCalculator'

class App extends React.Component{

    constructor(props) {
        super(props);
    }

    render(){
        return (
            <div className="container-fluid">
                <h1>Macrometer</h1>
                <MacroCalculator name={"Bob"} weight={125} fat={35} activity={1.4}/>
            </div>
        );
    }
}

export default App;

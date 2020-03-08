import React from 'react';
import InputGroup from 'react-bootstrap/InputGroup';
import Table from 'react-bootstrap/Table';
import {useState} from "react";

function Weight(props) {

    const lbsPerKilo = 2.20;

    const [metric, setMetric] = useState(true);

    const freedomToMetric = (value) => value / lbsPerKilo;

    const metricToFreedom = (value) => value * lbsPerKilo;


    const getMetricWeight = (weight) => {
        if (!metric) {
            return freedomToMetric(weight)
        }
        return weight;
    };

    const displayValue = (value) => metric ? value : metricToFreedom(value).toFixed(1);

    const toggleMetric = () => {
        setMetric(!metric);
        props.onWeightChange(props.value);
    };

    const updateWeight = (e) => {
        let weight = parseFloat(e.target.value);
        props.onWeightChange(getMetricWeight(weight));
    };

    return (
        <InputGroup className="mb-3">
            <InputGroup.Prepend className="">
                <InputGroup.Text>Weight</InputGroup.Text>
            </InputGroup.Prepend>

            <input className={"col-2"} onChange={updateWeight} id="weight" type="number" step="0.1" min="0"
                   value={displayValue(props.value)}/>

            <InputGroup.Append>
                <select className={"custom-select"} onChange={toggleMetric} id="freedom"
                        defaultValue={"kg"}>
                    <option value="lbs">lbs</option>
                    <option value="kg">kg</option>
                </select>
            </InputGroup.Append>
        </InputGroup>
    );
}

function Fat(props) {
    const updateFat = (e) => props.onFatChange(parseFloat(e.target.value));

    return (
        <InputGroup className="mb-3">
            <InputGroup.Prepend>
                <InputGroup.Text>Body Fat%</InputGroup.Text>
            </InputGroup.Prepend>

            <input className={"col-2"} onChange={updateFat} id="body_fat" type="number" step="0.1" max="100"
                   min="0"
                   value={props.value}/>
        </InputGroup>
    );
}

function Activity(props) {
    const activityLevels = [
        ["sedentary (<5000 steps/day)", 1.2],
        ["light (≈5,000 steps/day)", 1.3],
        ["moderate (≈7,000 steps/day)", 1.4],
        ["very active (≈10,000 steps/day)", 1.5],
        ["extremely active (≈15,000+ steps/day)", 1.6]];

    const updateActivity = (e) => props.onActivityChange(e.target.value);

    let options = activityLevels.map((row) => <option className="text-capitalize" key={row[1]}
                                                      value={row[1]}>{row[0]}</option>);

    return (
        <div>
            <InputGroup className="mb-3">
                <InputGroup.Prepend>
                    <InputGroup.Text>Activity</InputGroup.Text>
                </InputGroup.Prepend>
                <select className="custom-select col-4" id="activity" onChange={updateActivity}
                        defaultValue={props.value}>
                    {options}
                </select>
            </InputGroup>
            <p className="small text-right">* All activity assumes 3 to 5 days of strength training</p>
        </div>
    );

}

function MacroTable(props) {
    let i = 100;
    let rows = props.macros.map((a) => {
        const [head, ...tail] = a;

        return (
            <tr key={"macro-row-" + a}>
                <td className={"text-left text-capitalize"}>{head}</td>
                    {tail.map((v) => <td className={"text-right"} key={"macro-" + i++}>{v}</td>)}
            </tr>);
    });

    return (
        <Table size={"sm"} striped bordered>
            <thead variant="dark">
            <tr>
                <th className={"text-left col-2"}>Deficit</th>
                <th className={"text-right"}>Daily kCal</th>
                <th className={"text-right"}>Protein (g)</th>
                <th className={"text-right"}>Fats (g)</th>
                <th className={"text-right"}>Carbs (g)</th>
            </tr>
            </thead>
            <tbody>
            {rows}
            </tbody>
        </Table>
    );
}


function MacroCalculator(props) {
    const aggression = {
        "very aggressive": 0.7,
        "aggressive": 0.75,
        "mildly aggressive": 0.8,
        "refeed": 1.1
    };

    const cdp = ["very aggressive", "aggressive", "mildly aggressive"];

    const leanMass = () => props.weight * (100 - props.fat) / 100;

    const bmr = () => 370 + (21.6 * leanMass());

    const dailyCalories = (a) => maintainance() * a;

    const protein = () => leanMass() * 2.205 * 1.2;

    const fat = (a) => (dailyCalories(a) * 0.25) / 9;

    const carbs = (a) => {
        let protCals = protein() * 4;
        let fatCals = fat(a) * 9;
        return (dailyCalories(a) - (protCals + fatCals)) / 4;
    };

    const calculateMacros = () => cdp.map((a) => [
        a,
        parseInt(dailyCalories(aggression[a])),
        parseInt(protein()),
        parseInt(fat(aggression[a])),
        parseInt(carbs(aggression[a]))
    ]);

    const calculateRefeed = () => [["refeed",
        parseInt(maintainance() * 1.1),
        parseInt(leanMass() * 2.205),
        parseInt(fat(aggression["refeed"])),
        parseInt(carbs(aggression["refeed"]))]];


    const maintainance = () => bmr() * props.activity;

    return (
        <div className="macro-calculator">
            <div>
                <Weight value={props.weight} onWeightChange={props.setWeight}/>
                <Fat value={props.fat} onFatChange={props.setFat}/>
                <Activity value={props.activity} onActivityChange={props.setActivity}/>
            </div>
            <div>
                <MacroTable macros={calculateMacros()}/>
                <MacroTable macros={calculateRefeed()}/>
            </div>
        </div>
    )
}

export default MacroCalculator;
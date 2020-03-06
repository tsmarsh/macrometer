import React from 'react';
import InputGroup from 'react-bootstrap/InputGroup';
import Table from 'react-bootstrap/Table';

class Weight extends React.Component {

    lbsPerKilo = 2.205;

    constructor(props) {
        super(props);

        this.state = {metric: true};

        this.weight = props.value;

        this.toggleMetric = this.toggleMetric.bind(this);
        this.getMetricWeight = this.getMetricWeight.bind(this);
        this.updateWeight = this.updateWeight.bind(this);
    }

    freedomToMetric(value) {
        return value / this.lbsPerKilo;
    }

    metricToFreedom(value) {
        return value * this.lbsPerKilo;
    }

    getMetricWeight() {
        if (!this.state.metric) {
            return this.freedomToMetric(this.weight)
        }
        return this.weight;
    }

    toggleMetric() {
        this.setState({metric: !this.state.metric});

        let value = parseFloat(document.getElementById("weight").value);

        this.weight = this.state.metric ? this.metricToFreedom(value).toFixed(1) : this.freedomToMetric(value).toFixed(1);
    }

    updateWeight(e) {
        this.weight = parseFloat(e.target.value);
        this.props.onWeightChange(this.getMetricWeight());
    }


    render() {
        return (
            <InputGroup className="mb-3">
                <InputGroup.Prepend>
                    <InputGroup.Text>Weight</InputGroup.Text>
                </InputGroup.Prepend>

                <input onChange={this.updateWeight} id="weight" type="number" step="0.1" min="0" value={this.weight}/>

                <InputGroup.Append>
                    <select onChange={this.toggleMetric} className="custom-select" id="freedom" defaultValue={"kg"}>
                        <option value="lbs">lbs</option>
                        <option value="kg">kg</option>
                    </select>
                </InputGroup.Append>
            </InputGroup>
        );
    }
}

class Fat extends React.Component {
    constructor(props) {
        super(props);

        let fat = parseFloat(this.props.value);
        this.fat = fat;
        this.updateFat = this.updateFat.bind(this);
    }

    updateFat(e) {
        let fat = parseFloat(e.target.value);
        this.fat = fat;
        this.props.onFatChange(this.fat);
    }

    render() {
        return (
            <InputGroup className="mb-3">
                <InputGroup.Prepend>
                    <InputGroup.Text>Body Fat%</InputGroup.Text>
                </InputGroup.Prepend>

                <input onChange={this.updateFat} id="body_fat" type="number" step="0.1" max="100" min="0"
                       value={this.fat}/>
            </InputGroup>
        );
    }
}

class Activity extends React.Component {
    constructor(props) {
        super(props);
        this.updateActivity = this.updateActivity.bind(this);

        this.activityLevel = this.props.value;

        this.activityLevels = [
            ["sedentary (<5000 steps/day)", 1.2],
            ["light (≈5,000 steps/day)", 1.3],
            ["moderate (≈7,000 steps/day)", 1.4],
            ["very active (≈10,000 steps/day)", 1.5],
            ["extremely active (≈15,000+ steps/day)", 1.6]];
    }

    updateActivity(e) {
        this.props.onActivityChange(e.target.value);
    }

    render() {

        let options = this.activityLevels.map((row) => <option key={row[1]} value={row[1]}>{row[0]}</option>)

        return (
            <div>
                <InputGroup className="mb-3">
                    <InputGroup.Prepend>
                        <InputGroup.Text>Activity</InputGroup.Text>
                    </InputGroup.Prepend>
                    <select className="custom-select" id="activity" onChange={this.updateActivity}
                            defaultValue={this.activityLevel}>
                        {options}
                    </select>
                </InputGroup>
                <p className="small">* All activity assumes 3 to 5 days of strength training</p>
            </div>
        );
    }
}

class MacroTable extends React.Component {

    render() {
        let i = 100;
        let rows = this.props.macros.map((a) => {
            const [head, ...tail] = a;

            return (<tr>
                <td className={"text-left"}>{head}</td>
                {tail.map((v) => <td className={"text-right"} key={"macro-" + i++}>{v}</td>)}
            </tr>);
        });

        return (
            <Table size={"sm"} striped bordered>
                <thead>
                <tr>
                    <th className={"text-left"}>Deficit</th>
                    <th className={"text-right"}>Daily Calorie</th>
                    <th className={"text-right"}>Protein</th>
                    <th className={"text-right"}>Fats</th>
                    <th className={"text-right"}>Carbs</th>
                </tr>
                </thead>
                <tbody>
                {rows}
                </tbody>
            </Table>
        );
    }
}

class MacroCalculator extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            bodyFat: parseFloat(props.fat),
            weight: parseFloat(props.weight),
            activity: parseFloat(props.activity),
            macros: []
        };

        this.aggression = [
            ["very aggressive", 0.3],
            ["aggressive", 0.25],
            ["mildly aggressive", 0.2]
        ];

        this.onNameChange = this.onNameChange.bind(this);
        this.onWeightChange = this.onWeightChange.bind(this);
        this.onFatChange = this.onFatChange.bind(this);
        this.onActivityChange = this.onActivityChange.bind(this);
    }

    leanMass() {
        return (this.state.weight * (100 - this.state.bodyFat)) / 100
    }

    bmr() {
        return 370 + (21.6 * this.leanMass());
    }

    dailyCalories(a) {
        return this.maintainance() - (this.maintainance() * a)
    }

    protein() {
        return this.leanMass() * 2.205 * 1.2;
    }

    fat(a) {
        return (this.dailyCalories(a) * 0.25) / 9;
    }

    carbs(a) {
        let protCals = this.protein() * 4;
        let fatCals = this.fat(a) * 9;
        return (this.dailyCalories(a) - (protCals + fatCals)) / 4;
    }

    calculateMacros() {
        return this.aggression.map((a) => [
            a[0],
            parseInt(this.dailyCalories(a[1])),
            parseInt(this.protein()),
            parseInt(this.fat(a[1])),
            parseInt(this.carbs(a[1]))
        ])
    }

    maintainance() {
        return this.bmr() * this.state.activity;
    }

    onNameChange(name) {
        this.setState({name: name});
    }

    onWeightChange(weight) {
        this.setState({weight: weight});
    }

    onFatChange(bodyFat) {
        this.setState({bodyFat: bodyFat});
    }

    onActivityChange(activityLevel) {
        this.setState({activity: activityLevel});
    }


    render() {
        return (
            <div>
                <div>
                    <Weight value={this.state.weight} onWeightChange={this.onWeightChange}/>
                    <Fat value={this.state.bodyFat} onFatChange={this.onFatChange}/>
                    <Activity value={this.state.activity} onActivityChange={this.onActivityChange}/>
                </div>
                <div>
                    <MacroTable macros={this.calculateMacros()}/>
                </div>
            </div>
        )
    }
}

export default MacroCalculator;
import React from 'react';

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            timer: [0, 0, 0],
            timeLengths: ["0", "0", "0"],
            inputErrorCount: 0,
            activeMain: 0,
            isPause: false
        }
    }

    getTimerValue = (index) => {
        let value = this.state.timer[index]
        // Put "0" in front of value if less than 10
        return(value < 10 ? `0${value}` : value.toString());
    }

    getRenderMain = () => {
        if(this.state.activeMain === 0) {
            return(
                <div className="main-container0">
                    <span className="timer-set-container">
                        <input type="text" className="timer-set" id="0" onChange={this.handleInputChange} value={this.state.timeLengths[0]}/>
                        <label className="timer-set-label">hours</label>
                        <input type="text" className="timer-set" id="1" onChange={this.handleInputChange} value={this.state.timeLengths[1]}/>
                        <label className="timer-set-label">mins</label>
                        <input type="text" className="timer-set" id="2" onChange={this.handleInputChange} value={this.state.timeLengths[2]} />
                        <label className="timer-set-label--last">seconds</label>
                    </span>
                    <div className="btn-container">
                        <button className="start-btn" onClick={this.handleStartBtnClick}>START</button>
                    </div>
                </div>
            );
        }
        return(
            <div className="main-container1">
                <div className="timer-container">
                    <label>{this.getTimerValue(0)}</label>
                    <label> : </label>
                    <label>{this.getTimerValue(1)}</label>
                    <label> : </label>
                    <label>{this.getTimerValue(2)}</label>
                </div>
                <div className="btn-container">
                    <button className="stop-btn" onClick={this.handleStopBtnClick}>STOP</button>
                    <button className="pause-btn" onClick={this.handlePauseBtnClick}>{this.state.isPause ? "RESUME" : "PAUSE"}</button>
                </div>
            </div>
        );
    }

    handleInputChange = (e) => {
        let targetValue = e.target.value;
        // Strip of whitespace
        targetValue = targetValue.replace(/\s/g, '');
        if(targetValue === "" || isNaN(targetValue)) { // If input is blank, error
            this.setState({inputErrorCount : this.state.inputErrorCount + 1});
            e.target.className = "timer-set--error";
        } else if(e.target.id === "0" && parseInt(targetValue) > 23) { // If hour is more than 23, cap
            targetValue = 23;
        } else if((e.target.id === "1" || e.target.id === "2") && parseInt(targetValue) > 59) { // If mins or seconds is more than 59, cap
            targetValue = 59;
        } else { // Reset error
            if(e.target.className === "timer-set--error") {
                this.setState({inputErrorCount : this.state.inputErrorCount - 1});
                e.target.className = "timer-set";
            }
        }
        // Write change to state
        let tempTimeLengths = this.state.timeLengths;
        tempTimeLengths[parseInt(e.target.id)] = targetValue;
        this.setState({timeLengths : tempTimeLengths});
    }

    timerStep = () => {
        setTimeout(function() {
            if(this.state.isPause === false) {
                let tempTimer = this.state.timer;
                // Decrement seconds
                tempTimer[2]--;
                if(tempTimer[2] < 0) { // If seconds less than 0
                    // Decrement mins
                    tempTimer[1]--;
                    // Set seconds to 59
                    tempTimer[2] = 59;
                    // If mins < 0 but hours > 0
                    if(tempTimer[1] < 0) {
                        if(tempTimer[0] > 0) {
                            // Decrement hours
                            tempTimer[0]--;
                            // Set mins to 59
                            tempTimer[1] = 59;
                        } else { // Else, timer is up
                            this.setState({activeMain : 0});
                            return;
                        }
                    }
                }
                // Write timer to state
                this.setState({timer : tempTimer});
                // Call timerStep (loop)
                this.timerStep();
            }
        }.bind(this), 1000)
    }

    handleStartBtnClick = (e) => {
        e.preventDefault();
        // If no errors
        if(this.state.inputErrorCount === 0) {
            // Parse all values in timeLengths to timer
            let tempTimer = this.state.timer;
            let count = 0;
            for (let i = 0; i < this.state.timeLengths.length; i++) {
                tempTimer[i] = parseInt(this.state.timeLengths[i]);
                count += tempTimer[i];
            }
            // If timer is not blank
            if(count > 0) {
                // Write timer to state
                this.setState({timer : tempTimer});
                // Set activeMain to 1
                this.setState({activeMain : 1});
                this.timerStep();
            }
        }
    }

    handlePauseBtnClick = (e) => {
        e.preventDefault();
        this.setState({isPause : !this.state.isPause}, () => {
            if(this.state.isPause === false) {
                this.timerStep();
            }
        });
    }

    handleStopBtnClick = (e) => {
        e.preventDefault();
        window.location.reload();
    }


    render() {
        return(
            <div>
                {this.getRenderMain()}
            </div>
        );
    }
}

export default App;
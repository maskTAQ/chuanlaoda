import React, {Component} from 'react';
import {RadioButton, RadioButtonGroup} from 'material-ui/RadioButton';
import {Step, Stepper, StepLabel, StepContent} from 'material-ui/Stepper';
import {RaisedButton, FlatButton, AutoComplete, TextField, DatePicker} from 'material-ui';

import styles from './addOrder.scss';
export default class AddOrder extends Component {
    state = {
        //订单类型 0 找货 1找船
        type: NaN,
        //货物类型
        cargoType: '',
        //货物吨 或船载重
        cargoTonnage: '',
        //航线起始点
        origin: '',
        destination: '',
        //装货时间
        shipmentTime: '',
        finished: false,
        stepIndex: 0,
        //弹出提示消息
        alertMessage: ''
    }
    handleNext = () => {
        const {
            stepIndex,
            type,
            cargoType,
            cargoTonnage,
            origin,
            destination,
            shipmentTime
        } = this.state;

        const stepVerifyMap = {
            0: () => {
                return !isNaN(type);
            },
            1: () => {
                return !!cargoType;
            },
            2: () => {
                return !!cargoTonnage;
            },
            3: () => {
                return !!origin && !!destination
            },
            4: () => {
                return !!shipmentTime
            }
        }
        if (!stepVerifyMap[stepIndex]()) {
            return alert('请填写信息');
        }

        this.setState({
            stepIndex: stepIndex + 1,
            finished: stepIndex >= 2
        });
    };

    handlePrev = () => {
        const {stepIndex} = this.state;

        if (stepIndex > 0) {
            this.setState({
                stepIndex: stepIndex - 1
            });
        }
    };
    onTypeChange = (proxy, type) => {
        this.setState({type})
    }
    onCargoTypeChange = (cargoType) => {
        this.setState({cargoType});
    }
    renderStepActions() {
        const {stepIndex} = this.state;
        const prevButton = () => {
            if (stepIndex === 0) {
                return null
            }
            return (<FlatButton label="上一步" disabled={stepIndex === 0} onClick={this.handlePrev}/>)

        }

        return (
            <div style={{
                margin: '12px 0'
            }}>
                <RaisedButton
                    label={stepIndex === 4
                    ? '确认发布'
                    : '下一步'}
                    primary={true}
                    onClick={this.handleNext}
                    style={{
                    marginRight: 12
                }}/> {prevButton()}
            </div>
        );
    }
    renderSelectType() {
        const {type} = this.state;
        let title = '找船或是找货';
        if (type === 0) {
            title = '我要找船';
        } else if (type === 1) {
            title = '我要找货';
        }
        return (
            <Step>
                <StepLabel>{title}</StepLabel>
                <StepContent>
                    <RadioButtonGroup name="type" valueSelected={type} onChange={this.onTypeChange}>
                        <RadioButton value={0} label="找船"/>
                        <RadioButton value={1} label="找货"/>
                    </RadioButtonGroup>
                    {this.renderStepActions()}
                </StepContent>
            </Step>
        )
    }
    renderSelectCargoType() {
        const {type, cargoType} = this.state;
        const dataSource = ['砂', '石子', '集装箱货物'];
        let title = '选择货物';
        if (cargoType) {
            if (type === 0) {
                title = `帮我运${cargoType}`;
            } else {
                title = `找${cargoType}`;
            }
        }
        return (
            <Step>
                <StepLabel>{title}</StepLabel>
                <StepContent>
                    <AutoComplete
                        floatingLabelText={`请输入你想${type === 0
                        ? '托运'
                        : '装载'}的货物`}
                        searchText={cargoType}
                        filter={AutoComplete.noFilter}
                        dataSource={dataSource}
                        onUpdateInput={this.onCargoTypeChange}/>
                    <br/> {this.renderStepActions()}
                </StepContent>
            </Step>
        )
    }
    renderInputCargoTonnage() {
        const {type} = this.state;
        return (
            <Step>
                <StepLabel>货物吨数</StepLabel>
                <StepContent>
                    <TextField
                        floatingLabelText={`请输入你想${type === 0
                        ? '托运'
                        : '装载'}的货物的吨数`}/><br/>
                    <br/> {this.renderStepActions()}
                </StepContent>
            </Step>
        )
    }
    renderSelectLane() {
        return (
            <Step>
                <StepLabel>选择航线</StepLabel>
                <StepContent>
                    <div>
                        <TextField floatingLabelText="起点"/><br/>
                        <TextField floatingLabelText="终点"/><br/>
                    </div>
                    <br/> {this.renderStepActions()}
                </StepContent>
            </Step>
        )
    }
    renderSelectTime() {
        const {type} = this.state;
        if (type === 1) {
            return (
                <Step>
                    <StepLabel>选择时间</StepLabel>
                    <StepContent>
                        <DatePicker
                            onChange={this.handleChangeMinDate}
                            autoOk={this.state.autoOk}
                            floatingLabelText="起始时间"
                            defaultDate={this.state.minDate}
                            disableYearSelection={this.state.disableYearSelection}/>
                        <DatePicker
                            onChange={this.handleChangeMinDate}
                            autoOk={this.state.autoOk}
                            floatingLabelText="截止时间"
                            defaultDate={this.state.minDate}
                            disableYearSelection={this.state.disableYearSelection}/> {this.renderStepActions()}
                    </StepContent>
                </Step>
            )
        } else {
            return (
                <Step>
                    <StepLabel>选择时间</StepLabel>
                    <StepContent>
                        <DatePicker
                            onChange={this.handleChangeMinDate}
                            autoOk={this.state.autoOk}
                            floatingLabelText="装货时间"
                            defaultDate={this.state.minDate}
                            disableYearSelection={this.state.disableYearSelection}/> {this.renderStepActions()}
                    </StepContent>
                </Step>
            )
        }

    }
    render() {
        const {stepIndex} = this.state;
        return (
            <div className={styles['add-order-container']}>
                <h2 className="title">发布信息</h2>
                <Stepper activeStep={stepIndex} orientation="vertical">
                    {this.renderSelectType()}
                    {this.renderSelectCargoType()}
                    {this.renderInputCargoTonnage()}
                    {this.renderSelectLane()}
                    {this.renderSelectTime()}
                </Stepper>
            </div>
        )
    }
}
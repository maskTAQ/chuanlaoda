import React, { Component } from 'react';
import { RadioButton, RadioButtonGroup } from 'material-ui/RadioButton';
import { Step, Stepper, StepLabel, StepContent } from 'material-ui/Stepper';
import { RaisedButton, FlatButton, AutoComplete, TextField, DatePicker, IconButton, Snackbar } from 'material-ui';
import moment from 'moment';

import styles from './addOrder.scss';
export default class AddOrder extends Component {
    static defaultProps = {
        onClose() { },
        onFinish() { }
    };
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
        shipmentTime: null,
        stepIndex: 0,
        //弹出框状态
        open: false,
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
                return {
                    result:!isNaN(type),
                    message:'请填写类型'
                };
            },
            1: () => {
                return {
                    result:!!cargoType,
                    message:'请填写货物类型'
                };
            },
            2: () => {
                return {
                    result:!!cargoTonnage,
                    message:'请填写货物吨数'
                };
            },
            3: () => {
                return {
                    result:!!origin && !!destination,
                    message:'请填写航线'
                };
            },
            4: () => {
                return {
                    result:!!shipmentTime,
                    message:'请填写载货时间'
                };
            }
        }
        let verifyResult = stepVerifyMap[stepIndex]();
        if (!verifyResult.result) {
            this.setState({
                open: true,
                alertMessage:verifyResult.message
            })
            return;
        }

        this.setState({
            stepIndex: stepIndex + 1
        });

        if (stepIndex >= 4) {
            this.props.onFinish(this.state);
        }

    };
    handleAlertRequestClose = () => {
        this.setState({ open: false })
    }

    handlePrev = () => {
        const { stepIndex } = this.state;

        if (stepIndex > 0) {
            this.setState({
                stepIndex: stepIndex - 1
            });
        }
    };
    onTypeChange = (proxy, type) => {
        this.setState({ type })
    }
    onCargoTypeChange = (cargoType) => {
        this.setState({ cargoType });
    }
    onTextValueChange = (key, value) => {
        this.setState({
            [key]: value
        });
    }
    handleTimeChange = (e, date) => {
        this.setState({
            shipmentTime: date
        });
    }
    renderStepActions() {
        const { stepIndex } = this.state;
        const prevButton = () => {
            if (stepIndex === 0) {
                return null
            }
            return (<FlatButton label="上一步" disabled={stepIndex === 0} onClick={this.handlePrev} />)

        }

        return (
            <div style={{
                margin: '12px 0'
            }}>
                {prevButton()}
                <RaisedButton
                    label={stepIndex === 4
                        ? '确认发布'
                        : '下一步'}
                    primary={true}
                    onClick={this.handleNext}
                    style={{
                        marginRight: 12
                    }} />
            </div>
        );
    }
    renderSelectType() {
        const { type } = this.state;
        let title = '找船或是找货';
        if (type === 1) {
            title = '我要找船';
        } else if (type === 0) {
            title = '我要找货';
        }
        return (
            <Step>
                <StepLabel>{title}</StepLabel>
                <StepContent>
                    <RadioButtonGroup name="type" valueSelected={type} onChange={this.onTypeChange}>
                        <RadioButton value={0} label="找货" />
                        <RadioButton value={1} label="找船" />
                    </RadioButtonGroup>
                    {this.renderStepActions()}
                </StepContent>
            </Step>
        )
    }
    renderSelectCargoType() {
        const { type, cargoType } = this.state;
        const dataSource = ['砂', '石子', '集装箱货物'];
        let title = '选择货物';
        if (cargoType) {
            if (type === 1) {
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
                        dataSource={dataSource}
                        onUpdateInput={this.onCargoTypeChange} />
                    <br /> {this.renderStepActions()}
                </StepContent>
            </Step>
        )
    }
    renderInputCargoTonnage() {
        const { type, cargoTonnage } = this.state;
        let title = cargoTonnage ? `${cargoTonnage}吨` : '货物吨数';

        return (
            <Step>
                <StepLabel>{title}</StepLabel>
                <StepContent>
                    <TextField
                        value={cargoTonnage}
                        onChange={(e, v) => { this.onTextValueChange('cargoTonnage', v) }}
                        floatingLabelText={`请输入你想${type === 0
                            ? '托运'
                            : '装载'}的货物的吨数`} />
                    {this.renderStepActions()}
                </StepContent>
            </Step>
        )
    }
    renderSelectLane() {
        const { origin, destination } = this.state;
        let title = '选择航线';
        if (origin && destination) {
            title = `${origin} 到 ${destination}`
        }
        return (
            <Step>
                <StepLabel>{title}</StepLabel>
                <StepContent>
                    <div>
                        <TextField
                            value={origin}
                            onChange={(e, v) => { this.onTextValueChange('origin', v) }}
                            floatingLabelText="起点" />
                        <TextField
                            value={destination}
                            onChange={(e, v) => { this.onTextValueChange('destination', v) }}
                            floatingLabelText="终点" />
                    </div>
                    {this.renderStepActions()}
                </StepContent>
            </Step>
        )
    }
    renderSelectTime = () => {
        const { shipmentTime } = this.state;
        let title = shipmentTime ? moment(shipmentTime).format('M月D号') : '选择时间';
        return (
            <Step>
                <StepLabel>{title}</StepLabel>
                <StepContent>
                    <DatePicker
                        onChange={this.handleTimeChange}
                        floatingLabelText="装货时间"
                        value={shipmentTime}
                    />
                    {this.renderStepActions()}
                </StepContent>
            </Step>
        )

        // if (type === 1) {
        //     return (
        //         <Step>
        //             <StepLabel>选择时间</StepLabel>
        //             <StepContent>
        //                 <DatePicker
        //                     onChange={this.handleChangeMinDate}
        //                     autoOk={this.state.autoOk}
        //                     floatingLabelText="起始时间"
        //                     defaultDate={this.state.minDate}
        //                     disableYearSelection={this.state.disableYearSelection} />
        //                 <DatePicker
        //                     onChange={this.handleChangeMinDate}
        //                     autoOk={this.state.autoOk}
        //                     floatingLabelText="截止时间"
        //                     defaultDate={this.state.minDate}
        //                     disableYearSelection={this.state.disableYearSelection} /> {this.renderStepActions()}
        //             </StepContent>
        //         </Step>
        //     )
        // } else {
        //     return (
        //         <Step>
        //             <StepLabel>选择时间</StepLabel>
        //             <StepContent>
        //                 <DatePicker
        //                     onChange={this.handleChangeMinDate}
        //                     autoOk={this.state.autoOk}
        //                     floatingLabelText="装货时间"
        //                     defaultDate={this.state.minDate}
        //                     disableYearSelection={this.state.disableYearSelection} /> {this.renderStepActions()}
        //             </StepContent>
        //         </Step>
        //     )
        // }

    }
    render() {
        const { stepIndex, open, alertMessage } = this.state;
        return (
            <div className={styles['add-order-container']}>
                <h2 className={`${styles.title} clearfix`}>
                    <i>发布信息</i>
                    <IconButton onClick={this.props.onClose} iconClassName="material-icons" style={{ float: 'right', 'marginRight': '10px' }}>&#xE5CD;</IconButton>
                </h2>
                <Stepper activeStep={stepIndex} orientation="vertical">
                    {this.renderSelectType()}
                    {this.renderSelectCargoType()}
                    {this.renderInputCargoTonnage()}
                    {this.renderSelectLane()}
                    {this.renderSelectTime()}
                </Stepper>
                <Snackbar
                    open={open}
                    message={alertMessage}
                    autoHideDuration={2000}
                    autoHideDuration={2000} onRequestClose={this.handleAlertRequestClose}
                />
            </div>
        )
    }
}
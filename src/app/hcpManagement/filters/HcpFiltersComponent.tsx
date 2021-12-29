import { Button, Chip, DialogActions, DialogContent, DialogTitle, FormLabel, Paper } from '@material-ui/core';
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";
import moment from 'moment';
import React, { PropsWithChildren } from 'react';
import DatePickers from "react-multi-date-picker";
import DatePanel from "react-multi-date-picker/plugins/date_panel";
import "react-multi-date-picker/styles/layouts/mobile.css";
import './HcpFiltersComponents.scss';
export interface HcpFiltersComponentProps {
    cancel: () => void,
    confirm: () => void,
    setHcpTypeRef: any,
    setStatusRef: any,
    setValueRef: any;
    status: any;
    value?: any;
    hcpType: any;
    hcpTypes: any,
    selectedHcpTypes?: any;
    setSelectedHcpTypes?: any;
    resetFilters: any;
    showStatus?: boolean
}

const HcpFiltersComponent = (props: PropsWithChildren<HcpFiltersComponentProps>) => {
    const afterConfirm = props?.confirm;
    const afterCancel = props?.cancel
    const statusList = [{ name: "Active", code: true }, { name: "Inactive", code: false }];
    const setStatusRef = props?.setStatusRef;
    const setValueRef = props?.setValueRef;
    const hcpTypes = props?.hcpTypes;
    const status = props?.status;
    const selectedHcpTypes = props?.selectedHcpTypes
    const setSelectedHcpTypes = props?.setSelectedHcpTypes
    const resetFilters = props?.resetFilters;
    const showStatus = props?.showStatus;


    const handleDatePicker = (value: any) => {
        let shift_dates = value?.map((item: any) => {
            let mm = item?.month?.number
            let dd = item?.day
            let yyyy = item?.year
            return moment(`${yyyy}-${mm}-${dd}`).format('YYYY-MM-DD')
        })
        setValueRef(shift_dates)
    }

    const handleDelete = (chip: any) => {
        let filterdChips = selectedHcpTypes.filter((item: any) => item?.name !== chip?.name)
        setSelectedHcpTypes(filterdChips)
    }

    return <div className="pdd-40 pdd-top-40 facility-filters">
        <div className="dialog-header d-flex" >
            <DialogTitle id="alert-dialog-title">Filters</DialogTitle>
            <Button onClick={() => {
                resetFilters()
                afterConfirm()
            }} color="secondary" id="btn_reset_filter">
                {'Reset'}
            </Button>
        </div>
        <DialogContent>
            <div className="form-field">
                <FormLabel className={'form-label filter-header'}> HCP Type</FormLabel>
                {hcpTypes !== null ? <Autocomplete
                    PaperComponent={({ children }) => (
                        <Paper style={{ color: "#1e1e1e" }}>{children}</Paper>
                    )}
                    multiple
                    value={selectedHcpTypes}
                    renderTags={() => null}
                    options={hcpTypes}
                    getOptionLabel={(option: any) => option.name}
                    getOptionSelected={(option, value) => option.name === value?.name}
                    placeholder={"Select Hcp Type"}
                    id="input_select_hcpType"
                    className="mrg-top-10"
                    onChange={($event, value) => {
                        setSelectedHcpTypes(value)
                    }
                    }
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            id='select_hcpType'
                            variant='outlined'
                            placeholder={"Select Multiple HCP Types"}

                        />
                    )}
                /> : <></>}
                {
                    selectedHcpTypes.length > 0 && <p className="hcp-chips">{selectedHcpTypes.map((data: any) => <Chip
                        key={data?.name}
                        label={data?.name}
                        onDelete={() => handleDelete(data)}
                    />)}</p>
                }
            </div>
            {
                showStatus && <div className="form-field  mrg-top-20">
                    <FormLabel className={'form-label filter-header'}>Status</FormLabel>
                    <Autocomplete
                        PaperComponent={({ children }) => (
                            <Paper style={{ color: "#1e1e1e" }}>{children}</Paper>
                        )}
                        options={statusList}
                        getOptionLabel={(option: any) => option.name}
                        placeholder={"Select Status"}
                        id="input_select_status"
                        className="mrg-top-10"
                        onChange={($event, value) =>
                            setStatusRef(value?.code)
                        }
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                id='select_status'
                                variant='outlined'
                                value={status}
                                placeholder={"Select Status"}
                                fullWidth
                            />
                        )}
                    />
                </div>
            }
            <div className="form-field mrg-top-20">
                <FormLabel className={'form-label filter-header'}>{('Created On')}</FormLabel>
                <div className="mrg-top-10">
                    <DatePickers
                        required
                        inputClass='custom-input'
                        plugins={[
                            <DatePanel />
                        ]}
                        format="MM/DD/YYYY"
                        range={true}
                        onChange={handleDatePicker}
                        placeholder={"Select Date"}
                        id='input_shift_requirement_shift_datepicker'
                        name="shift_dates"
                    />
                    {/* <DateRangeOutlined className='date-icon' fontSize='large' color='action' /> */}
                </div>
            </div>
        </DialogContent>
        <DialogActions className="mrg-top-40">
            <Button variant='outlined' onClick={() => afterCancel()} color="secondary" id="btn_cancel_filter">
                {'Cancel'}
            </Button>
            <Button onClick={afterConfirm} id="btn_reject_application" className={"submit mrg-left-20"} variant={"contained"} color="primary" autoFocus>
                {'Apply'}
            </Button>
        </DialogActions>
    </div>;
}

export default HcpFiltersComponent;


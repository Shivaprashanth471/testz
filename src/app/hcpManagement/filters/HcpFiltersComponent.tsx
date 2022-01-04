import { Button, Chip, DialogActions, DialogContent, DialogTitle, FormLabel, Paper } from '@material-ui/core';
import TextField from "@material-ui/core/TextField";
import { DateRangeOutlined } from '@material-ui/icons';
import Autocomplete from "@material-ui/lab/Autocomplete";
import React, { PropsWithChildren } from 'react';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import './HcpFiltersComponents.scss';
export interface HcpFiltersComponentProps {
    cancel: () => void,
    confirm: () => void,
    status: any;
    setStatus: any,
    hcpTypes: any,
    selectedHcpTypes?: any;
    setSelectedHcpTypes?: any;
    resetFilters: any;
    showStatus?: boolean
    dateRange: any;
    setDateRange: any;
}

const HcpFiltersComponent = (props: PropsWithChildren<HcpFiltersComponentProps>) => {
    const afterConfirm = props?.confirm;
    const afterCancel = props?.cancel
    const statusList = [{ name: "Active", code: true }, { name: "Inactive", code: false }];
    const hcpTypes = props?.hcpTypes;
    const status = props?.status;
    const setStatus = props?.setStatus;
    const selectedHcpTypes = props?.selectedHcpTypes
    const setSelectedHcpTypes = props?.setSelectedHcpTypes
    const resetFilters = props?.resetFilters;
    const showStatus = props?.showStatus;

    const dateRange = props?.dateRange
    const setDateRange = props?.setDateRange
    const [startDate, endDate] = dateRange;

    const handleDelete = (chip: any) => {
        let filterdChips = selectedHcpTypes.filter((item: any) => item?.name !== chip?.name)
        setSelectedHcpTypes(filterdChips)
    }

    return <div className="pdd-40 pdd-top-40 filters">
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
                        value={status}
                        options={statusList}
                        getOptionLabel={(option: any) => option.name}
                        placeholder={"Select Status"}
                        id="input_select_status"
                        className="mrg-top-10"
                        onChange={($event, value) =>
                            setStatus(value)
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
                <div className="mrg-top-10 date-range-picker">
                    <DatePicker
                        dateFormat="MM/dd/yyyy"
                        placeholderText="Select Date"
                        className='custom-input'
                        selectsRange={true}
                        startDate={startDate}
                        endDate={endDate}
                        onChange={(update) => {
                            setDateRange(update);
                        }}
                        isClearable={true}
                    />
                    {
                        (!dateRange[0] && !dateRange[1]) && <DateRangeOutlined className='date-icon' fontSize='large' color='action' />
                    }

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


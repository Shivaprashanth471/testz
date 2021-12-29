import { Button, Chip, DialogActions, DialogContent, DialogTitle, FormLabel, Paper } from '@material-ui/core';
import React, { PropsWithChildren } from 'react';
import Autocomplete from "@material-ui/lab/Autocomplete";
import TextField from "@material-ui/core/TextField";
import DatePickers from "react-multi-date-picker";
import DatePanel from "react-multi-date-picker/plugins/date_panel";
import { AllShiftStatusList, SomeShiftStatusList, shiftType } from "../../../constants/data";
import './ShiftFilter.scss'
import moment from 'moment';

export interface ShiftFilterProps {
    cancel: () => void,
    confirm: () => void,
    hcpTypes: any,
    facilityList: any,
    hcpTypeRef?: any,
    valueRef?: any,
    statusRef?: any,
    facilityIdRef: any,
    timeTypeRef: any,
    noStatus?: boolean;

    isMaster?: boolean;
    isCompleted?: boolean;
    isRequired?: boolean;
    isInProgress?: boolean;

    setValueRef?: any,
    setStatusRef?: any,
    setHcpTypeRef: any,
    setTimeTypeRef: any,
    setFacilityIdRef: any,
    resetFilters: any;

    regions?: any;
    selectedRegion?: any;
    setSelectedRegion?: any

    selectedHcps?: any;
    setSelectedHcps?: any;
    selectedTimeTypes?: any;
    selectedStatusTypes?: any;
    setSelectedTimeTypes?: any;
    selectedFaciltities?: any;
    setSelectedFacilities?: any;
    setSelectedStatusTypes?: any;
    statusType?: any;
    setStatusType?: any;

    selectedDates?: any;
    setSelectedDates?: any;
}

const ShiftFilter = (props: PropsWithChildren<ShiftFilterProps>) => {
    const afterConfirm = props?.confirm;
    const afterCancel = props?.cancel;
    const hcpTypes = props?.hcpTypes;
    const regions = props?.regions;
    const selectedRegion = props?.selectedRegion;
    const setSelectedRegion = props?.setSelectedRegion;
    const isMaster = props?.isMaster
    const statusList = props?.isMaster ? AllShiftStatusList : SomeShiftStatusList

    const setValueRef = props?.setValueRef;
    const facilityList = props?.facilityList;
    const resetFilters = props?.resetFilters
    const noMultiStatus = props?.noStatus
    const isCompleted = props?.isCompleted
    const isRequired = props?.isRequired
    const isInProgress = props?.isInProgress

    const selectedHcps = props?.selectedHcps
    const setSelectedHcps = props?.setSelectedHcps
    const selectedTimeTypes = props?.selectedTimeTypes
    const selectedStatusTypes = props?.selectedStatusTypes
    const setSelectedTimeTypes = props?.setSelectedTimeTypes
    const selectedFaciltities = props?.selectedFaciltities
    const setSelectedFacilities = props?.setSelectedFacilities
    const setSelectedStatusTypes = props?.setSelectedStatusTypes
    const setStatusType = props?.setStatusType
    const statusType = props?.statusType

    const setSelectedDates = props?.setSelectedDates



    const handleDatePicker = (value: any) => {
        let shift_dates = value?.map((item: any) => {
            let mm = item?.month?.number
            let dd = item?.day
            let yyyy = item?.year
            return moment(`${yyyy}-${mm}-${dd}`).format('YYYY-MM-DD')
        })
        setValueRef(shift_dates)
        setSelectedDates(shift_dates)
    }

    const formatDateFieldLabel = () => {
        if (isCompleted) {
            return "Completed On"
        } else if (isRequired || isInProgress) {
            return "Required On"
        } else {
            return "Shift Date"
        }
    }

    const handleFacilityDelete = (chip: any) => {
        let filterdChips = selectedFaciltities?.filter((item: any) => item?._id !== chip)
        setSelectedFacilities(filterdChips)
    }

    const handleHcpDelete = (chip: any) => {
        let filterdChips = selectedHcps?.filter((item: any) => item !== chip)
        setSelectedHcps(filterdChips)

    }

    const handleStatusDelete = (chip: any) => {
        let filterdChips = selectedStatusTypes?.filter((item: any) => item !== chip)
        setSelectedStatusTypes(filterdChips)

    }

    const handleTimeTypeDelete = (chip: any) => {
        let filterdChips = selectedTimeTypes?.filter((item: any) => item !== chip)
        setSelectedTimeTypes(filterdChips)
    }

    return <div className="pdd-30 pdd-top-40 facility-filters">
        <div className="dialog-header d-flex">
            <DialogTitle id="alert-dialog-title">Filters</DialogTitle>
            <Button onClick={() => {
                resetFilters()
                afterCancel()
            }} color="secondary" id="btn_reset_filter">
                {'Reset'}
            </Button>
        </div>
        <DialogContent>
            <div className="form-field">
                <FormLabel className={'form-label'}>Select Region</FormLabel>
                {facilityList !== null ? <Autocomplete
                    PaperComponent={({ children }) => (
                        <Paper style={{ color: "#1e1e1e" }}>{children}</Paper>
                    )}
                    options={regions}
                    getOptionLabel={(option: any) => option.name}
                    getOptionSelected={(option: any, value) => option?.name === value?.name}
                    placeholder={"Region"}
                    id="input_select_regions"
                    className="mrg-top-10"
                    onChange={($event, value) => {
                        setSelectedRegion(value?.code)
                        if (value) {
                            if (selectedRegion !== value?.code) {
                                setSelectedFacilities([])
                            }
                        }

                    }
                    }
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            id='select_region'
                            variant='outlined'
                            placeholder={"Select Region"}
                            value={selectedRegion}
                        />
                    )}
                /> : <></>}
            </div>

            <div className="form-field mrg-top-20">
                <FormLabel className={'form-label'}>Facility</FormLabel>
                {
                    facilityList !== null && <Autocomplete
                        className="mrg-top-10"
                        PaperComponent={({ children }) => (
                            <Paper style={{ color: "#1e1e1e" }}>{children}</Paper>
                        )}
                        multiple
                        options={facilityList}
                        getOptionLabel={(option) => option?.facility_name}
                        getOptionSelected={(option, value) => option.facility_name === value?.facility_name}
                        value={selectedFaciltities}
                        id="input_select_facility"
                        onChange={(e, newValue) => {
                            setSelectedFacilities(newValue)
                        }}
                        renderTags={() => null}
                        renderInput={(params) => (
                            <TextField {...params} variant='outlined' placeholder="Select Multiple Facilities" />
                        )}
                    />
                }
                {
                    selectedFaciltities.length > 0 && <p className="hcp-chips">{selectedFaciltities.map((data: any) => <Chip
                        key={data?._id}
                        label={data?.facility_name}
                        onDelete={() => handleFacilityDelete(data?._id)}
                    />)}</p>
                }
            </div>

            <div className="form-field mrg-top-20">
                <FormLabel className={'form-label'}>HCP Types</FormLabel>
                {
                    hcpTypes !== null && <Autocomplete
                        className="mrg-top-10"
                        PaperComponent={({ children }) => (
                            <Paper style={{ color: "#1e1e1e" }}>{children}</Paper>
                        )}
                        multiple
                        value={selectedHcps}
                        id="input_select_hcps"
                        options={hcpTypes?.map((option: any) => option?.code)}
                        onChange={(e, newValue) => setSelectedHcps(newValue)}
                        renderTags={() => null}
                        renderInput={(params) => (
                            <TextField {...params} variant='outlined' placeholder="Select Multiple HCP Types" />
                        )}
                    />
                }
                {
                    selectedHcps.length > 0 && <p className="hcp-chips">{selectedHcps.map((data: any) => <Chip
                        key={data}
                        label={data}
                        onDelete={() => handleHcpDelete(data)}
                    />)}</p>
                }
            </div>
            {
                !noMultiStatus && !isMaster && <div className="form-field mrg-top-20">
                    <FormLabel className={'form-label'}>Status</FormLabel>
                    <Autocomplete
                        PaperComponent={({ children }) => (
                            <Paper style={{ color: "#1e1e1e" }}>{children}</Paper>
                        )}
                        className="mrg-top-10"
                        value={statusType}
                        id="input_select_status"
                        options={statusList.map((option: any) => option?.code)}
                        onChange={(e, newValue) => {
                            setStatusType(newValue)
                        }}
                        renderInput={(params) => (
                            <TextField {...params} variant='outlined' placeholder="Select Status" />
                        )}
                    />
                </div>
            }

            {
                isMaster && <div className="form-field mrg-top-20">
                    <FormLabel className={'form-label'}>Status Types</FormLabel>
                    <Autocomplete
                        className="mrg-top-10"
                        PaperComponent={({ children }) => (
                            <Paper style={{ color: "#1e1e1e" }}>{children}</Paper>
                        )}
                        multiple
                        value={selectedStatusTypes}
                        id="input_select_status"
                        options={statusList.map((option: any) => option?.code)}
                        onChange={(e, newValue) => setSelectedStatusTypes(newValue)}
                        renderTags={() => null}
                        renderInput={(params) => (
                            <TextField {...params} variant='outlined' placeholder="Select Multiple Status" />
                        )}
                    />
                    {
                        selectedStatusTypes.length > 0 && <p className="hcp-chips">{selectedStatusTypes.map((data: any) => <Chip
                            key={data}
                            label={data}
                            onDelete={() => handleStatusDelete(data)}
                        />)}</p>
                    }
                </div>
            }
            <div className="form-field mrg-top-20">
                <FormLabel className={'form-label'}>{formatDateFieldLabel()}</FormLabel>
                <div className="mrg-top-10">
                    <DatePickers
                        required
                        inputClass='custom-input'
                        className="rmdp-prime"
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
                </div>
                <div className="form-field mrg-top-20">
                    <FormLabel className={'form-label'}>Time Type</FormLabel>
                    <Autocomplete
                        className="mrg-top-10"
                        PaperComponent={({ children }) => (
                            <Paper style={{ color: "#1e1e1e" }}>{children}</Paper>
                        )}
                        multiple
                        value={selectedTimeTypes}
                        id="input_select_time_types"
                        options={shiftType.map((option: any) => option?.value)}
                        onChange={(e, newValue) => setSelectedTimeTypes(newValue)}
                        renderTags={() => null}
                        renderInput={(params) => (
                            <TextField {...params} variant='outlined' placeholder="Select Multiple Time Types" />
                        )}
                    />
                    {
                        selectedTimeTypes.length > 0 && <p className="hcp-chips">{selectedTimeTypes.map((data: any) => <Chip
                            key={data}
                            label={data}
                            onDelete={() => handleTimeTypeDelete(data)}
                        />)}</p>
                    }
                </div>
            </div>
        </DialogContent>
        <DialogActions className="mrg-top-40">
            <Button onClick={afterCancel} color="secondary" variant='outlined' id="btn_cancel_filter">
                {'Cancel'}
            </Button>
            <Button onClick={() => {
                afterConfirm()
            }} id="btn_reject_application" className={"submit mrg-left-20"} variant={"contained"} color="primary" autoFocus>
                {'Apply'}
            </Button>
        </DialogActions>
    </div>;
}

export default ShiftFilter;
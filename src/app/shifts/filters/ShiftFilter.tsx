import { Chip, Paper } from '@material-ui/core';
import TextField from "@material-ui/core/TextField";
import { DateRangeOutlined } from '@material-ui/icons';
import Autocomplete from "@material-ui/lab/Autocomplete";
import React, { PropsWithChildren } from 'react';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import "react-multi-date-picker/styles/layouts/mobile.css";
import { AllShiftStatusList, shiftType, OpenShiftsStatusList } from "../../../constants/data";
import { localStore } from '../../../helpers';
import './ShiftFilter.scss';


export interface ShiftFilterProps {
    hcpTypes: any,
    facilityList: any,
    noStatus?: boolean;

    isMaster?: boolean;
    isCompleted?: boolean;
    isRequired?: boolean;
    isInProgress?: boolean;

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

    dateRange: any;
    setDateRange: any;
}

const ShiftFilter = (props: PropsWithChildren<ShiftFilterProps>) => {


    const selectedRegion = props?.selectedRegion;
    const setSelectedRegion = props?.setSelectedRegion;
    const isMaster = props?.isMaster
    const statusList = props?.isMaster ? AllShiftStatusList : OpenShiftsStatusList

    const regions: any[] = props?.regions ? props?.regions : [];
    const facilityList: any[] = props?.facilityList ? props?.facilityList : [];
    const hcpTypes: any[] = props?.hcpTypes ? props?.hcpTypes : [];

    const resetFilters = props?.resetFilters
    const noMultiStatus = props?.noStatus

    const selectedFaciltities = props?.selectedFaciltities
    const selectedHcps = props?.selectedHcps
    const setSelectedHcps = props?.setSelectedHcps
    const statusType = props?.statusType
    const selectedStatusTypes = props?.selectedStatusTypes
    const selectedTimeTypes = props?.selectedTimeTypes
    const setSelectedTimeTypes = props?.setSelectedTimeTypes
    const setSelectedStatusTypes = props?.setSelectedStatusTypes
    const setSelectedFacilities = props?.setSelectedFacilities
    const setStatusType = props?.setStatusType


    const dateRange = props?.dateRange
    const setDateRange = props?.setDateRange
    const [startDate, endDate] = dateRange;

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


    let regularCheckForAllFields = selectedFaciltities?.length > 0 || selectedHcps?.length > 0 || selectedTimeTypes?.length > 0 || selectedStatusTypes?.length > 0 || (dateRange[0] !== null || dateRange[1] !== null)
    let checkForStatusField = noMultiStatus ? false : !isMaster && (statusType !== "" && statusType !== null)

    const handleDisableReset = (): boolean => {
        if (regularCheckForAllFields || checkForStatusField) { return false }
        else {
            return true
        }
    }

    return <div className="shift-filters mrg-bottom-20">
        <div className="form-field-wrapper">
            <div className="form-field-left">
                <div className="form-field-item">
                    <Autocomplete
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
                                placeholder='Select Region'
                                value={selectedRegion}
                            />
                        )}
                    />
                </div>

                <div className="form-field-item">

                    <Autocomplete
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
                            <TextField {...params} variant='outlined' placeholder="Select Facilities" />
                        )}
                    />
                </div>

                <div className="form-field-item">
                    <Autocomplete
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
                            <TextField {...params} variant='outlined' placeholder="Select HCP Types" />
                        )}
                    />
                </div>

                {
                    !noMultiStatus && !isMaster && <div className="form-field-item">
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
                    isMaster && <div className="form-field-item">
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
                                <TextField {...params} variant='outlined' placeholder="Select Status" />
                            )}
                        />
                    </div>
                }

                <div className="form-field-item">
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
                            <TextField {...params} variant='outlined' placeholder="Select Time Types" />
                        )}
                    />

                </div>

            </div>
            <div className="form-field-right">
                <div className="mrg-top-10">
                    <label className='label-wrapper'>
                        <DatePicker
                            dateFormat="MM/dd/yyyy"
                            placeholderText="Select Date"
                            className='custom-input'
                            selectsRange={true}
                            startDate={startDate && new Date(startDate)}
                            endDate={endDate && new Date(endDate)}
                            onChange={(update) => {
                                setDateRange(update);
                            }}
                            isClearable={true}
                        />
                    </label>
                    {
                        (!dateRange[0] && !dateRange[1]) && <DateRangeOutlined className='date-icon' fontSize='medium' color='action' />
                    }
                </div>
            </div>


        </div>
        <div className="custom-chips-wrapper">
            {
                selectedFaciltities && selectedFaciltities.length > 0 && <p className="custom-chips">{selectedFaciltities.map((data: any) => <Chip
                    key={data?._id}
                    label={data?.facility_name}
                    onDelete={() => handleFacilityDelete(data?._id)}
                />)}</p>
            }
            {
                selectedHcps && selectedHcps.length > 0 && <p className="custom-chips">{selectedHcps.map((data: any) => <Chip
                    key={data}
                    label={data}
                    onDelete={() => handleHcpDelete(data)}
                />)}</p>
            }
            {
                selectedStatusTypes && selectedStatusTypes.length > 0 && <p className="custom-chips">{selectedStatusTypes.map((data: any) => <Chip
                    key={data}
                    label={data}
                    onDelete={() => handleStatusDelete(data)}
                />)}</p>
            }
            {
                selectedTimeTypes && selectedTimeTypes.length > 0 && <p className="custom-chips">{selectedTimeTypes.map((data: any) => <Chip
                    key={data}
                    label={data}
                    onDelete={() => handleTimeTypeDelete(data)}
                />)}</p>
            }
            <span
                onClick={() => {
                    resetFilters()
                }} color="secondary" id="btn_reset_filter" className={`clear-all-filters mrg-top-10  ${handleDisableReset() ? ' hide-filter' : 'show-filter'}`}>
                Clear All Filters
            </span>
        </div>
    </div>;
}


export const clearShiftFilterValues = () => {
    localStore.removeItem('selectedRegion')
    localStore.removeItem('selectedFacilities')
    localStore.removeItem('selectedHcps')
    localStore.removeItem('statusType')
    localStore.removeItem('selectedStatusTypes')
    localStore.removeItem('dateRange')
    localStore.removeItem('selectedTimeTypes')

}

export default ShiftFilter;
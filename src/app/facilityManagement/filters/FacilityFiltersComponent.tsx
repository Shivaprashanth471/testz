import { Chip, Paper } from '@material-ui/core';
import TextField from "@material-ui/core/TextField";
import { DateRangeOutlined } from '@material-ui/icons';
import Autocomplete from "@material-ui/lab/Autocomplete";
import React, { PropsWithChildren } from 'react';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import "react-multi-date-picker/styles/layouts/mobile.css";
import { localStore } from '../../../helpers';
import "./FacilityFiltersComponent.scss";

export interface FacilityFiltersComponentProps {
    status: any;
    setStatus: any,
    regionList: any,
    dateRange: any;
    setDateRange: any;
    selectedRegions?: any;
    setSelectedRegions?: any;
    resetFilters: any;
}


const FacilityFiltersComponent = (props: PropsWithChildren<FacilityFiltersComponentProps>) => {
    const statusList = [{ name: "Active", code: true }, { name: "Inactive", code: false }]
    const setStatus = props?.setStatus;
    const status = props?.status;

    const dateRange = props?.dateRange
    const setDateRange = props?.setDateRange
    const [startDate, endDate] = dateRange;

    const regionList: any[] = props.regionList ? props.regionList : [];
    const selectedRegions = props?.selectedRegions
    const setSelectedRegions = props?.setSelectedRegions
    const resetFilters = props?.resetFilters;

    const handleDelete = (chip: any) => {
        let filterdChips = selectedRegions.filter((item: any) => item?.name !== chip?.name)
        setSelectedRegions(filterdChips)
    }

    const handleDisableReset = (): boolean => {
        if (selectedRegions?.length !== 0 || (status !== "" && status !== null) || (dateRange[0] !== null || dateRange[1] !== null)) { return false }
        else {
            return true
        }
    }

    return <div className="facility-filters mrg-bottom-20">
        <div className="form-field-wrapper">
            <div className="form-field-left">
                <div className="form-field-left-items">
                    <div className='form-field-item'>
                        <Autocomplete
                            PaperComponent={({ children }) => (
                                <Paper style={{ color: "#1e1e1e" }}>{children}</Paper>
                            )}
                            multiple
                            options={regionList}
                            value={selectedRegions}
                            getOptionLabel={(option: any) => option.name}
                            getOptionSelected={(option, value) => {
                                return option.name === value?.name
                            }}
                            id="input_select_region"
                            className="mrg-top-10 "
                            onChange={($event, value) => {
                                setSelectedRegions(value)
                            }}
                            renderTags={() => null}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    id='select_region'
                                    variant='outlined'
                                    placeholder={"Select Multiple Regions"}
                                />
                            )}
                        />
                    </div>

                    <div className='form-field-item'>
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
                            onChange={($event, value) => {
                                setStatus(value)
                            }
                            }
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    id='select_status'
                                    variant='outlined'
                                    placeholder={"Select Status"}
                                />
                            )}
                        />

                    </div>
                </div>
            </div>

            <div className="form-field-right">
                <label>
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
                    {
                        (!dateRange[0] && !dateRange[1]) && <DateRangeOutlined className='date-icon' fontSize='medium' color='action' />
                    }
                </label>
            </div>

        </div>
        <div className="facility-chips-wrapper">
            {
                selectedRegions && selectedRegions.length > 0 && <p className="hcp-chips">{selectedRegions.map((data: any) => <Chip
                    key={data?.name}
                    label={data?.name}
                    onDelete={() => handleDelete(data)}
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


export const clearFacilityFilterValues = () => {
    localStore.removeItem('facilityRegions')
    localStore.removeItem('facilityStatus')
    localStore.removeItem('facilityDateRange')
}

export default FacilityFiltersComponent;



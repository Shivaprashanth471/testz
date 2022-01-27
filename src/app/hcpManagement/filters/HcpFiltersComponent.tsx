import { Chip, Paper } from '@material-ui/core';
import TextField from "@material-ui/core/TextField";
import { DateRangeOutlined } from '@material-ui/icons';
import Autocomplete from "@material-ui/lab/Autocomplete";
import React, { PropsWithChildren } from 'react';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { approvedListStatus, onboardedListStatus } from '../../../constants/data';
import { localStore } from '../../../helpers';
import './HcpFiltersComponents.scss';
export interface HcpFiltersComponentProps {

    status: any;
    setStatus: any,
    hcpTypes: any,
    selectedHcpTypes?: any;
    setSelectedHcpTypes?: any;
    resetFilters: any;
    dateRange: any;
    setDateRange: any;
    isApprovedList?: boolean;
}

const HcpFiltersComponent = (props: PropsWithChildren<HcpFiltersComponentProps>) => {

    const statusList = props?.isApprovedList ? approvedListStatus : onboardedListStatus;
    const hcpTypes = props?.hcpTypes ? props?.hcpTypes : [];
    const status = props?.status;
    const setStatus = props?.setStatus;
    const selectedHcpTypes = props?.selectedHcpTypes
    const setSelectedHcpTypes = props?.setSelectedHcpTypes
    const resetFilters = props?.resetFilters;

    const dateRange = props?.dateRange
    const setDateRange = props?.setDateRange
    const [startDate, endDate] = dateRange;

    const handleDelete = (chip: any) => {
        let filterdChips = selectedHcpTypes.filter((item: any) => item?.name !== chip?.name)
        setSelectedHcpTypes(filterdChips)
    }

    const handleDisableReset = (): boolean => {
        if (selectedHcpTypes?.length > 0 || (status !== "" && status !== null) || (dateRange[0] !== null || dateRange[1] !== null)) return false
        else {
            return true
        }
    }

    return <div className="hcp-filters mrg-bottom-20">
        {JSON.stringify(status)}
        <div className="form-field-wrapper">
            <div className={`form-field-left`}>
                <div className="form-field-left-items">
                    <div className="form-field-item">
                        <Autocomplete
                            PaperComponent={({ children }) => (
                                <Paper style={{ color: "#1e1e1e" }}>{children}</Paper>
                            )}
                            multiple
                            value={selectedHcpTypes}
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
                            renderTags={() => null}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    id='select_hcpType'
                                    variant='outlined'
                                    placeholder={"Select Multiple HCP Types"}

                                />
                            )}
                        />
                    </div>



                    <div className="form-field-item">
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

                </div>
            </div>
            <div className="form-field-right">

                <div className="form-field-item">
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
        </div>

        <div className="hcp-chips-wrapper">
            {
                selectedHcpTypes.length > 0 && <p className="hcp-chips">{selectedHcpTypes.map((data: any) => <Chip
                    key={data?.name}
                    label={data?.name}
                    onDelete={() => handleDelete(data)}
                />)}</p>
            }

            <span
                className={`clear-all-filters mrg-top-10 ${handleDisableReset() ? 'hide-filter' : 'show-filter'}`}
                onClick={() => {
                    resetFilters()

                }} color="secondary" id="btn_reset_filter">
                Clear All Filters
            </span>
        </div>


    </div>;
}


export const clearHcpFilterValues = () => {
    localStore.removeItem('hcpSelectedTypes')
    localStore.removeItem('hcpStatus')
    localStore.removeItem('hcpDateRange')
}

export default HcpFiltersComponent;


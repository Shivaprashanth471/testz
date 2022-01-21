import {Button, TextField as NormalTextField} from "@material-ui/core";
import moment from "moment";
import React from "react";
import "react-multi-date-picker/styles/layouts/mobile.css";
import { CommonService } from "../../../helpers";
import "./AddShiftsScreen.scss";

interface readOnlyProps {
    mode: any;
    facilityOffset: any;
    item: any;
    setShifts: any;
    shifts: any[],
}

const ReadOnlyShifts = ({ mode, facilityOffset, item, setShifts, shifts }: readOnlyProps) => {

    return <div className="custom-card mrg-top-20 ">
        <div className="shift-first-row shift-row mrg-top-30">
            <NormalTextField
                variant='outlined'
                fullWidth
                disabled
                label="Title"
                value={item?.title}
                id='input_add_shift_requirement_title'
            />
            <NormalTextField
                variant='outlined'
                fullWidth
                disabled
                label="HCP Type"
                value={item?.hcp_type}
                id='input_add_shift_requirement_hcp_type'
            />
            <NormalTextField
                variant='outlined'
                value={item?.shift_dates ? item?.shift_dates : item?.start_date && ` ${item?.start_date} - ${item?.end_date}`}
                fullWidth
                disabled
                id='input_add_shift_requirement_shift_dates'
            />


        </div>

        <div className="shift-second-row shift-row mrg-top-30 ">
            <NormalTextField
                variant='outlined'
                value={(item?.start_time || item?.end_time) ? `${moment(CommonService.convertMinsToHrsMins(item?.start_time), 'hh:mm').format('LT')} - ${moment(CommonService.convertMinsToHrsMins(item?.end_time), 'hh:mm').format('LT')}- ${item?.shift_type}` : "NA"}

                fullWidth
                disabled
                label="Shift Timing & Shift Type"
                id='input_add_shift_requirement_shift_timing_type'
            />

            <NormalTextField
                variant='outlined'
                value={item?.warning_type}
                fullWidth
                disabled
                label="Warning Zone"
                id='input_add_shift_requirement_warning_zone'
            />

            <NormalTextField
                variant='outlined'
                fullWidth
                disabled
                label="No Of HCPs"
                value={item?.hcp_count}
                id='input_add_shift_requirement_hcp_count'
            />
        </div>

        <div className="shift-third-row mrg-top-30">
            <NormalTextField
                variant='outlined'
                fullWidth
                multiline
                minRows={2}
                label="Shift Requirement Details"
                disabled
                value={item?.shift_details}
                id='input_add_shift_requirement_details'
            />
        </div>
        <div className='mrg-top-20' style={{ textAlign: 'center' }}>
            <Button
                id='btn_add_shift_requirement_delete'
                color={"primary"}
                variant={"outlined"}
                type="reset"
                onClick={() => {
                    setShifts(
                        shifts.filter(
                            (el, index) =>
                                el.temp_id !== item.temp_id
                        )
                    );
                }}
            >
                Delete
            </Button>
        </div>
    </div>
}


export default ReadOnlyShifts
import React from 'react'
import { AnyObject } from 'yup/lib/object'
import './ShiftTimeline.scss'


const ShiftTimeline = (props: any) => {

    const tConvert = (time: AnyObject) => {
        // Check correct time format and split into components
        time = time.toString().match(/^([01]\d|2[0-3])(:)([0-5]\d)(:[0-5]\d)?$/) || [time];

        if (time.length > 1) { // If time format correct
            time = time.slice(1);  // Remove full string match value
            time[5] = +time[0] < 12 ? ' AM' : ' PM'; // Set AM/PM
            time[0] = +time[0] % 12 || 12; // Adjust hours
        }
        return time.join(''); // return adjusted time or original string
    }

    const dateFormat = (date: any) => {
        const [year, month, day] = date.split("-")
        if (year && month && day) {
            return month + "-" + day + "-" + year
        } else {
            return "--"
        }
    }
    console.log(props?.timeBreakup?.break_timings)
    return (
        <div className='timeline '>
            <div className="wrap">
                <div className="points">
                    <div className="dot">
                        <span className='dot-title'>Check-In</span>
                        <span className='dot-time'>{props?.timeBreakup?.check_in_time ? dateFormat(props?.timeBreakup?.check_in_time.slice(0, 10)) : "--"} <br />{props?.timeBreakup?.check_in_time ? tConvert((props?.timeBreakup?.check_in_time).slice(11, 16)) : '--'}</span>
                    </div>
                    {
                        props?.timeBreakup?.break_timings?.map((item: any, index: number) => {
                            return <div key={"shift-timeline-"+index}>
                                <div className="small-dot">
                                    <span className='small-dot-title'>Break In</span>
                                    <span className='small-dot-time'>{item?.break_in_time ? dateFormat((item?.break_in_time).slice(0, 10)) : "--"}<br />{item?.break_in_time ? tConvert((item?.break_in_time).slice(11, 16)) : '--'}</span>
                                </div>
                                <div className="small-dot">
                                    <span className='small-dot-title'>Break Out</span>
                                    <span className='small-dot-time'>{item?.break_out_time ? dateFormat((item?.break_out_time).slice(0, 10)) : "--"}<br />{item?.break_out_time ? tConvert((item?.break_out_time).slice(11, 16)) : '--'}</span>

                                </div>
                            </div>
                        })
                    }
                    <div className="dot">
                        <span className='dot-title'>Check-Out</span>
                        <span className='dot-time'>{props?.timeBreakup?.check_out_time ? dateFormat((props?.timeBreakup?.check_out_time).slice(0, 10)) : "--"}<br />{props?.timeBreakup?.check_out_time ? tConvert((props?.timeBreakup?.check_out_time).slice(11, 16)) : '--'}</span>
                    </div>

                </div>
            </div>

            <div className="timeline-hours ">
                <p>{JSON.stringify(props?.time_breakup?.check_in_time)}</p>
                <p>{JSON.stringify(props?.time_breakup?.check_out_time)}</p>
            </div>
        </div>
    )
}

export default ShiftTimeline

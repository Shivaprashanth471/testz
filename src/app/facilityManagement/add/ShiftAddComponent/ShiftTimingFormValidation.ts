import * as Yup from "yup";
import { CommonService } from "../../../../helpers";


export const shiftFormValidation = Yup.object({
    shift_start_time: Yup.string().required('required'),
    shift_end_time: Yup.string().required('required').test('shift_start_time', "Start Time and End Time can not be same", function (item) {
        let isSame: boolean = true;
        if (this.parent.shift_start_time && this.parent.shift_end_time) {
            isSame = CommonService.convertHoursToMinutes(this.parent.shift_start_time) === CommonService.convertHoursToMinutes(this.parent.shift_end_time)
            return !isSame
        }
        return isSame

    }),
    shift_type: Yup.string().required('required'),
});
import {
  Button, CircularProgress, MenuItem,
  Paper, TextField as NormalTextField
} from "@material-ui/core";
import { DateRangeOutlined } from "@material-ui/icons";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { Field, Form, Formik, FormikHelpers } from "formik";
import { TextField } from "formik-material-ui";
import moment from "moment";
import { nanoid } from 'nanoid';
import React, { useCallback, useEffect, useState } from "react";
import DatePickers from "react-multi-date-picker";
import DatePanel from "react-multi-date-picker/plugins/date_panel";
import "react-multi-date-picker/styles/layouts/mobile.css";
import { useHistory } from "react-router-dom";
import ScrollToTop from "react-scroll-to-top";
import * as Yup from "yup";
import DialogComponent from "../../../components/DialogComponent";
import LeavePageConfirmationComponent from "../../../components/shared/LeavePageConfirmationComponent";
import { ENV } from "../../../constants";
import {
  calenderMode, warningZone
} from "../../../constants/data";
import { ApiService, CommonService, Communications } from "../../../helpers";
import "./AddShiftsScreen.scss";
import ReadOnlyShifts from "./ReadOnlyShifts";


interface ShiftItem {
  temp_id?: string,
  title: string,
  hcp_type: string;
  mode: string;
  start_time: string | number,
  end_time: string | number,
  shift_dates: any;
  shift_type: string;
  warning_type: string;
  hcp_count: string;
  shift_details: string;
}

let shiftInitialState: ShiftItem = {
  temp_id: "",
  title: "",
  hcp_type: "",
  mode: "",
  start_time: "",
  end_time: "",
  shift_type: "",
  shift_dates: [],
  warning_type: "",
  hcp_count: "",
  shift_details: "",
};

const AddShiftsScreen = () => {
  const history = useHistory()
  const [facilities, setFacilities] = useState<any[]>([]);
  const [facilityId, setFacilityId] = useState<any>("");
  const [shifts, setShifts] = useState<any[]>([]);
  const [shiftTimings, setShiftTimings] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [shiftLoading, setShiftLoading] = useState<boolean>(false);
  const [hcpTypesLoading, setHcpTypesLoading] = useState<boolean>(true);
  const [facilityOffset, setFacilityOffset] = useState<any>(null)
  const [isShifts, setIsShifts] = useState<boolean>(false);
  const [doubleClick, setDoubleClick] = useState<boolean>(false);
  const [hcpTypes, setHcpTypes] = useState<any>([])
  const [isAddOpen, setIsAddOpen] = useState<boolean>(false);

  const [value, setValue] = useState<any>(null)
  const [mode, setMode] = useState('')


  const user: any = localStorage.getItem("currentUser");
  let currentUser = JSON.parse(user);

  const handleCancelAdd = () => {
    setIsShifts(false);
  };

  function handleDatePicker(value: any) {
    setValue(value)
  }

  const getFacilityData = useCallback(() => {
    ApiService.post(ENV.API_URL + "facility/lite")
      .then((res) => {
        setFacilities(res?.data || []);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  }, []);

  const getFacilityShiftTimings = useCallback((facilityId: string) => {
    ApiService.get(ENV.API_URL + "facility/" + facilityId + "/shift")
      .then((res) => {
        setShiftTimings(res.data || []);
        setShiftLoading(false);
      })
      .catch((err) => {
        setShiftLoading(false);
      });
  }, []);

  const getFacilityOffset = useCallback((facilityId: string) => {
    ApiService.get(ENV.API_URL + "facility/" + facilityId)
      .then((res) => {
        setFacilityOffset(res?.data?.timezone);
      })
      .catch((err) => {
      });
  }, []);

  const getHcpTypes = useCallback(() => {
    CommonService._api.get(ENV.API_URL + "meta/hcp-types").then((resp) => {
      setHcpTypes(resp.data || []);
      setHcpTypesLoading(false);
    }).catch((err) => {
      console.log(err);
    });
  }, []);

  const hcpFormValidation = Yup.object({
    title: Yup.string().min(6, "min 6 characters").trim("empty space not allowed").required('required'),
    shift_dates: Yup.array().required('required'),
    mode: Yup.string().required("required"),
    shift_type: Yup.string().required('required'),
    hcp_type: Yup.string().required('required'),
    warning_type: Yup.string().required('required'),
    hcp_count: Yup.number()
      .typeError('must be a number')
      .min(1, 'min limit 1.')
      .max(25, 'max limit 25.').required('required'),
    shift_details: Yup.string().trim("empty space not allowed").required('required'),
  });

  const handleFacilitySelect = (facility: any) => {
    setShiftTimings([])

    if (facility) {
      setFacilityId(facility?._id)
      getFacilityShiftTimings(facility?._id)
      getFacilityOffset(facility?._id)
    }

  }

  const formatShiftTimings = (item: any) => {
    let start = moment(CommonService.convertMinsToHrsMins(item?.shift_start_time), 'hh:mm').format('LT')
    let end = moment(CommonService.convertMinsToHrsMins(item?.shift_end_time), 'hh:mm').format('LT')
    let type = item?.shift_type


    return `${start} - ${end} (${type}-Shift)`
  }



  const onAddShiftRequirement = useCallback((shiftR: any) => {
    return new Promise(async (resolve, reject) => {
      try {
        let data = await ApiService.post(ENV.API_URL + "shift/requirement", shiftR)
        resolve(data)
      } catch (error) {
        reject(error)
      }
    });
  }, []);

  const addShiftsRequirement = useCallback(async () => {
    let promArray = []
    try {
      for (let i = 0; i < shifts.length; i++) {
        promArray.push(onAddShiftRequirement(shifts[i]))
      }

      Promise.all(promArray).then(resp => {
        CommonService.showToast(resp.length + ' Shift Requirement Created' || "Success");
        setTimeout(() => history.push('/shiftrequirementMaster/list'), 200)
      }).catch(err => {
        CommonService.showToast(err?.msg || "Error", "error");
        setDoubleClick(false)
      })
    } catch (error: any) {
      CommonService.showToast(error?.msg || "Error", "error");
      setDoubleClick(false)
      return error
    }
  },
    [shifts, onAddShiftRequirement, history]
  );

  const onSubmit = () => {
    addShiftsRequirement()

  }

  const onAdd = (
    data: any,
    { setSubmitting, setErrors, resetForm }: FormikHelpers<any>
  ) => {
    if (!facilityId) {
      CommonService.showToast('Please select Facility')
      setSubmitting(false);
      return
    }

    let shift_dates = value.map((item: any) => {
      let mm = item?.month?.number
      let dd = item?.day
      let yyyy = item?.year

      let shift_date = moment(`${yyyy}-${mm}-${dd}`).format('YYYY-MM-DD')
      return shift_date
    })

    let newShift;

    //check for absence of shift timings in shift req.
    if (shiftTimings.length === 0) {
      data.start_time = "";
      data.end_time = "";
      data.shift_type = "";

      return
    }

    if (mode === 'multiple') {
      newShift = {
        temp_id: nanoid(),
        title: data.title,
        mode: data.mode,
        hcp_type: data.hcp_type,
        facility_id: facilityId,
        requirement_owner_id: currentUser._id,
        shift_dates: shift_dates,
        shift_type: data.shift_type,
        warning_type: data.warning_type,
        hcp_count: data.hcp_count,
        shift_details: data.shift_details,
        start_time: data.start_time,
        end_time: data.end_time,
        price: {
          inbound_price: "0",
          outbound_price: "0",
        }
      };

    } else if (mode === 'range') {
      newShift = {
        temp_id: nanoid(),
        title: data.title,
        mode: data.mode,
        hcp_type: data.hcp_type,
        facility_id: facilityId,
        requirement_owner_id: currentUser._id,
        start_date: shift_dates[0],
        end_date: shift_dates[1] ? shift_dates[1] : shift_dates[0],
        shift_type: data.shift_type,
        warning_type: data.warning_type,
        hcp_count: data.hcp_count,
        shift_details: data.shift_details,
        start_time: data.start_time,
        end_time: data.end_time,
        price: {
          inbound_price: "0",
          outbound_price: "0",
        }
      };
    }


    let totalShifts = [...shifts, newShift];

    setShifts(totalShifts);

    resetForm();
    setValue(null)
    handleCancelAdd()
  };

  const openAdd = useCallback(() => {
    setIsAddOpen(true)
  }, [])

  const cancelAdd = useCallback(() => {
    setIsAddOpen(false);
  }, [])

  const confirmAdd = useCallback(() => {
    history.push(`/shiftrequirementMaster/list`)

  }, [history])

  useEffect(() => {
    Communications.pageTitleSubject.next("Add Shift Requirement");
    Communications.pageBackButtonSubject.next(null);

    getFacilityData();
    getHcpTypes()
  }, [getFacilityData, getHcpTypes]);

  const showDropDownBelowField: any = {
    MenuProps: {
      anchorOrigin: {
        vertical: "bottom",
        horizontal: "left"
      },
      getContentAnchorEl: null
    }
  }

  const handleShowHideCalender = () => {
    if (value) {
      if (value instanceof Array) {
        if (value.length === 0) { return { display: 'block' } } else {
          return { display: 'none' }
        }
      }
      return {
        display: 'none'
      }
    }
  }


  if (loading || shiftLoading || hcpTypesLoading) {
    return <div className="pdd-30 screen">
      <div className="view-loading-indicator">
        <CircularProgress color="secondary" className="loader" />
      </div>
    </div>
  }


  return (
    !loading && !shiftLoading && !hcpTypesLoading && (
      <div className="add-shifts screen pdd-30">
        <DialogComponent open={isAddOpen} cancel={cancelAdd}>
          <LeavePageConfirmationComponent cancel={cancelAdd} confirm={confirmAdd} confirmationText={''} notext={"Cancel"} yestext={"Leave"} />
        </DialogComponent>
        {facilities !== null && <Autocomplete
          disableClearable
          PaperComponent={({ children }) => (
            <Paper style={{ color: "#1e1e1e" }}>{children}</Paper>
          )}
          options={facilities}
          getOptionLabel={(option: any) => option.facility_name}
          getOptionSelected={(option: any, value) => option.facility_name === value?.facility_name}
          placeholder={"Select Facility"}
          id="input_select_facility"
          onChange={($event, value) => {

            handleFacilitySelect(value)
          }
          }
          renderInput={(params) => (
            <NormalTextField
              {...params}
              id='select_region'
              variant='outlined'
              placeholder={"Select (or) Search Facility"}
            />
          )}
        />}

        <div className='shift-header-container mrg-top-10'>
          <p className='shift-header '>Shift Details</p>
        </div>


        {!isShifts ? (
          <div className="shift-add-action pdd-top-30">

            <p
              id='btn_shift_requirement_add_shift'
              onClick={() => setIsShifts(true)}
              className="add-shift-requirment-text"
            >
              + Add a Shift Requirement
            </p>
          </div>
        ) : (
          <div className="custom-card">
            <Formik
              initialValues={shiftInitialState}
              validationSchema={hcpFormValidation}
              onSubmit={onAdd}
            >
              {({ isSubmitting, isValid, resetForm, handleChange, setFieldValue, values }) => (
                <Form className={"form-holder"} id='shift-add-form'>
                  <div >
                    <div className="shift-first-row shift-row ">
                      <Field
                        id='input_shift_requirement_title'
                        variant='outlined'
                        name="title"
                        component={TextField}
                        label="Title (30 characters)"
                        fullWidth
                        inputProps={{
                          maxLength: 30,
                        }}
                      />
                    </div>

                    <div className="shift-row mrg-top-30" >
                      <Field
                        SelectProps={showDropDownBelowField}
                        id='input_shift_requirement_hcp_type'
                        variant='outlined'
                        select
                        name="hcp_type"
                        component={TextField}
                        label="HCP Type"
                        fullWidth
                      >
                        {hcpTypes &&
                          hcpTypes.map((item: any, index: any) => (
                            <MenuItem value={item.code} key={index}>
                              {item.name}
                            </MenuItem>
                          ))}
                      </Field>

                      <Field
                        SelectProps={showDropDownBelowField}
                        id='input_shift_requirement_shift_timings'
                        variant='outlined'
                        select
                        required
                        name="shift_timings"
                        component={TextField}
                        label="Shift Timings and Type"
                        fullWidth
                        onChange={(e: any) => {
                          const selectedShiftTiming = e.target.value
                          if (shiftTimings.length > 0) {
                            setFieldValue('start_time', selectedShiftTiming?.shift_start_time)
                            setFieldValue('end_time', selectedShiftTiming?.shift_end_time)
                            setFieldValue('shift_type', selectedShiftTiming?.shift_type)
                          }

                        }}
                      >
                        <MenuItem value="" >
                          Select Shift Timing
                        </MenuItem>
                        {shiftTimings.length > 0 &&
                          shiftTimings?.map((item: any, index) => {
                            let shift = formatShiftTimings(item)
                            return <MenuItem value={item} key={index}>
                              {shift}
                            </MenuItem>
                          })}
                      </Field>
                    </div>
                    <div className='shift-second-row shift-row mrg-top-30'>
                      <div className="shift-mode">
                        <Field
                          SelectProps={showDropDownBelowField}
                          id='input_shift_requirement_mode'
                          variant='outlined'
                          onChange={(e: any) => {
                            setFieldValue('mode', e.target.value)
                            setMode(e.target.value)
                          }}
                          select
                          name="mode"
                          component={TextField}
                          label="Date Mode"
                          placeholder="Select Mode"
                          fullWidth
                        >
                          {calenderMode &&
                            calenderMode.map((item: any, index) => (
                              <MenuItem value={item.value} key={index}>
                                {item.label}
                              </MenuItem>
                            ))}
                        </Field>
                      </div>
                      <div className='shift-calender'>
                        <Field
                          minDate={new Date()}
                          disabled={!mode ? true : false}
                          required
                          inputClass='custom-input'
                          className="rmdp-mobile"
                          plugins={[
                            <DatePanel eachDaysInRange />

                          ]}
                          format="YYYY/MM/DD"
                          range={mode === 'range' ? true : false} r
                          multiple={mode === 'multiple' ? true : false}
                          onChange={handleDatePicker}
                          value={value}
                          variant="inline"
                          inputVariant='outlined'
                          placeholder={mode === 'multiple' ? "Select Single (or) Multiple Dates" : mode === 'range' ? "Select Date Range" : "Please Select Date Mode"}
                          id='input_shift_requirement_shift_datepicker'
                          name="shift_dates"
                          InputLabelProps={{ shrink: true }}
                          component={DatePickers}
                        />

                        <DateRangeOutlined style={handleShowHideCalender()} className='date-icon' fontSize='large' color='action' />
                      </div>

                    </div>
                    <div className="shift-third-row shift-row mrg-top-30 ">
                      <Field
                        SelectProps={showDropDownBelowField}
                        id='input_shift_requirement_warning_zone'
                        variant='outlined'
                        select
                        name="warning_type"
                        component={TextField}
                        label="Warning Zone"
                        fullWidth
                      >
                        {warningZone &&
                          warningZone.map((item: any, index) => (
                            <MenuItem value={item.value} key={index}>
                              {item.label}
                            </MenuItem>
                          ))}
                      </Field>
                      <Field
                        id='input_shift_requirement_no_of_hcps'
                        variant='outlined'
                        name="hcp_count"
                        component={TextField}
                        label="No of HCPs"
                        fullWidth
                      />
                    </div>

                    <div className="shift-third-row mrg-top-30">
                      <Field
                        id='input_shift_requirement_shift_details'
                        label="Shift Requirement Details"
                        placeholder="Type Shift Details Here"
                        variant='outlined'
                        component={TextField}
                        type={"text"}
                        name="shift_details"
                        fullWidth
                        multiline
                        rows={2}
                      />
                    </div>
                  </div>

                  <div className="add-shift-btn-grp mrg-top-30">
                    <Button
                      id='btn_add_shift_requirement_delete'
                      color={"primary"}
                      variant={"outlined"}
                      type="reset"
                      onClick={() => {
                        resetForm();
                        setValue(null)
                        setMode('')
                        handleCancelAdd();
                      }}
                    >
                      Delete
                    </Button>
                    <Button type="submit"
                      id='btn_add_shift_requirement_save'
                      variant={"contained"}
                      className={"normal"}
                      color={"primary"}
                    >
                      Save
                    </Button>
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        )}

        {
          shifts.length > 0 &&
          shifts.map((item: ShiftItem, index: any) => (
            <ReadOnlyShifts mode={mode} facilityOffset={facilityOffset} key={index} item={item} shifts={shifts} setShifts={setShifts} />
          ))
        }

        {
          shifts.length > 0 && <div className="shift-actions mrg-top-30">
            <Button
              id='btn_add_shift_requirement_cancel_requirement'
              type="reset"
              size="large"
              variant={"outlined"}
              className={"normal"}
              color={"primary"}
              onClick={openAdd}
            >
              Cancel
            </Button>
            <Button
              id='btn_add_shift_requirement_save_requirement'
              disabled={doubleClick}
              onClick={() => {
                setDoubleClick(true)
                onSubmit()

              }}
              size="large"
              variant={"contained"}
              color={"primary"}
            >
              Save Requirement
            </Button>
          </div>
        }
        <ScrollToTop smooth color="white" />
      </div >
    )
  );
};

export default AddShiftsScreen;



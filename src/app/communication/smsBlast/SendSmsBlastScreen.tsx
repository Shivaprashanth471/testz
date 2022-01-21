import {
  Avatar,
  Box,
  Button,
  Chip,
  LinearProgress,
  Divider,
  InputAdornment, TextField as NormalTextField, Typography
} from "@material-ui/core";
import SearchIcon from '@material-ui/icons/SearchOutlined';
import { Field, Form, Formik, FormikHelpers } from "formik";
import { TextField } from "formik-material-ui";
import React, { useCallback, useEffect, useState } from "react";
import * as Yup from "yup";
import DialogComponent from "../../../components/DialogComponent";
import { ENV } from "../../../constants";
import { ApiService, CommonService, Communications } from "../../../helpers";
import GroupDetailsCardComponent from "./groupdetailsCard/GroupDetailsCardComponent";
import "./SendSmsBlastScreen.scss";

interface smsBlast {
  message: string;
  title: string;
}

const SendSmsBlastScreen = (props: any) => {
  const [groupList, setGroupList] = useState<any[]>([]);
  const [selectedGroups, setSelectedGroups] = useState<any[]>([]);
  const [showBlastHistory, setShowBlastHistory] = useState<boolean>(false);
  const [blastGroupList, setBlastGroupList] = useState<any[]>([]);
  const [selectedBlastGroups, setSelectedBlastGroups] = useState<any[]>([]);
  const [selectedBlastMessage, setSelectedBlastMessage] = useState<any>("");
  const [highlightId, setHighlightId] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(false);
  const [isBlastLoading, setisBlastLoading] = useState<boolean>(false);
  const [isMembersLoading, setIsMembersLoading] = useState<boolean>(false);
  const [isAddOpen, setIsAddOpen] = React.useState<boolean>(false);
  const [groupName, setGroupName] = React.useState<string>('')
  const [members, setMembers] = useState<any[]>([])
  const [search, setSearch] = useState<string>("")
  const [searchBlast, setSearchBlast] = useState<string>("")
  const user: any = localStorage.getItem("currentUser");
  let currentUser = JSON.parse(user);

  const getGroupMembers = useCallback((groupId) => {
    setIsMembersLoading(true);
    CommonService._api.get(ENV.API_URL + "group/" + groupId + '/member').then((resp) => {
      setMembers(resp.data);
      setIsMembersLoading(false);
    })
      .catch((err) => {
        console.log(err);
        setIsMembersLoading(false);
      });
  }, []);

  const getDetails = useCallback(() => {
    setLoading(true);
    if (search) {
      let url = `group?search=${search}`
      CommonService._api.get(ENV.API_URL + url).then((resp) => {
        setGroupList(resp?.data?.docs || []);
        setLoading(false);
      })
        .catch((err) => {
          console.log(err);
          setLoading(false);
        });
    } else {
      CommonService._api.get(ENV.API_URL + "group").then((resp) => {
        setGroupList(resp?.data?.docs || []);
        setLoading(false);
      })
        .catch((err) => {
          console.log(err);
          setLoading(false);
        });
    }
  }, [search]);

  const getBlastHistory = useCallback(() => {
    setisBlastLoading(true)
    if (searchBlast) {
      let url = `app/blast?search=${searchBlast}`
      CommonService._api.get(ENV.API_URL + url).then((resp) => {
        setBlastGroupList(resp?.data || []);
        setisBlastLoading(false);
      })
        .catch((err) => {
          console.log(err);
          setLoading(false);
        });
    } else {
      CommonService._api.get(ENV.API_URL + "app/blast").then((resp) => {
        setBlastGroupList(resp?.data || []);
        setisBlastLoading(false);
      })
        .catch((err) => {
          console.log(err);
          setLoading(false);
        });
    }
  }, [searchBlast])

  useEffect(() => {
    Communications.pageTitleSubject.next("Send SMS Blast");
    Communications.pageBackButtonSubject.next(null);
    getDetails();
  }, [getDetails]);

  useEffect(() => {
    if (props?.history?.location?.state) {
      let incomingGroup = props?.history?.location?.state
      setSelectedGroups([incomingGroup])
    }
  }, [props?.history?.location?.state])


  useEffect(() => {
    if (showBlastHistory) {
      getBlastHistory()
    }
  }, [showBlastHistory, getBlastHistory])


  const handleToggle = () => {
    setShowBlastHistory((prevState) => !prevState);
  };

  const smsValidation = Yup.object({
    message: Yup.string().min(10, 'minimum 10 characters').trim().typeError("Text and Numbers Only").required("Required"),
    title: Yup.string().min(3, 'minimum 3 characters').trim().typeError("Text and Numbers only").required("Required"),
  });

  const onAddGroup = useCallback((group: any, blastId: string) => {
    return new Promise((resolve, reject) => {
      ApiService.post(ENV.API_URL + "app/blast/" + blastId + "/group", { group_id: group._id, group_name: group.title, }).then((resp: any) => {
        if (resp) {
          resolve(null);
        } else {
          reject(resp);
        }
      })
        .catch((err) => {
          reject(err);
        });
    });
  }, []);

  const onExecuteBlast = useCallback((blastId: string) => {
    return new Promise((resolve, reject) => {
      ApiService.post(ENV.API_URL + "app/blast/" + blastId + "/execute", {}).then((resp: any) => {
        if (resp) {
          resolve(null);
        } else {
          reject(resp);
        }
      })
        .catch((err) => {
          console.log(err);
          reject(err);
        });
    });
  }, []);

  const addGroups = useCallback((blastId: string) => {
    (selectedGroups || []).forEach((value) => {
      onAddGroup(value, blastId);
    });

    onExecuteBlast(blastId)
  }, [selectedGroups, onAddGroup, onExecuteBlast]);

  const openAdd = useCallback((e, group) => {
    setGroupName(group?.group_name)
    getGroupMembers(group?.group_id)
    setIsAddOpen(true);
  }, [getGroupMembers])


  const cancelAdd = useCallback(() => {
    setIsAddOpen(false);
  }, [])


  const onAdd = (payload: any, { setSubmitting, setErrors, resetForm }: FormikHelpers<smsBlast>) => {
    if (selectedGroups && selectedGroups.length === 0) {
      CommonService.showToast('Please select atleast one group')
      resetForm()
      return
    }

    let createBlast = {
      title: payload.title,
      text_msg: payload.message,
      blast_owner_id: currentUser._id,
    };

    ApiService.post(ENV.API_URL + "app/blast", createBlast)
      .then((resp: any) => {
        if (resp) {
          const blastId = resp?.data?._id;
          addGroups(blastId);
          CommonService.showToast(resp?.msg || "Success", "success");
          resetForm()
          setSelectedGroups([])
        } else {
          setSubmitting(false);
        }
      })
      .catch((err) => {
        console.log(err)
        CommonService.handleErrors(setErrors, err?.errors);
        setSubmitting(false);
        CommonService.showToast(err.msg || "Error", "error");
      });
  };

  const handleGroupSelect = useCallback(
    (group: any) => {
      let isGroupExist = selectedGroups.some(
        (item: any) => item._id === group._id
      );
      if (!isGroupExist) {
        const newSelectedGroups = [...selectedGroups, group];
        setSelectedGroups(newSelectedGroups);
      }
    },
    [selectedGroups]
  );

  const handleBlastGroupSelect = useCallback((group: any) => {
    const { _id } = group
    CommonService._api.get(ENV.API_URL + "app/blast/" + _id + '/group').then((resp) => {
      setSelectedBlastGroups(resp.data);
    })
      .catch((err) => {
        console.log(err);
      });
  }, []);


  const handleBlastMessageSelect = (item: any) => {
    setSelectedBlastMessage(item?.text_msg)
    setHighlightId(item?._id)
  }

  const handleDelete = useCallback((chipToDelete: any) => {
    let filteredGroups = selectedGroups.filter(
      (chip: any) => chip._id !== chipToDelete._id
    );
    setSelectedGroups(filteredGroups);
  },
    [selectedGroups]
  );

  const handleSearch = (e: any) => {
    setSearch(e.target.value)
  };

  const handleSearchBlast = (e: any) => {
    setSearchBlast(e.target.value)
  };

  const StyledLoader = () => {
    return <div >
      <LinearProgress color="primary" />
    </div>
  }

  return (<div className="send-sms-blast screen ">
    <div className="d-flex">
      <div className="sms-blast-header">
        <h3>{!showBlastHistory ? "Send SMS Blast" : "Blast History"}</h3>
      </div>
      <div className="send-sms-toggle-btn">
        <Button color='primary' size='large' onClick={handleToggle} variant='contained'>
          {!showBlastHistory ? "Blast History" : "Send SMS Blast"}
        </Button>
      </div>
    </div>
    <div className="sms-blast-container">
      <div className="sms-blast-left">
        <div className="pdd-right-20">
          <NormalTextField
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <SearchIcon
                    fontSize='small'
                    id="icon_search_sms_blast"
                    style={{ cursor: "pointer" }}
                  />
                </InputAdornment>
              ),
            }}
            size='small'
            variant='outlined'
            type="search"
            onChange={(e: any) => {
              !showBlastHistory ? handleSearch(e) : handleSearchBlast(e)
            }}
            value={!showBlastHistory ? search : searchBlast}
            fullWidth
          />
        </div>
        <div className="sms-blast-scroll pdd-right-10">
          {
            loading ? <StyledLoader /> : !showBlastHistory ? (
              <div>
                {groupList?.map((item: any) => {
                  return (
                    <GroupDetailsCardComponent
                      showBlastHistory={showBlastHistory}
                      key={item._id}
                      onClick={() => handleGroupSelect(item)}
                      data={item}
                    />
                  );
                })}
              </div>
            ) : (
              <div >
                {
                  isBlastLoading ? <StyledLoader /> : blastGroupList.length > 0 && blastGroupList?.map((item: any) => {
                    return (
                      <GroupDetailsCardComponent
                        highlightId={highlightId}
                        showBlastHistory={showBlastHistory}
                        onClick={() => { handleBlastGroupSelect(item); handleBlastMessageSelect(item) }}
                        key={item?._id}
                        data={item}
                      />
                    );
                  })
                }
              </div>
            )}
        </div>
      </div>
      <div className="sms-blast-right">
        {!showBlastHistory ? (
          <SMSBlastMessages
            selectedGroups={selectedGroups}
            handleDelete={handleDelete}
            smsValidation={smsValidation}
            onAdd={onAdd}
          />
        ) : (
          <BlastHistoryMessages
            openAdd={openAdd}
            selectedBlastGroups={selectedBlastGroups}
            selectedBlastMessage={selectedBlastMessage}
          />
        )}
      </div>
    </div>
    <GroupMembersDialog
      groupName={groupName}
      isAddOpen={isAddOpen}
      cancelAdd={cancelAdd}
      isMembersLoading={isMembersLoading}
      members={members} />
  </div >
  )
};

export default SendSmsBlastScreen;

const BlastHistoryMessages = (props: any) => {
  return (
    <>
      <h3>Groups</h3>
      <div className="blast-history-messages">
        <div className="selected-groups">
          {
            props?.selectedBlastGroups && props?.selectedBlastGroups.length > 0 ?
              props?.selectedBlastGroups.map((data: any) => <Chip style={{ background: '#E3FFF4' }} onClick={(e: any) => props.openAdd(e, data)} key={data?._id} label={data.group_name} />)
              : <p> No Available Groups</p>
          }
        </div>
        <div className="msg-container">
          <div >
            {
              props?.selectedBlastMessage &&
              <p className='message'>{props?.selectedBlastMessage}</p>}
          </div>
        </div>
      </div>

    </>
  );
};

const SMSBlastMessages = (props: any) => {
  return (
    <>
      <div className="sms-blast-recipients">
        <h3>To</h3>

        <div className="selected-recipients">
          {props.selectedGroups.length > 0 ? (
            props.selectedGroups.map((data: any) => {
              return (
                <Chip
                  style={{ background: '#E3FFF4' }}
                  key={data?._id}
                  label={data.title}
                  onDelete={() => props.handleDelete(data)}
                />
              );
            })
          ) : (
            <p>No Recipients Added</p>
          )}
        </div>
      </div>
      <div className="sms-blast-message pdd-right-20">
        <Formik
          initialValues={{
            message: "",
            title: "",
          }}
          validateOnChange={true}
          validationSchema={props.smsValidation}
          onSubmit={props.onAdd}
        >
          {({ isSubmitting, isValid }) => (
            <Form className="form-holder">
              <Field
                component={TextField}
                fullWidth
                name="title"
                variant="outlined"
                placeholder="Type a Title*"
                autoComplete="off"
              />
              <Field
                autoComplete="off"
                className="mrg-top-20"
                component={TextField}
                fullWidth
                multiline
                name="message"
                rows={6}
                variant="outlined"
                placeholder="Type in your message*"
              />
              <div className="sms-blast-btn mrg-top-20  ">
                <Button
                  disabled={isSubmitting || !isValid}
                  color={"primary"}
                  variant={"contained"}
                  id="sms_blast_button"
                  className={isSubmitting?"has-loading-spinner":""}
                  type="submit"
                  size={"large"}
                >
                 {isSubmitting ? "Sending Blast" :"Send Blast"}
                </Button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </>
  );
};


const GroupMembersDialog = (props: any) => {
  return <DialogComponent class={'dialog-side-wrapper'} open={props?.isAddOpen} cancel={props?.cancelAdd}>
    <div className='mrg-top-30 pdd-30'>
      <div className="d-flex" style={{ justifyContent: 'space-between', alignItems: 'center' }}>
        <Box display='flex' flexDirection='column' justifyContent='center'>
          <Typography variant='h4' color='textPrimary'>{props?.groupName}</Typography>
          <Typography color='primary'>Group Members</Typography>
        </Box>
        <Avatar style={{ height: '60px', width: '60px' }}>
          {props?.groupName.toUpperCase().charAt('0')}
        </Avatar>
      </div>
      {!props?.isMembersLoading && props?.members.length > 0 && props?.members.map((item: any) => <>
        <div className="d-flex mrg-top-20" style={{ justifyContent: 'space-between', alignItems: 'center' }}>
          <Box display='flex' alignItems='center' justifyContent='space-between' gridGap={10}>
            <Avatar sizes='small'>
              {
                item?.hcp_name.toUpperCase().charAt('0')
              }
            </Avatar>
            <span>{item?.hcp_name}</span>
          </Box>
          <span>{item?.hcp_type}</span>
        </div>
        <Divider className='mrg-top-5' style={{ color: 'lightgray' }} />
      </>)
      }
    </div>
  </DialogComponent>
}
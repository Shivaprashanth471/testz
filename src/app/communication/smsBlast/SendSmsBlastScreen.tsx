import { Button, InputAdornment, TextField as NormalTextField, Tooltip } from "@material-ui/core";
import SearchIcon from "@material-ui/icons/SearchOutlined";
import { FormikHelpers } from "formik";
import React, { useCallback, useEffect, useState } from "react";
import * as Yup from "yup";
import LoaderComponent from "../../../components/LoaderComponent";
import NoDataCardComponent from "../../../components/NoDataCardComponent";
import { ENV } from "../../../constants";
import { ApiService, CommonService, Communications } from "../../../helpers";
import BlastHistoryComponent from "./BlastHistoryComponent";
import GroupDetailsCardComponent from "./groupdetailsCard/GroupDetailsCardComponent";
import GroupMembersDialogComponent from "./GroupMembersDialogComponent";
import "./SendSmsBlastScreen.scss";
import SMSBlastComponent from "./SMSBlastComponent";

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
  const [highlightId, setHighlightId] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [isBlastLoading, setisBlastLoading] = useState<boolean>(false);
  const [isSelectedBlastGroupsLoading, setIsSelectedBlastGroupsLoading] = useState<boolean>(false);
  const [isMembersLoading, setIsMembersLoading] = useState<boolean>(false);
  const [isAddOpen, setIsAddOpen] = React.useState<boolean>(false);
  const [groupName, setGroupName] = React.useState<string>("");
  const [members, setMembers] = useState<any[]>([]);
  const [search, setSearch] = useState<string>("");
  const [searchBlast, setSearchBlast] = useState<string>("");
  const user: any = localStorage.getItem("currentUser");
  let currentUser = JSON.parse(user);

  const getGroupMembers = useCallback((groupId) => {
    setIsMembersLoading(true);
    CommonService._api
      .get(ENV.API_URL + "group/" + groupId + "/member")
      .then((resp) => {
        setMembers(resp.data || []);
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
      let url = `group?search=${search}`;
      CommonService._api
        .get(ENV.API_URL + url)
        .then((resp) => {
          setGroupList(resp?.data?.docs || []);
          setLoading(false);
        })
        .catch((err) => {
          console.log(err);
          setLoading(false);
        });
    } else {
      CommonService._api
        .get(ENV.API_URL + "group")
        .then((resp) => {
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
    setisBlastLoading(true);
    if (searchBlast) {
      let url = `app/blast?search=${searchBlast}`;
      CommonService._api
        .get(ENV.API_URL + url)
        .then((resp) => {
          setBlastGroupList(resp?.data || []);
          setisBlastLoading(false);
        })
        .catch((err) => {
          console.log(err);
          setLoading(false);
        });
    } else {
      CommonService._api
        .get(ENV.API_URL + "app/blast")
        .then((resp) => {
          setBlastGroupList(resp?.data || []);
          setisBlastLoading(false);
        })
        .catch((err) => {
          console.log(err);
          setLoading(false);
        });
    }
  }, [searchBlast]);

  useEffect(() => {
    Communications.pageTitleSubject.next("Send SMS Blast");
    Communications.pageBackButtonSubject.next(null);
    getDetails();
  }, [getDetails]);

  useEffect(() => {
    if (props?.history?.location?.state) {
      let incomingGroup = props?.history?.location?.state;
      setSelectedGroups([incomingGroup]);
    }
  }, [props?.history?.location?.state]);

  useEffect(() => {
    if (showBlastHistory) {
      getBlastHistory();
    }
  }, [showBlastHistory, getBlastHistory]);

  const handleToggle = () => {
    setShowBlastHistory((prevState) => !prevState);
  };

  const smsValidation = Yup.object({
    message: Yup.string().min(10, "minimum 10 characters").trim().typeError("Text and Numbers Only").required("Required"),
    title: Yup.string().min(3, "minimum 3 characters").trim().typeError("Text and Numbers only").required("Required"),
  });

  const onAddGroup = useCallback((group: any, blastId: string) => {
    return new Promise((resolve, reject) => {
      ApiService.post(ENV.API_URL + "app/blast/" + blastId + "/group", { group_id: group._id, group_name: group.title })
        .then((resp: any) => {
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
      ApiService.post(ENV.API_URL + "app/blast/" + blastId + "/execute", {})
        .then((resp: any) => {
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

  const addGroups = useCallback(
    (blastId: string) => {
      (selectedGroups || []).forEach((value) => {
        onAddGroup(value, blastId);
      });

      onExecuteBlast(blastId);
    },
    [selectedGroups, onAddGroup, onExecuteBlast]
  );

  const openAdd = useCallback(
    (e, group) => {
      setGroupName(group?.group_name);
      getGroupMembers(group?.group_id);
      setIsAddOpen(true);
    },
    [getGroupMembers]
  );

  const cancelAdd = useCallback(() => {
    setIsAddOpen(false);
  }, []);

  const onAdd = (payload: any, { setSubmitting, setErrors, resetForm }: FormikHelpers<smsBlast>) => {
    if (selectedGroups && selectedGroups.length === 0) {
      CommonService.showToast("Please select atleast one group");
      resetForm();
      return;
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
          resetForm();
          setSelectedGroups([]);
        } else {
          setSubmitting(false);
        }
      })
      .catch((err) => {
        console.log(err);
        CommonService.handleErrors(setErrors, err?.errors);
        setSubmitting(false);
        CommonService.showToast(err.msg || "Error", "error");
      });
  };

  const handleGroupSelect = useCallback(
    (group: any) => {
      let isGroupExist = selectedGroups.some((item: any) => item._id === group._id);
      if (!isGroupExist) {
        const newSelectedGroups = [...selectedGroups, group];
        setSelectedGroups(newSelectedGroups);
      }
    },
    [selectedGroups]
  );

  const handleBlastGroupSelect = useCallback((group: any) => {
    const { _id } = group;
    setIsSelectedBlastGroupsLoading(true);
    CommonService._api
      .get(ENV.API_URL + "app/blast/" + _id + "/group")
      .then((resp) => {
        setSelectedBlastGroups(resp.data);
        setIsSelectedBlastGroupsLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setIsSelectedBlastGroupsLoading(false);
      });
  }, []);

  const handleBlastMessageSelect = (item: any) => {
    setSelectedBlastMessage(item?.text_msg);
    setHighlightId(item?._id);
  };

  const handleDelete = useCallback(
    (chipToDelete: any) => {
      let filteredGroups = selectedGroups.filter((chip: any) => chip._id !== chipToDelete._id);
      setSelectedGroups(filteredGroups);
    },
    [selectedGroups]
  );

  const handleSearch = (e: any) => {
    setSearch(e.target.value);
  };

  const handleSearchBlast = (e: any) => {
    setSearchBlast(e.target.value);
  };

  const StyledLoader = () => {
    return (
      <div>
        <LoaderComponent position="block" />
      </div>
    );
  };

  return (
    <div className="send-sms-blast screen ">
      <div className="d-flex">
        <div className="sms-blast-header">
          <h3>{!showBlastHistory ? "Send SMS Blast" : "Blast History"}</h3>
        </div>
        <div className="send-sms-toggle-btn">
          <Tooltip title={!showBlastHistory ? "Show Blast History" : "Send SMS Blast"}>
            <Button color="primary" size="large" onClick={handleToggle} variant="contained">
              {!showBlastHistory ? "Blast History" : "Send SMS Blast"}
            </Button>
          </Tooltip>
        </div>
      </div>
      <div className="sms-blast-container">
        <div className="sms-blast-left">
          <div className="pdd-right-20">
            <NormalTextField
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <SearchIcon fontSize="small" id="icon_search_sms_blast" style={{ cursor: "pointer" }} />
                  </InputAdornment>
                ),
              }}
              size="small"
              variant="outlined"
              type="search"
              onChange={(e: any) => {
                !showBlastHistory ? handleSearch(e) : handleSearchBlast(e);
              }}
              value={!showBlastHistory ? search : searchBlast}
              fullWidth
            />
          </div>
          <div className="sms-blast-scroll pdd-right-10">
            {loading ? (
              <StyledLoader />
            ) : !showBlastHistory ? (
              <div>
                {groupList?.length > 0 ? (
                  groupList?.map((item: any) => {
                    return <GroupDetailsCardComponent showBlastHistory={showBlastHistory} key={item._id} onClick={() => handleGroupSelect(item)} data={item} />;
                  })
                ) : (
                  <NoDataCardComponent width={300} height={300} isNotTable={true} />
                )}
              </div>
            ) : (
              <div>
                {isBlastLoading ? (
                  <StyledLoader />
                ) : blastGroupList.length > 0 ? (
                  blastGroupList?.map((item: any) => {
                    return (
                      <GroupDetailsCardComponent
                        highlightId={highlightId}
                        showBlastHistory={showBlastHistory}
                        onClick={() => {
                          handleBlastGroupSelect(item);
                          handleBlastMessageSelect(item);
                        }}
                        key={item?._id}
                        data={item}
                      />
                    );
                  })
                ) : (
                  <NoDataCardComponent width={300} height={300} isNotTable={true} />
                )}
              </div>
            )}
          </div>
        </div>
        <div className="sms-blast-right">
          {!showBlastHistory ? (
            <SMSBlastComponent selectedGroups={selectedGroups} handleDelete={handleDelete} smsValidation={smsValidation} onAdd={onAdd} />
          ) : (
            <BlastHistoryComponent isSelectedBlastGroupsLoading={isSelectedBlastGroupsLoading} openAdd={openAdd} selectedBlastGroups={selectedBlastGroups} selectedBlastMessage={selectedBlastMessage} />
          )}
        </div>
      </div>
      <GroupMembersDialogComponent groupName={groupName} isAddOpen={isAddOpen} cancelAdd={cancelAdd} isMembersLoading={isMembersLoading} members={members} />
    </div>
  );
};

export default SendSmsBlastScreen;







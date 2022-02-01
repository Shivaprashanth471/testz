import { Chip } from "@material-ui/core";
import React from "react";
import LoaderComponent from "../../../components/LoaderComponent";
import "./SendSmsBlastScreen.scss";


const BlastHistoryComponent = (props: any) => {
    return (
      <>
        <h3>Groups</h3>
        <div className="blast-history-messages">
        {props?.isSelectedBlastGroupsLoading && <LoaderComponent position="block" />}
          <div className="selected-groups">
            {!props?.isSelectedBlastGroupsLoading && props?.selectedBlastGroups && props?.selectedBlastGroups.length > 0
              ? props?.selectedBlastGroups.map((data: any) => <Chip style={{ background: "#E3FFF4" }} onClick={(e: any) => props.openAdd(e, data)} key={data?._id} label={data.group_name} />)
              : !props?.isSelectedBlastGroupsLoading && <p>No Available Groups</p>}
          </div>
          <div className="msg-container">
            <div>{props?.selectedBlastMessage && <p className="message">{props?.selectedBlastMessage}</p>}</div>
          </div>
        </div>
      </>
    );
  };

  export default BlastHistoryComponent
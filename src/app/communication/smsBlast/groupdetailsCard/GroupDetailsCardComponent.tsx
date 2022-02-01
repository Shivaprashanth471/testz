import React, { PropsWithChildren } from "react";
import "./GroupDetailsCardComponent.scss";
import { Avatar } from "@material-ui/core";
import moment from "moment";

export interface GroupDetailsCardComponentProps {
  onClick: () => void;
  data: any;
  showBlastHistory: any;
  highlightId?: any;
}

const GroupDetailsCardComponent = (props: PropsWithChildren<GroupDetailsCardComponentProps>) => {
  let invisible = true;

  if (props?.showBlastHistory) {
    if (props?.highlightId === props?.data?._id) {
      invisible = false;
    }
  }

  return (
    <div className={invisible ? "group-details-card" : "group-details-card active-group"} onClick={props?.onClick}>
      <div className="message-details">
        <div className={"group-details"}>
          <div className="avatar">
            <Avatar alt="user photo" style={{ height: "30px", width: "30px" }} src={"https://images.unsplash.com/photo-1510832198440-a52376950479?ixid=MnwxMjA3fDB8MHxzZWFyY2h8NHx8Z2lybHxlbnwwfHwwfHw%3D&ixlib=rb-1.2.1&w=1000&q=80"} />
          </div>
          <div className="mrg-left-20">
            <p className="group-name">{props?.data?.title?.length > 20 ? props?.data?.title?.slice(0, 20) + "..." : props?.data?.title}</p>
            <span className="group-msg-status">Message Sent</span>
          </div>
        </div>
        <div className="time-stamp">
          <p>{props?.showBlastHistory ? moment(props?.data?.updated_at).format("lll") : moment(props?.data?.created_at).format("lll")}</p>
        </div>
      </div>
    </div>
  );
};

export default GroupDetailsCardComponent;

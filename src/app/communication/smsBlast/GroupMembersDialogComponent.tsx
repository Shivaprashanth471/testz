import { Avatar, Typography, Box, Divider } from "@material-ui/core";
import React from "react";
import DialogComponent from "../../../components/DialogComponent";
import LoaderComponent from "../../../components/LoaderComponent";
import NoDataCardComponent from "../../../components/NoDataCardComponent";
import "./SendSmsBlastScreen.scss";

const GroupMembersDialogComponent = (props: any) => {
  return (
    <DialogComponent class={"dialog-side-wrapper"} open={props?.isAddOpen} cancel={props?.cancelAdd}>
      <div className="mrg-top-30 pdd-30">
        <div className="d-flex" style={{ justifyContent: "space-between", alignItems: "center" }}>
          <Box display="flex" flexDirection="column" justifyContent="center">
            <Typography variant="h4" color="textPrimary">
              {props?.groupName}
            </Typography>
            <Typography color="primary">Group Members</Typography>
          </Box>
          <Avatar style={{ height: "60px", width: "60px" }}>{props?.groupName.toUpperCase().charAt("0")}</Avatar>
        </div>

        {props?.isMembersLoading && (
          <div className="mrg-top-10">
            <LoaderComponent position="block" />
          </div>
        )}

        {props.members && props.members.length > 0
          ? props?.members.map((item: any) => (
              <>
                <div className="d-flex mrg-top-20" style={{ justifyContent: "space-between", alignItems: "center" }}>
                  <Box display="flex" alignItems="center" justifyContent="space-between" gridGap={10}>
                    <Avatar sizes="small">{item?.hcp_name.toUpperCase().charAt("0")}</Avatar>
                    <span>{item?.hcp_name}</span>
                  </Box>
                  <span>{item?.hcp_type}</span>
                </div>
                <Divider className="mrg-top-5" style={{ color: "lightgray" }} />
              </>
            ))
          : !props.isMembersLoading && <NoDataCardComponent height={300} width={300} isNotTable={true} />}
      </div>
    </DialogComponent>
  );
};

export default GroupMembersDialogComponent;

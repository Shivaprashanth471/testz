import React, { PropsWithChildren, useCallback, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { TsDataListOptions, TsDataListState, TsDataListWrapperClass } from "../../../../../classes/ts-data-list-wrapper.class";
import { ENV } from "../../../../../constants";
import { ApiService } from "../../../../../helpers";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import Paper from "@material-ui/core/Paper";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import { LinearProgress } from "@material-ui/core";
import "./UnApprovedHcpApplicationComponent.scss";
import moment from "moment";
import NoDataCardComponent from "../../../../../components/NoDataCardComponent";

export interface UnApprovedHcpApplicationComponentProps {
  isAddOpen: Boolean;
}

const UnApprovedHcpApplicationComponent = (props: PropsWithChildren<UnApprovedHcpApplicationComponentProps>) => {
  const isAddOpen = props?.isAddOpen;
  const param = useParams<any>();
  const { id } = param;
  const [list, setList] = useState<TsDataListState | null>(null);

  const init = useCallback(() => {
    const options = new TsDataListOptions(
      {
        webMatColumns: ["HCP Name", "Applied On", "HCP Rate", "Rejected By", "Reason", "Action"],
        mobileMatColumns: ["HCP Name", "Applied On", "HCP Rate", "Rejected By", "Reason", "Action"],
      },
      ENV.API_URL + "shift/requirement/" + id + "/application?status=rejected",
      setList,
      ApiService,
      "get"
    );
    let tableWrapperObj = new TsDataListWrapperClass(options);
    setList({ table: tableWrapperObj });
  }, [id]);

  useEffect(() => {
    init();
  }, [init, isAddOpen]);

  return (
    <div className="unapproved-hcps-list">
      {list && list.table?._isDataLoading && (
        <div className="table-loading-indicator">
          <LinearProgress />
        </div>
      )}
      {list && list.table && (
        <>
          <TableContainer component={Paper} className={"table-responsive"}>
            <Table stickyHeader aria-label="sticky table" style={{ tableLayout: "fixed" }}>
              <TableHead>
                <TableRow>
                  {list?.table.matColumns.map((column: any, columnIndex: any) => (
                    <TableCell className={column === "Action" ? "text-right" : ""} key={"header-col-" + columnIndex}>
                      {column}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {list.table.canShowNoData() && <NoDataCardComponent tableCellCount={list.table.matColumns.length} />}
                {list?.table.data.map((row: any, rowIndex: any) => {
                  return (
                    <TableRow hover role="checkbox" tabIndex={-1} key={"row-"}>
                      <TableCell>
                        {row["hcp_data"]?.first_name}&nbsp;{row["hcp_data"]?.last_name}
                      </TableCell>
                      <TableCell>{moment(row["created_at"]).format("MM-DD-YYYY")}</TableCell>
                      <TableCell>{row["hcp_data"]?.rate}</TableCell>
                      <TableCell>
                        {row["rejected_by"]?.first_name} &nbsp;{row["rejected_by"]?.last_name}
                      </TableCell>
                      <TableCell>{row["rejected_reason"]}</TableCell>
                      <TableCell className="text-right">
                        <Link to={{ pathname: "/hcp/user/view/" + row["hcp_user_id"], state: { prevPath: "/shiftsRequirements/view/" + id } }} className="info-link" id={"link_hospital_details" + rowIndex}>
                          {"View Details"}
                        </Link>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </>
      )}
    </div>
  );
};

export default UnApprovedHcpApplicationComponent;

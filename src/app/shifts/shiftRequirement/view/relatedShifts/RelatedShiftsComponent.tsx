import { LinearProgress } from "@material-ui/core";
import Paper from "@material-ui/core/Paper";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import moment from "moment";
import React, { PropsWithChildren, useCallback, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { TsDataListOptions, TsDataListState, TsDataListWrapperClass } from "../../../../../classes/ts-data-list-wrapper.class";
import NoDataCardComponent from "../../../../../components/NoDataCardComponent";
import { ENV } from "../../../../../constants";
import { ApiService } from "../../../../../helpers";
import "./RelatedShiftsComponent.scss";

export interface RelatedShiftsComponentProps {
  isAddOpen: boolean;
}

const RelatedShiftsComponent = (props: PropsWithChildren<RelatedShiftsComponentProps>) => {
  const isAddOpen = props?.isAddOpen;
  const param = useParams<any>();
  const { id } = param;
  const [list, setList] = useState<TsDataListState | null>(null);

  const init = useCallback(() => {
    const options = new TsDataListOptions(
      {
        webMatColumns: ["HCP Name", "Applied On", "HCP Rate", "HCP Type", "Approved By", "Action"],
        mobileMatColumns: ["HCP Name", "Applied On", "HCP Rate", "HCP Type", "Approved By", "Action"],
      },
      ENV.API_URL + "shift/requirement/" + id + "/shift",
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
    <div className="related-shifts-list">
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
                        {row["hcp_user"]?.first_name}&nbsp;{row["hcp_user"]?.last_name}
                      </TableCell>
                      <TableCell>{moment(row["created_on"]).format("MM-DD-YYYY")}</TableCell>
                      <TableCell>{row["hcp_user"]?.rate}</TableCell>
                      <TableCell>{row["hcp_user"]?.hcp_type}</TableCell>
                      <TableCell>
                        {row["approved_by"]?.first_name} &nbsp;{row["approved_by"]?.last_name}
                      </TableCell>

                      <TableCell className="text-right">
                        <Link to={"/hcp/user/view/" + row["hcp_user_id"]} className="info-link" id={"link_hospital_details" + rowIndex}>
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

export default RelatedShiftsComponent;

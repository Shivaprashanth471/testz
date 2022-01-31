import React, { useCallback, useEffect, useState } from "react";
import { TextField, IconButton, Tooltip } from "@material-ui/core";
import Paper from "@material-ui/core/Paper";
import { withStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TablePagination from "@material-ui/core/TablePagination";
import TableRow from "@material-ui/core/TableRow";
import { SearchRounded } from "@material-ui/icons";
import ClearIcon from "@material-ui/icons/Clear";
import CancelIcon from "@material-ui/icons/Cancel";
import CheckIcon from "@material-ui/icons/Check";
import moment from "moment";
import { TsDataListOptions, TsDataListState, TsDataListWrapperClass } from "../../../../classes/ts-data-list-wrapper.class";
import NoDataCardComponent from "../../../../components/NoDataCardComponent";
import { ENV } from "../../../../constants";
import { ApiService, CommonService, Communications } from "../../../../helpers";
import DialogComponent from "../../../../components/DialogComponent";
import RejectHcpApplicationComponent from "../rejectHcp/RejectHcpApplicationComponent";
import CreateShiftScreen from "../createShift/CreateShiftScreen";
import "./PendingShiftsListScreen.scss";
import PendingSihftsViewComponent from "../view/PendingShiftsViewComponent";
import LoaderComponent from "../../../../components/LoaderComponent";
import { useLocalStorage } from "../../../../components/useLocalStorage";

const CssTextField = withStyles({
  root: {
    "& .MuiOutlinedInput-root": {
      "&:hover fieldset": {
        borderColor: "#10c4d3",
      },
    },
  },
})(TextField);

const PendingShiftsListScreen = () => {
  const [list, setList] = useState<TsDataListState | null>(null);
  const [isApproveOpen, setIsApproveOpen] = useState<boolean>(false);
  const [isRejectOpen, setIsRejectOpen] = useState<boolean>(false);
  const [hcpId, setHcpId] = useState<string>("");
  const [applicationId, setApplicationId] = useState<string>("");
  const [requirementId, setRequirementId] = useState<string>("");
  const [isViewOpen, setIsViewOpen] = useState<boolean>(false);

  const [pageSizeIndex, setPageSizeIndex] = useLocalStorage<any>("shiftPendingPageSizeIndex", 10);

  const init = useCallback(() => {
    let today = moment(new Date()).format("YYYY-MM-DD");
    let url = "shift/application?status=pending&new_shifts=" + today;

    const options = new TsDataListOptions(
      {
        // @ts-ignore
        pagination: {
          ...list?.table?.pagination,
          pageSize: pageSizeIndex,
        },
        webMatColumns: ["Applied On", "HCP Name", "Facility Name", "Shift Date", "Type of hcp", "Time Type", "Status", "Actions"],
        mobileMatColumns: ["Applied On", "HCP Name", "Facility Name", "Shift Date", "Type of hcp", "Time Type", "Status", "Actions"],
      },
      ENV.API_URL + url,
      setList,
      ApiService,
      "get"
    );

    let tableWrapperObj = new TsDataListWrapperClass(options);
    setList({ table: tableWrapperObj });
    // eslint-disable-next-line
  }, []);

  const openView = useCallback((id: any, hcp_user_id: any) => {
    setIsViewOpen(true);
    setRequirementId(id);
    setHcpId(hcp_user_id);
  }, []);

  const cancelView = useCallback(() => {
    setIsViewOpen(false);
  }, []);

  const confirmView = useCallback(() => {
    setIsViewOpen(false);
    init();
  }, [init]);

  const cancelApprove = useCallback(() => {
    setIsApproveOpen(false);
  }, []);

  const confirmApprove = useCallback(() => {
    setIsApproveOpen(false);
    init();
  }, [init]);

  const openApprove = useCallback((hcpId: string, applicationId: string, requirementId: string) => {
    setHcpId(hcpId);
    setApplicationId(applicationId);
    setIsApproveOpen(true);
    setRequirementId(requirementId);
  }, []);

  const openRejectApplication = useCallback((requirementId: any, applicationId: any) => {
    setApplicationId(applicationId);
    setRequirementId(requirementId);
    setIsRejectOpen(true);
  }, []);

  const cancelRejectApplication = useCallback(() => {
    setIsRejectOpen(false);
  }, []);

  const confirmRejectApplication = useCallback(() => {
    setIsRejectOpen(false);
    init();
  }, [init]);

  useEffect(() => {
    init();
    Communications.pageTitleSubject.next("Pending Shifts");
    Communications.pageBackButtonSubject.next(null);
  }, [init]);

  return (
    <div className="pending-hcps-list screen crud-layout pdd-30">
      <DialogComponent open={isRejectOpen} cancel={cancelRejectApplication}>
        <RejectHcpApplicationComponent cancel={cancelRejectApplication} confirm={confirmRejectApplication} requirementId={requirementId} applicationId={applicationId} />
      </DialogComponent>
      <DialogComponent open={isApproveOpen} cancel={cancelApprove}>
        <CreateShiftScreen hcpId={hcpId} cancel={cancelApprove} requirementId={requirementId} applicationId={applicationId} confirm={confirmApprove} />
      </DialogComponent>
      <DialogComponent open={isViewOpen} cancel={cancelView} maxWidth="md">
        <PendingSihftsViewComponent cancel={cancelView} requirementId={requirementId} confirm={confirmView} hcpId={hcpId} />
      </DialogComponent>
      {list && list.table?._isDataLoading && (
        <div className="table-loading-indicator">
          <LoaderComponent />
        </div>
      )}
      <div className="custom-border pdd-10 pdd-top-0 pdd-bottom-20 mrg-top-0">
        <div className="header">
          <div className="mrg-left-5 filter">
            <div>
              <div className="d-flex">
                <div className="d-flex position-relative">
                  {!list?.table.filter.search ? (
                    <div className={"search_icon"}>
                      <SearchRounded />
                    </div>
                  ) : (
                    <div className={"search_icon"}>
                      <ClearIcon
                        onClick={(event) => {
                          if (list && list.table) {
                            list.table.filter.search = "";
                            list.table.reload();
                            // list?.table.pageEvent(0)
                          }
                        }}
                        id="clear_shift_search"
                      />
                    </div>
                  )}
                  <div>
                    <CssTextField
                      defaultValue={""}
                      className="search-cursor searchField"
                      id="input_search_shift"
                      onChange={(event) => {
                        if (list && list.table) {
                          list.table.filter.search = event.target.value;
                          list.table.reload();
                          // list?.table.pageEvent(0)
                        }
                      }}
                      value={list?.table.filter.search}
                      variant={"outlined"}
                      size={"small"}
                      type={"text"}
                      placeholder={"Search Shift"}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {list && list.table && (
          <>
            <TableContainer component={Paper} className={"table-responsive"}>
              <Table stickyHeader aria-label="sticky table">
                <TableHead>
                  <TableRow>
                    {list?.table.matColumns.map((column: any, columnIndex: any) => (
                      <TableCell key={"header-col-" + columnIndex}>{column}</TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {!list.table._isDataLoading && list.table?.data.length === 0 && <NoDataCardComponent tableCellCount={list.table.matColumns.length} />}
                  {list?.table.data.map((row: any, rowIndex: any) => {
                    const shift_date = CommonService.getUtcDate(row["shift_date"]);

                    return (
                      <TableRow hover role="checkbox" tabIndex={-1} key={"row-" + rowIndex}>
                        <TableCell>{moment(row["created_at"]).format("MM-DD-YYYY")}</TableCell>
                        <TableCell>
                          {row["hcp_data"]?.first_name}&nbsp;{row["hcp_data"]?.last_name}
                        </TableCell>
                        <TableCell>{row["facility_name"]}</TableCell>
                        <TableCell>{shift_date}</TableCell>
                        <TableCell>{row["hcp_data"]?.hcp_type}</TableCell>
                        <TableCell>{row["shift_type"]}</TableCell>
                        <TableCell className={`captalize ${row["status"]}`}>{row["status"]}</TableCell>
                        <TableCell className="action-wrapper">
                          <div className="d-flex actions">
                            <IconButton onClick={() => openApprove(row["hcp_user_id"], row["_id"], row["requirement_id"])} disabled={row["status"] !== "pending"}>
                              <Tooltip title={`Approve ${row["hcp_data"]?.first_name} ${row["hcp_data"]?.last_name} Shift Requirement Application`}>
                                <CheckIcon className={row["status"] === "pending" ? "add-icon" : ""} />
                              </Tooltip>
                            </IconButton>
                            <IconButton onClick={() => openRejectApplication(row["requirement_id"], row["_id"])} disabled={row["status"] !== "pending"}>
                              <Tooltip title={`Reject ${row["hcp_data"]?.first_name} ${row["hcp_data"]?.last_name} Shift Requirement Application`}>
                                <CancelIcon className={row["status"] === "pending" ? "delete-icon" : ""} />
                              </Tooltip>
                            </IconButton>
                            <Tooltip title={`${row["hcp_data"]?.first_name} ${row["hcp_data"]?.last_name} shift Requirement view details`}>
                              <p onClick={() => openView(row["requirement_id"], row["hcp_user_id"])} className="view-details-link">
                                view details
                              </p>
                            </Tooltip>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
              <TablePagination
                rowsPerPageOptions={list.table.pagination.pageSizeOptions}
                component="div"
                count={list?.table.pagination.totalItems}
                rowsPerPage={list?.table.pagination.pageSize}
                page={list?.table.pagination.pageIndex}
                onPageChange={(event, page) => list.table.pageEvent(page)}
                onRowsPerPageChange={(event) => {
                  setPageSizeIndex(event.target.value);
                  list.table?.pageEvent(0, +event.target.value);
                }}
              />
            </TableContainer>
          </>
        )}
      </div>
    </div>
  );
};

export default PendingShiftsListScreen;

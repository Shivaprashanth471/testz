import React, { useEffect } from "react";
import {BrowserRouter,Redirect,Route,Switch,useHistory} from "react-router-dom";
import NotFoundComponent from "../components/NotFoundComponent";
import AppLayout from "../app/layout/app-layout";
import AuthLayout from "../app/layout/auth-layout";
import { useDispatch, useSelector } from "react-redux";
import { StateParams } from "../store/reducers";
import CommonService from "../helpers/common-service";
import { Communications } from "../helpers";
import { logoutUser } from "../store/actions/auth.action";
import LoginScreen from "../app/auth/login/LoginScreen";
import ForgotPasswordScreen from "../app/auth/forget-password/ForgotPasswordScreen";
import NotificationScreen from "../app/notifications/NotificationScreen";
import HcpManagementListScreen from "../app/hcpManagement/list/HcpManagementListScreen";
import DashboardScreen from "../app/dashboard/DashboardScreen";
import HcpManagementViewScreen from "../app/hcpManagement/view/HcpManagementViewScreen";
import FacilityManagementListScreen from "../app/facilityManagement/list/FacilityManagementListScreen";
import FacilityManagementAddScreen from "../app/facilityManagement/add/FacilityManagementAddScreen";
import AddHcpComponent from "../app/hcpManagement/add/AddHcpComponent";
import FacilityManagementViewScreen from "../app/facilityManagement/view/FacilityManagementViewScreen";
import AddShiftsScreen from "../app/shifts/add/AddShiftsScreen";
import PendingShiftsListScreen from "../app/shifts/pending/list/PendingShiftsListScreen";
import CompletedShiftsListScreen from "../app/shifts/completed/list/CompletedShiftsListScreen";
import ClosedShiftsListScreen from "../app/shifts/closed/list/ClosedShiftsListScreen";
import CancelledShiftsListScreen from "../app/shifts/cancelled/list/CancelledShiftsListScreen";
import ShiftsMasterListScreen from "../app/shifts/shiftMaster/list/ShiftsMasterListScreen";
import EditHcpComponent from "../app/hcpManagement/edit/EditHcpComponent";
import FacilityManagementEditScreen from "../app/facilityManagement/edit/FacilityManagementEditScreen";
import GroupListScreen from "../app/communication/group/list/GroupListScreen";
import AddGroupScreen from "../app/communication/group/add/AddGroupScreen";
import GroupViewScreen from "../app/communication/group/view/GroupViewScreen";
import RemoveHcpsScreen from "../app/communication/group/removeHcps/RemoveHcpsScreen";
import AddHcpToExistingGroupScreen from "../app/communication/group/addHcptoExistingGroup/AddHcpToExistingGroupScreen";
import HcpUserViewScreen from "../app/communication/group/hcpViewDetails/HcpManagementViewScreen";
import ShiftCompletedViewScreen from "../app/shifts/shiftCompletedView/ShiftCompletedViewScreen";
import RequirementsShiftsViewScreen from "../app/shifts/shiftRequirementList/view/RequirementsShiftsViewScreen";
import ShiftInprogressListScreen from '../app/shifts/inprogress/list/ShiftInprogressListScreen'; 
import SendSmsBlastScreen from "../app/communication/smsBlast/SendSmsBlastScreen";
import ShiftRequirementListScreen from "../app/shifts/shiftRequirementList/list/ShiftRequirementListScreen";
import CreateShiftScreen from "../app/shifts/createShift/CreateShiftScreen";
import PendingShiftsViewScreen from "../app/shifts/pending/view/PendingShiftsViewScreen";
import ShiftInprogressViewScreen from "../app/shifts/inprogress/view/ShiftInprogressViewScreen";
import ShiftMasterViewScreen from "../app/shifts/shiftMaster/view/ShiftMasterViewScreen";
import ClosedShiftsViewScreen from '../app/shifts/closed/view/ClosedShiftsViewScreen';
import CancelledShiftsViewScreen from '../app/shifts/cancelled/view/CancelledShiftsViewScreen';
import ConflictResolutionListScreen from "../app/shifts/conflicts/list/ConflictResolutionListScreen";
import ConflictResolutionViewScreen from "../app/shifts/conflicts/view/ConflictResolutionViewScreen";
import FacilityViewTabsScreen from "../app/facilityManagement/viewtabs/FacilityViewTabsScreen";
import FacilityTaskAddComponent from "../app/facilityManagement/viewtabs/task/add/FacilityTaskAddComponent";
import FacilityNotesAddScreen from "../app/facilityManagement/viewtabs/notes/add/FacilityNotesAddScreen";
import HcpApprovedListScreen from "../app/hcpManagement/approvedHcpsList/HcpApprovedListScreen";
import EmployeeManagementScreen from "../app/employee/list/EmployeeManagementScreen";
import AddEmployeeComponent from "../app/employee/add/AddEmployeeComponent";
import EmployeeViewScreen from "../app/employee/view/EmployeeViewScreen";
import EditEmployeeComponent from "../app/employee/edit/EditEmployeeComponent";

// @ts-ignore
const AuthLayoutRoute = ({ component: Component, ...rest }) => {
  let doneUrl = "/dashboard";
  const { token } = useSelector((state: StateParams) => state.auth);
  if (!!token) {
    const query = CommonService.parseQueryString(rest.location.search);
    if (query.hasOwnProperty("done")) {
      doneUrl = query.done;
    }
    return <Redirect to={doneUrl} />;
  }
  return (
    <Route
      {...rest}
      render={(matchProps) => (
        <AuthLayout>
          <Component {...matchProps} />
        </AuthLayout>
      )}
    />
  );
};

// @ts-ignore
const AppLayoutRoute = ({ component: Component, ...rest }) => {
  // const query = new URLSearchParams(rest.location.search);
  // console.log(rest, 'AppLayoutRoute');
  const { token } = useSelector((state: StateParams) => state.auth);
  if (!!token) {
    return (
      <Route
        {...rest}
        render={(matchProps) => (
          <AppLayout>
            <Component {...matchProps} />
          </AppLayout>
        )}
      />
    );
  }
  return (
    <Redirect
      to={"/login?done=" + encodeURIComponent(rest.location.pathname)}
    />
  );
};

const Navigator = (props: any) => {
  const history = useHistory();
  const dispatch = useDispatch();
  useEffect(() => {
    const logoutSubjectSub = Communications.logoutSubject.subscribe(() => {
      dispatch(logoutUser());
      history.push("/login");
    });
    const reloadSubjectSub = Communications.ReloadStateSubject.subscribe(() => {
      history.push("/dashboard");
    });
    return () => {
      logoutSubjectSub.unsubscribe();
      reloadSubjectSub.unsubscribe();
    };
  }, [dispatch, history]);
  return (
    <Switch>
      <Route exact path="/">
        <Redirect to={"/dashboard"} />
      </Route>

      <AuthLayoutRoute path="/login" component={LoginScreen} />
      <AuthLayoutRoute path="/forgot-password" component={ForgotPasswordScreen}/>
      <AppLayoutRoute path="/dashboard" component={DashboardScreen} />
      <AppLayoutRoute path="/notifications" component={NotificationScreen} />
      <AppLayoutRoute path="/hcp/list" component={HcpManagementListScreen} />
      <AppLayoutRoute path="/hcp/user/list" component={HcpApprovedListScreen} />
      <AppLayoutRoute path="/hcp/add" component={AddHcpComponent} />
      <AppLayoutRoute path="/hcp/view/:id" component={HcpManagementViewScreen}/>
      <AppLayoutRoute path="/creatShift/:id" component={CreateShiftScreen}/>
      <AppLayoutRoute path="/hcp/user/view/:id" component={HcpUserViewScreen} />
      <AppLayoutRoute path="/hcp/edit/:id" component={EditHcpComponent} />
      <AppLayoutRoute path="/facility/list" component={FacilityManagementListScreen}/>
      <AppLayoutRoute path="/facility/add" component={FacilityManagementAddScreen}/>
      <AppLayoutRoute path="/facility/view/:id" component={FacilityManagementViewScreen} />
      <AppLayoutRoute path="/facility/tabs/:id" component={FacilityViewTabsScreen} />
      <AppLayoutRoute path="/facility/edit/:id" component={FacilityManagementEditScreen} />
      <AppLayoutRoute path="/shift/add" component={AddShiftsScreen} />
      <AppLayoutRoute path="/approvedShifts/list" component={PendingShiftsListScreen}/>
      <AppLayoutRoute path="/approvedShifts/view/:id" component={PendingShiftsViewScreen}/>
      <AppLayoutRoute path="/shiftrequirementMaster/list" component={ShiftRequirementListScreen}/>
      <AppLayoutRoute path="/inprogessShifts/list" component={ShiftInprogressListScreen} />
      <AppLayoutRoute path="/employee/list" component={EmployeeManagementScreen} />
      <AppLayoutRoute path="/employee/add" component={AddEmployeeComponent}/>
      <AppLayoutRoute path="/employee/view/:id" component={EmployeeViewScreen} />
      <AppLayoutRoute path="/employee/edit/:id" component={EditEmployeeComponent} />
      <AppLayoutRoute path="/inprogessShifts/view/:id" component={ShiftInprogressViewScreen} />
      <AppLayoutRoute path="/shiftMaster/view/:id" component={ShiftMasterViewScreen} />
      <AppLayoutRoute path="/shiftsRequirements/view/:id" component={RequirementsShiftsViewScreen}/>
      <AppLayoutRoute path="/completedShifts/list" component={CompletedShiftsListScreen}  />
      <AppLayoutRoute path="/completedShifts/view/:id" component={ShiftCompletedViewScreen}/>
      <AppLayoutRoute path="/closedShifts/list" component={ClosedShiftsListScreen}/>
      <AppLayoutRoute path="/cancelledShifts/list" component={CancelledShiftsListScreen}/>
      <AppLayoutRoute path="/closedShifts/view/:id" component={ClosedShiftsViewScreen}/>
      <AppLayoutRoute path="/cancelledShifts/view/:id" component={CancelledShiftsViewScreen}/>
      <AppLayoutRoute path="/shiftMaster/list" component={ShiftsMasterListScreen} />
      <AppLayoutRoute path="/group/add" component={AddGroupScreen} />
      <AppLayoutRoute path="/group/list" component={GroupListScreen} />
      <AppLayoutRoute path="/conflicts/list" component={ConflictResolutionListScreen} />
      <AppLayoutRoute path="/conflicts/view/:id" component={ConflictResolutionViewScreen} />
      <AppLayoutRoute path="/group/view/:id" component={GroupViewScreen} />
      <AppLayoutRoute path="/group/remove/:id" component={RemoveHcpsScreen} />
      <AppLayoutRoute path="/group/edit/member/:id" component={AddHcpToExistingGroupScreen}/>
      <AppLayoutRoute path="/sendSmsBlast" component={SendSmsBlastScreen} />
      <AppLayoutRoute path="/facility/notes/add" component={FacilityNotesAddScreen} />
      <AppLayoutRoute path="/facility/task/add" component={FacilityTaskAddComponent} />
      <Route path="/not-found">
        <NotFoundComponent />
      </Route>
      <Route path="*">
        <Redirect to={"/not-found"} />
      </Route>
    </Switch>
  );
};

const MainRouter = () => {
  return (
    <BrowserRouter>
      <Navigator />
    </BrowserRouter>
  );
};

export default MainRouter;
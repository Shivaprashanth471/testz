import { List, ListItem, ListItemIcon, ListItemText, ListSubheader } from "@material-ui/core";
import HomeOutlined from "@material-ui/icons/HomeOutlined";
import React from "react";
import { NavLink } from "react-router-dom";
import { ColorDashboard, ColorfacilityMaster, ColorGroupAdd, ColorHCPManagement, ColorHCPOnboarding, ColorShiftRequirement, ColorShiftsCancelled, ColorShiftsClosed, ColorShiftsCompleted, ColorShiftsInprogress, ColorShiftsMaster, ColorShiftsPending, ColorSMSBlast, Dashboard, facilityMaster, groupAdd, HCPManagement, HCPOnboarding, ShiftRequirement, ShiftsCancelled, ShiftsClosed, ShiftsCompleted, ShiftsInprogress, ShiftsMaster, ShiftsPending, SMSBlast } from "../constants/ImageConfig";
import { ACCOUNTMANAGER, ADMIN, HUMANRESOURCE, NURSECHAMPION } from "../helpers/common-service";
import AccessControlComponent from "./AccessControl";

export interface Menu {
  state: string;
  name: string;
  type: string;
  icon: any;
  children: any;
  allowed_roles: ("super_admin" | "account_manager" | "nurse_champion" | "hr" | "finance_manager")[];
}

export const MENUITEMS: Menu[] = [
  {
    state: "",
    name: "Dashboard",
    type: "",
    icon: <HomeOutlined />,
    allowed_roles: [ADMIN, ACCOUNTMANAGER, HUMANRESOURCE, NURSECHAMPION],
    children: [
      {
        state: "/dashboard",
        name: "Dashboard",
        type: "link",
        icon: Dashboard,
        coloredIcon: ColorDashboard,
      },
    ],
  },
  {
    state: "",
    name: "Facility",
    type: "",
    icon: <HomeOutlined />,
    allowed_roles: [ADMIN, ACCOUNTMANAGER, NURSECHAMPION],
    children: [
      {
        state: "/facility/list",
        name: "Facility Management",
        type: "link",
        icon: facilityMaster,
        coloredIcon: ColorfacilityMaster,
      },
    ],
  },
  {
    state: "",
    name: "Applications",
    type: "",
    icon: <HomeOutlined />,
    allowed_roles: [ADMIN, HUMANRESOURCE],
    children: [
      {
        state: "/hcp/list",
        name: "HCP Onboarding",
        type: "link",
        icon: HCPOnboarding,
        coloredIcon: ColorHCPOnboarding,
      },
    ],
  },
  {
    state: "",
    name: "HCP Management",
    type: "",
    icon: <HomeOutlined />,
    allowed_roles: [ADMIN, NURSECHAMPION, ACCOUNTMANAGER, HUMANRESOURCE],
    children: [
      {
        state: "/hcp/user/list",
        name: "HCP Approved",
        type: "link",
        icon: HCPManagement,
        coloredIcon: ColorHCPManagement,
      },
      // {
      //   state: "/hcp/user/list",
      //   name: "HCP Rejected",
      //   type: "link",
      //   icon: HCPManagement,
      //   coloredIcon: ColorHCPManagement,
      // }
    ],
  },
  {
    state: "",
    name: "Communication",
    type: "",
    icon: <HomeOutlined />,
    allowed_roles: [ADMIN, ACCOUNTMANAGER, NURSECHAMPION],
    children: [
      {
        state: "/group/list",
        name: "Create Group",
        type: "link",
        icon: groupAdd,
        coloredIcon: ColorGroupAdd,
      },
      {
        state: "/sendSmsBlast",
        name: "Send SMS Blast",
        type: "link",
        icon: SMSBlast,
        coloredIcon: ColorSMSBlast,
      },
    ],
  },
  {
    state: "",
    name: "Shift Management",
    type: "",
    icon: <HomeOutlined />,
    allowed_roles: [ADMIN, ACCOUNTMANAGER, NURSECHAMPION],
    children: [
      {
        state: "/shiftrequirementMaster/list",
        name: "Open Shifts",
        type: "link",
        icon: ShiftRequirement,
        coloredIcon: ColorShiftRequirement,
      },
      {
        state: "/shiftMaster/list",
        name: "Shifts Master",
        type: "link",
        icon: ShiftsMaster,
        coloredIcon: ColorShiftsMaster,
      },
      {
        state: "/approvedShifts/list",
        name: "Shifts Approved",
        type: "link",
        icon: ShiftsPending,
        coloredIcon: ColorShiftsPending,
      },
      {
        state: "/inprogessShifts/list",
        name: " Shifts Inprogress",
        type: "link",
        icon: ShiftsInprogress,
        coloredIcon: ColorShiftsInprogress,
      },
      {
        state: "/completedShifts/list",
        name: "Shifts Completed",
        type: "link",
        icon: ShiftsCompleted,
        coloredIcon: ColorShiftsCompleted,
      },
      {
        state: "/closedShifts/list",
        name: "Shifts Closed",
        type: "link",
        icon: ShiftsClosed,
        coloredIcon: ColorShiftsClosed,
      },
      {
        state: "/cancelledShifts/list",
        name: "Shifts Cancelled",
        type: "link",
        icon: ShiftsCancelled,
        coloredIcon: ColorShiftsCancelled,
      },

      // {
      //   state: "/sendSmsBlast",
      //   name: "Send SMS Blast",
      //   type: "link",
      //   icon: SMSBlast,
      //   coloredIcon: ColorSMSBlast,
      // },
    ],
  },
  // {
  //   state: "",
  //   name: "Employee Management",
  //   type: "",
  //   icon: <HomeOutlined />,
  //   allowed_roles: [ADMIN, HUMANRESOURCE],
  //   children: [
  //     {
  //       state: "/employee/list",
  //       name: "Employee Management",
  //       type: "link",
  //       icon: HCPManagement,
  //       coloredIcon: ColorHCPManagement,
  //     },
  //   ],
  // },
  // {
  //   state: "",
  //   name: "Conflict Resolutions",
  //   type: "",
  //   icon: <HomeOutlined />,
  //   allowed_roles: [ADMIN, ACCOUNTMANAGER, NURSECHAMPION],
  //   children: [
  //     {
  //       state: "/conflicts/list",
  //       name: "Tickets Raised",
  //       type: "link",
  //       icon: facilityMaster,
  //       coloredIcon: ColorfacilityMaster,
  //     },
  //   ],
  // },
];
const MenuItemsComponent = (props: any) => {
  return (
    <List>
      {MENUITEMS &&
        MENUITEMS.length > 0 &&
        MENUITEMS.map((item, index) => {
          return (
            <AccessControlComponent
              key={index + "-menu-item"}
              role={item.allowed_roles}
            >
              <ListSubheader>{item.name}</ListSubheader>
              {item.children &&
                item.children.length > 0 &&
                item.children.map((subItem: any, index: any) => {
                  return (
                    <ListItem button component={NavLink} to={subItem.state} id={"menu-item-" + subItem.name} key={index + "sub-menu-item"}>
                      <ListItemIcon className={'active-icon'}><img src={subItem.icon} alt="icon" /></ListItemIcon>
                      <ListItemIcon className={'inactive-icon'}><img src={subItem.coloredIcon} alt="filled-icon" /></ListItemIcon>

                      <ListItemText primary={subItem.name} />
                    </ListItem>
                  );
                })}
            </AccessControlComponent>
          );
        })}
    </List>
  );
};

export default MenuItemsComponent;

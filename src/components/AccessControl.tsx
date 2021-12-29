import React, { PropsWithChildren } from 'react';
import { useSelector } from "react-redux";
import { StateParams } from "../store/reducers";

export interface AccessControlComponentProps {
    role: ('super_admin' | 'account_manager' | 'hr' | 'finance_manager' | 'nurse_champion')[],
}

const AccessControlComponent = (props: PropsWithChildren<AccessControlComponentProps>) => {
    const { user } = useSelector((state: StateParams) => state.auth);
    return (
        <>
            {user && props.role.indexOf(user.role) > -1 && props.children}
        </>
    )
};

export default AccessControlComponent;

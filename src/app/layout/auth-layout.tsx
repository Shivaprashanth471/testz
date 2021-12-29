import React, { PropsWithChildren } from 'react';
import { ImageConfig } from '../../constants';
import './auth-layout.scss';
import {login} from "../../constants/ImageConfig";
export interface AuthLayoutProps {

}

const AuthLayout = (props: PropsWithChildren<AuthLayoutProps>) => {

    return (
        <div className={'auth-layout'}>
        <div className="container auth-layout-wrapper ">

        <div className='main-wrapper'>
           <div className='img-wrapper'>
           {/* <div className={'no-repeat-background'} style={{ backgroundImage: 'url(' + login + ')' }}></div> */}
           <img src={login} alt={''}/>
           </div>

           <div className='auth-wrapper position-relative'>
             <div className="auth-layout-card">
                    <div className="main-auth-holder">
                        <div className="logo">
                            <img src={ImageConfig.logo} alt={''} />
                        </div>
                        {props.children}
                    </div>
                    <div className="powered-by-wrapper">
                        {/*<div>A product of&nbsp;&nbsp;<img src={ImageConfig.illumuLogo} alt={''} height="14"/></div>*/}
                    </div>
             </div>
           </div>
        </div>
           
           
           </div>

        </div>
    )
};

export default AuthLayout;

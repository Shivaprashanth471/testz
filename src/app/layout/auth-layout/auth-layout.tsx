import React, { PropsWithChildren } from 'react';
import { ImageConfig } from '../../../constants';
import './auth-layout.scss';

export interface AuthLayoutProps {

}

const AuthLayout = (props: PropsWithChildren<AuthLayoutProps>) => {

    return (
        <div className={'auth-layout'}>
            <div className="container auth-layout-wrapper ">

                <div className='main-wrapper'>
                    <div className='img-wrapper'>
                         <div className={'no-repeat-background'} style={{ backgroundImage: 'url(' + ImageConfig.AuthPoster + ')' }}/>
                    </div>

                    <div className='auth-wrapper position-relative'>
                        <div className="auth-layout-card">
                            <div className="main-auth-holder">
                                <div className="logo">
                                    <img src={ImageConfig.Logo} alt={''}/>
                                </div>
                                {props.children}
                            </div>
                            <div className="powered-by-wrapper">
                            </div>
                        </div>
                    </div>
                </div>


            </div>

        </div>
    )
};

export default AuthLayout;

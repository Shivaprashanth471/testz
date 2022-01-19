import React from 'react';
import {ImageConfig} from "../constants";
import {Link} from "react-router-dom";
import {Button} from "@material-ui/core";
import {ArrowBackOutlined} from "@material-ui/icons";

export interface NotFoundComponentProps {
    backUrl?: string
}

const NotFoundComponent = (props: NotFoundComponentProps) => {
    const backUrl = props.backUrl || '/';
    return (
        <div className="container">
            <div className="text-center">
                <img src={ImageConfig.NotFound} alt={''} className="img-responsive mrg-top-50 animation-slide-in-up"/>
                <div className="ts-clearfix">&nbsp;</div>
                <Button variant={"text"} color={"primary"} component={Link} to={backUrl}>
                    <ArrowBackOutlined/>&nbsp;Back
                </Button>
            </div>

        </div>

    )
};

export default NotFoundComponent;

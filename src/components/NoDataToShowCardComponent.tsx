import React from 'react';
import ErrorComponent from "./core/ErrorComponent";
import { SearchRounded } from "@material-ui/icons";

const NoDataToShowCardComponent = () => {
    return (
        <div className={'display-flex flex-one mrg-top-20'}>
            <ErrorComponent text={'Nothing to show here'} textColor={"black"} icon={<SearchRounded style={{ fontSize: 60 }} color={"primary"}/>} />
        </div>
    )
};

export default NoDataToShowCardComponent;
import React from 'react';
import { TableCell, TableRow } from "@material-ui/core";
import Lottie from "react-lottie";
import animationData from "../assets/animations/NoData.json";

export interface NoDataCardComponentProps {
    tableCellCount?: number
}

const NoDataCardComponent = (props: NoDataCardComponentProps) => {
    const tableCellCount = props.tableCellCount || 10;

    const defaultOptions = {
        animationData
    };

    return (
         <TableRow className={"mat-tr"}>
            <TableCell colSpan={tableCellCount}>
                <div className={'display-flex flex-one mrg-top-20'}>
                    <Lottie
                        width={700}
                        height={300}
                        speed={1}
                        options={defaultOptions}
                    />
                </div>
            </TableCell>
        </TableRow>
    )
};

export default NoDataCardComponent;

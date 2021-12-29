import React, {PropsWithChildren, useState} from 'react';
import {ExpandLessOutlined, ExpandMoreOutlined} from "@material-ui/icons";

export interface AccordionComponentProps {
    header: any,
    isOpen?: boolean
}

const AccordionComponent = (props: PropsWithChildren<AccordionComponentProps>) => {
    const {header, children, isOpen} = props;
    const [expand, setExpand] = useState(!!(isOpen));
    return (
        <div className={'accordion component'}>
            <div style={{display: "flex", flex: 1}}>
                <div className={'accordionHeader'}>
                    {header}
                </div>
                <div onClick={() => {
                    setExpand(!expand);
                }} style={{
                    flexDirection: 'row',
                    display: "flex",
                    cursor: "pointer",
                    justifyContent: 'center',
                    alignItems: "center"
                }}>
                    {!expand && <ExpandMoreOutlined/>}
                    {expand && <ExpandLessOutlined/>}
                </div>
            </div>
            <div>
                {
                    expand ? children : null
                }
            </div>
        </div>
    )
};

export default AccordionComponent;

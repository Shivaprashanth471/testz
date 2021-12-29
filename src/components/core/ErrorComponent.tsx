import React from 'react';
import {Colors} from "../../constants";
import {ErrorOutline} from "@material-ui/icons";

export interface ErrorComponentProps {
    backgroundColor?: string,
    text?: string,
    textColor?: string,
    textStyle?: React.CSSProperties,
    descriptionTextStyle?: React.CSSProperties,
    textContainerStyle?: React.CSSProperties,
    descriptionTextContainerStyle?: React.CSSProperties,
    textSize?: number,
    icon?: any,
    onRefresh?: () => void,
    buttonText?: string,
    buttonClass?: "primary" | "secondary",
    descriptionText?: string,
    descriptionTextColor?: string
    descriptionTextSize?: number,
}

const ErrorComponent = (props: ErrorComponentProps) => {
    const backgroundColor = props.backgroundColor || '#FFF';
    const text = props.text || 'Oops... Something went wrong!';
    const textColor = props.textColor || Colors.accent;
    const textSize = props.textSize || 20;

    const textStyle = props.textStyle || undefined;
    const descriptionTextStyle = props.descriptionTextStyle || undefined;
    const textContainerStyle = props.textContainerStyle || undefined;
    const descriptionTextContainerStyle = props.descriptionTextContainerStyle || undefined;

    const descriptionText = props.descriptionText || undefined;
    const descriptionTextColor = props.descriptionTextColor || Colors.accent;
    const descriptionTextSize = props.descriptionTextSize || 16;

    const IconComponent = props.icon || <ErrorOutline color={"primary"} fontSize={"large"} />;
    // const onRefresh = props.onRefresh;
    // const buttonText = props.buttonText || 'reload';
    // const buttonClass = props.buttonClass || 'secondary';

    return (
        <div style={{
            padding:'10px',
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: backgroundColor
        }}>
            {IconComponent}
            <div style={{margin: '20px 0', display: 'flex', ...textContainerStyle}}>
                <div style={{
                    lineHeight: '30px',
                    display: 'flex',
                    textAlign: 'center',
                    color: textColor,
                    fontSize: textSize,
                    ...textStyle
                }}>{text}</div>
            </div>
            {descriptionText && <div style={{marginBottom: '30px', display: 'flex', ...descriptionTextContainerStyle}}>
                <div style={{
                    lineHeight: '24px',
                    textAlign: 'center',
                    color: descriptionTextColor,
                    fontSize: descriptionTextSize,
                    ...descriptionTextStyle
                }}>{descriptionText}</div>
            </div>}
            {/*{onRefresh && <CustomButton autoWidth={true} title={buttonText} class={buttonClass} onPress={onRefresh}/>}*/}
        </div>
    )
};

export default ErrorComponent;

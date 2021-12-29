import React, {useEffect, useState} from 'react';
import "./NotificationCardComponent.scss";
import {NotificationCardProps} from '../../../constants/CommonTypes';
import CircularStatic from '../progress/CircularProgress';
import {Card, Typography} from '@material-ui/core';
import {format} from 'timeago.js';
import {Colors} from "../../../constants";

interface NotificationCardComponentProps {
    notification: NotificationCardProps;
}

const NotificationCardComponent = (props: NotificationCardComponentProps) => {
    // console.log(props)
    const {student_uid, student_name, _created, emotion_levels, is_read} = props.notification;
    const [majorEmotion, setMajorEmotion] = useState<any | null>(null);
    const [majorEmotionPercentage, setMajorEmotionPercentage] = useState<any | null>(null);

    useEffect(() => {
        if (emotion_levels) {
            const keys = Object.keys(emotion_levels);
            const values = Object.values(emotion_levels);

            if (keys && keys.length > 0) {
                setMajorEmotion(keys[0] || '');
                setMajorEmotionPercentage(parseInt(values[0]) || 0);
            }
        }
    }, [emotion_levels]);

    return (
        <Card variant="outlined"
              className={"notification-card component mrg-bottom-20" + ((!is_read) ? ' unread' : '')}>
            <div className={"details"}>
                <div className={"content"}>
                    <div className={''}>
                        <CircularStatic progress={majorEmotionPercentage}/>
                    </div>
                    <div className={'flex-two'}>
                        <Typography variant="subtitle2"
                                    style={{
                                        textTransform: "capitalize", color: Colors.accent,
                                        whiteSpace: 'nowrap',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                        width: '90%'
                                    }} display="block">{student_name}</Typography>
                        <Typography variant="caption" style={{textTransform: "uppercase", color: Colors.accent}}
                                    display="block">UID: {student_uid}</Typography>
                    </div>
                    <div className={"card-timestamp flex-one"}>
                        <Typography variant="caption" style={{textTransform: "uppercase", fontWeight: "bold"}}
                                    display="block">{majorEmotion}</Typography>
                        <Typography variant="caption" style={{textTransform: "capitalize", color: Colors.accent}}
                                    display="block">{_created ? format(_created) : '-'}</Typography>
                    </div>
                </div>
            </div>
        </Card>
    )
}

export default NotificationCardComponent;

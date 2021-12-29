export interface TsConfirmationItem {
    color?: 'default' | 'primary' | 'secondary' | 'inherit';
    text?: string;
}

export interface TsConfirmationConfig {
    no?: TsConfirmationItem;
    yes?: TsConfirmationItem;
    confirmationText?: string;
}

export interface DialogMethodProps {
    confirm?: () => void,
    cancel?: () => void,
    organisation_id? : string,
}

export interface NotificationCardProps {
    student_uid?: string;
    student_name?: string;
    emotion_levels?: Object;
    _created?: string;
    is_read: boolean
}

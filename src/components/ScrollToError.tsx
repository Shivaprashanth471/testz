import { useFormikContext } from 'formik';
import { useEffect } from 'react';

export function ScrollToError() {
    const formik = useFormikContext();
    const submitting = formik?.isSubmitting;

    useEffect(() => {
        const el = document.querySelector('.Mui-error, [data-error],.form-error');
        if (el?.id === 'input_facility_add_extension_number-label') {
            (el?.parentElement?.parentElement?.parentElement?.parentElement?.parentElement)?.scrollIntoView();
        }
        else {
            (el?.parentElement?.parentElement?.parentElement)?.scrollIntoView({ behavior: "smooth", block: "start", inline: "start" });
        }
    }, [submitting]);
    return null;
}
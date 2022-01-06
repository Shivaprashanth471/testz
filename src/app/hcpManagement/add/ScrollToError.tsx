import { useFormikContext } from 'formik';
import { useEffect } from 'react';

export function ScrollToError() {
    const formik = useFormikContext();
    const submitting = formik?.isSubmitting;

    useEffect(() => {
        const el = document.querySelector('.Mui-error, [data-error],.form-error');

        (el?.parentElement?.parentElement?.parentElement?.parentElement)?.scrollIntoView();
    }, [submitting]);
    return null;
}
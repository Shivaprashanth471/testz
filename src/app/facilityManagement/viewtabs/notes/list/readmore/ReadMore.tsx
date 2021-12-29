import React from 'react'
import './ReadMore.scss'

const ReadMore = (props: any) => {
    const [isReadMore, setIsReadMore] = React.useState<boolean>(true);
    const toggleReadMore = () => {
        setIsReadMore(!isReadMore);
    };
    return (
        <p className='content'>
            {
                isReadMore ? props?.content?.slice(0, 400) : props.content
            }
            <span onClick={toggleReadMore} className='read-or-hide'>
                {
                    isReadMore ? 'read more' : 'show less'
                }
            </span>
        </p>
    )
}

export default ReadMore

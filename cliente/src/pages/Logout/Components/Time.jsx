import React from 'react'
import '../../../styles.scss';
import moment from 'moment';

export default function Time() {
    return (
        <div className="login-clock">
            {moment().format("MMM Do YY")}
        </div>
    )
}

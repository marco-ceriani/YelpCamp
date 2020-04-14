import React from 'react';

import classes from './Image4By3.module.css';

const Image4By3 = props => {

    const imgClasses = ["img-thumbnail", classes.Image];
    return (
        <div className="embed-responsive embed-responsive-4by3">
            <img src={props.src} className={imgClasses.join(" ")} alt={props.alt} />
        </div>
    );
}

export default Image4By3;

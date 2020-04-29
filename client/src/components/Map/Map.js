import React from 'react';

import classes from './Map.module.css';

const EMPTY_MAP_CLASSES = [classes.MapEmpty, "d-flex", "justify-content-center", "align-items-center"];

const Map = props => {

    let mapContent = (
        <div className={EMPTY_MAP_CLASSES.join(" ")}>
            <i className="fas fa-globe alig"></i>
        </div>
    );

    if (props.url) {
        mapContent = (
            <div>
                <div className="embed-responsive embed-responsive-4by3">
                    <iframe src={props.url} title="Open Map" scrolling="no" marginHeight="0" marginWidth="0"
                        className="embed-responsive-item">
                    </iframe>
                </div>
                <a href={props.maplink || ''}>Open map</a>
            </div>
        );
    }
    return <div id="map" className={classes.MapContainer}>{mapContent}</div>;

}

export default Map;

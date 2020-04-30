import React from 'react';

import { Row } from 'react-bootstrap';
import CampgroundCard from '../CampgroundCard/CampgroundCard';

const CampgroundsGrid = ({ campgrounds }) => {
    return (
        <Row className="text-center">
            {campgrounds.map(camp => (
                <CampgroundCard
                    key={camp.id}
                    id={camp.id}
                    name={camp.name}
                    image={camp.image}
                />
            ))}
        </Row>
    )
}

export default React.memo(CampgroundsGrid);

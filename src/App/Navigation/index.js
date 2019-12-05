import React from 'react';
import {Link, withRouter} from 'react-router-dom';
import OrganizationSearch from '../../OrganizationSearch';

import * as routes from '../../constants/routes';
import './style.css';

const Navigation = ({
    location:{pathname}, 
    organizationName, 
    onOrganizationSearch
}) => (
        <header className="Navigation">
            <div className="Nvaigation-link">
                <Link to={routes.PROFILE}>Profile</Link>
            </div>
            <div className="Nvaigation-link">
                <Link to={routes.ORGANIZATION}>Organization</Link>
            </div>
            {pathname === routes.ORGANIZATION && (
                <OrganizationSearch
                organizationName={organizationName}
                onOrganizationSearch={onOrganizationSearch}
                />
            )}
        </header>
        );

export default withRouter(Navigation);
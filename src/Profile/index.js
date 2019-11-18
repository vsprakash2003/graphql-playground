import React from 'react';
import gql from 'graphql-tag';
import {Query} from 'react-apollo';

const GET_CURRENT_USER = gql`
    {
        viewer {
            login
            name
        }
    }
`;

const Profile = () => (
    <Query query = {GET_CURRENT_USER}>
        {({data, loading}) => {
            
            if (loading || !data) {
                return <div>Loading .....</div>;
            }

            if (!data) {
                return null;
            }
            
            const {viewer} = data;
            return (
                <div>
                    {viewer.name} {viewer.login}
                </div>
            );
        }}
    </Query>
);

export default Profile; 
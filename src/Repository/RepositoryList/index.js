import React, {Fragment} from 'react';
import Loading from '../../Loading';
import RepositoryItem from '../RepositoryItem';
import '../style.css';

const updateQuery = (previousResult, {fetchMoreResult}) => {
    if (!fetchMoreResult) {
        return previousResult;
    }

    return {
        ...previousResult,
        viewer: {
            ...previousResult.viewer,
            repositories: {
                ...previousResult.repositories,
                ...fetchMoreResult.repositories,
                edges: [
                    ...previousResult.viewer.repositories.edges,
                    ...fetchMoreResult.repositories.edges,
                ],
            },
        },
    };
};

const RepositoryList = ({repositories, loading, fetchMore}) => (
    <Fragment>
        {repositories.edges.map(({node}) => (
            <div key={node.id} className="RepositoryItem">
                <RepositoryItem {...node} />
            </div>
        ))}
        {loading ? (
            <Loading />
        ):(
        repositories.pageInfo.hasNextPage && (
            <button
                type="button"
                onClick={() =>
                    fetchMore({
                        variables: {
                            cursor: repositories.pageInfo.endCursor,
                        }, updateQuery,
                    })
                }
                >
                    More Repositories
                </button>
            )    
        )}
    </Fragment>
    );

export default RepositoryList;
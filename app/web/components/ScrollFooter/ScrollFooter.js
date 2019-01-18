/**
 * @file components/ScrollFooter.js
 * @author huangzongzhe
 */
import React from 'react';

const SCROLLLIST = {
    loading: 'Loading...',
    loaded: 'Loaded',
    end: 'No More o((⊙﹏⊙))o'
};
export default (isLoading, hasMore) => {
    return (
        <div style={{padding: 6, textAlign: 'center', color: 'rgba(255, 255, 255, 0.7)'}}>
            {
                isLoading
                    ? SCROLLLIST.loading
                    : (hasMore ? SCROLLLIST.loading : SCROLLLIST.end)
            }
        </div>
    );
};

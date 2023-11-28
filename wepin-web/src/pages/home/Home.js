import React from 'react';
import Layout from '../../components/Layout/Layout';
import WideMapList from '../../components/List/WideMapList/WideMapList';

function Home() {
    return (
        <Layout main={true}>
            <WideMapList />
        </Layout>
    );
}

export default Home;

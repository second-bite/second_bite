import React from 'react'

import PrimaryHeader from '../header/PrimaryHeader';
import Analytics from '../components/analytics/Analytics';
import FeedbackModal from '../components/modals/FeedbackModal';

const AnalyticsPage = () => {
    return (
        <>
            <PrimaryHeader />
            <main className="analytics_page">
                <Analytics />
            </main>
        </>
    );
}


export default AnalyticsPage
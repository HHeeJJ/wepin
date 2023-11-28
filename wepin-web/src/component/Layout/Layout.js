import React, {useRef} from 'react';
import Header from './Header/Header';
import Navigation from '../Navigation/Navigation';

function Layout(props) {
    const {main, pageTitle, back, isMine, children, nav} = props;

    const layoutScrollRef = useRef(null);

    return (
        <div id="contents">
            <Header main={main} pageTitle={pageTitle} back={back} isMine={isMine} />

            <div className="contentsArea" ref={layoutScrollRef}>
                {children}
            </div>

            {nav !== false && <Navigation layoutScrollRef={layoutScrollRef} />}
        </div>
    );
}

export default Layout;

import React from 'react';
import {useDispatch} from 'react-redux';
import styles from './Header.module.scss';
import Icon from '../../Icon/Icon';
import {history} from '../../../_helpers/history';
import {setMakePinOpen} from '../../../_store/makePin.slice';

function Header(props) {
    const {main, pageTitle, back} = props;

    const dispatch = useDispatch();

    // 내 핀 만들기 모달 오픈
    const handleMakePinOpen = () => {
        dispatch(setMakePinOpen(true));
    };

    return (
        <header id={styles.header}>
            <div className={styles.headerWrap}>
                {back && (
                    <button type="button" className={styles.btnBack} onClick={() => history.navigate(-1)}>
                        <Icon name="back" width="24" height="24" />
                    </button>
                )}

                <h1 className={main ? styles.logo : ''}>{main ? 'wepin' : pageTitle}</h1>

                {main && (
                    <button type="button" className={styles.btnWrite} onClick={handleMakePinOpen}>
                        <Icon name="rectWrite" width="28" height="28" />
                    </button>
                )}
            </div>
        </header>
    );
}

export default Header;

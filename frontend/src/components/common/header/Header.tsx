import React from 'react';
import { useMatch, useNavigate } from 'react-router-dom';

import ROUTE from '@constants/route';
import { Desktop } from '@assets/mediaQuery';
import useAuth from '@hooks/useAuth';
import user from '@assets/image/icon/user.svg';
import logout from '@auth/logout';
import theme from '@styles/theme';
import STYLE from '@constants/style';
import * as H from './Header.style';
import GradientButton from '../button/color/GradientButton';
import GradientButtonBlack from '../button/black/GradientButtonBlack';

function Header() {
  const { isLogin, isAdmin, setIsLogin } = useAuth();

  const matchCalendarTab = useMatch(ROUTE.CALENDAR);
  const matchCommunityTab = useMatch(`${ROUTE.COMMUNITY.BASE}/*`);
  const matchAdminTab = useMatch(`${ROUTE.ADMIN.BASE}/*`);

  const navigate = useNavigate();

  const goLogin = () => {
    navigate(ROUTE.LOGIN);
  };

  const goSignup = () => {
    navigate(ROUTE.SIGNUP);
  };

  const goProfile = () => {
    navigate(ROUTE.PROFILE.MYINFO);
  };

  const setLogout = async () => {
    await logout();
    setIsLogin(false);
    navigate(ROUTE.HOME);
  };

  const signupStyle: React.CSSProperties = {
    height: '4.6rem',
    margin: '0.4rem 1.6rem',
    background: theme.colors.black,
    backdropFilter: 'blur(0.2rem)',
    justifyContent: 'center',
    position: 'fixed',
    top: '3.7rem',
    right: '2%',
    zIndex: STYLE.Z_INDEX.TOP_PRIORITY,
  };

  const isLoginAndAdmin = isLogin && isAdmin;

  return (
    <Desktop>
      <>
        <H.Container>
          <H.LogoContainer>
            <H.Logo to={ROUTE.HOME} />
          </H.LogoContainer>
          <H.Tab to={ROUTE.CALENDAR} $active={matchCalendarTab !== null}>
            calendar
          </H.Tab>
          <H.Tab to={ROUTE.COMMUNITY.BASE} $active={matchCommunityTab !== null}>
            community
          </H.Tab>
          {isLoginAndAdmin && (
            <H.Tab to={ROUTE.ADMIN.BASE} $active={matchAdminTab !== null}>
              관리자
            </H.Tab>
          )}
          {isLogin ? (
            <GradientButtonBlack type="button" onClick={setLogout}>
              <p>Log out</p>
            </GradientButtonBlack>
          ) : (
            <GradientButtonBlack type="button" onClick={goLogin}>
              <p>Log in</p>
            </GradientButtonBlack>
          )}
        </H.Container>
        {isLogin ? (
          <H.User src={user} onClick={goProfile} />
        ) : (
          <GradientButton type="button" onClick={goSignup} style={signupStyle}>
            <p>Join HICC</p>
          </GradientButton>
        )}
      </>
    </Desktop>
  );
}

export default Header;

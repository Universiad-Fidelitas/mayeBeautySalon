import React, { useEffect } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { useLocation } from 'react-router-dom';
import useLayout from 'hooks/useLayout';
import { Footer } from 'layout/footer/Footer';
import Nav from 'layout/nav/Nav';
import RightButtons from 'layout/right-buttons/RightButtons';
import SidebarMenu from 'layout/nav/sidebar-menu/SidebarMenu';
import { useSelector } from 'react-redux';
import classNames from 'classnames';

const Layout = ({ children }) => {
  const { isLogin } = useSelector((state) => state.auth);
  useLayout();

  const { pathname } = useLocation();

  useEffect(() => {
    document.documentElement.click();
    window.scrollTo(0, 0);
    // eslint-disable-next-line
  }, [pathname]);

  if (pathname === '/') {
    return (
      <>
        <Nav />
        <main className={classNames('p-0', { isadmin: isLogin })}>
          <div className="h-100">
            <SidebarMenu />
            <Col className="h-100" id="contentArea">
              {children}
            </Col>
          </div>
        </main>
        <Footer />
        <RightButtons />
      </>
    );
  }
  return (
    <>
      <Nav />
      <main className={classNames({ isadmin: isLogin })}>
        <Container>
          <Row className="h-100">
            <SidebarMenu />
            <Col className="h-100" id="contentArea">
              {children}
            </Col>
          </Row>
        </Container>
      </main>
      <Footer />
      <RightButtons />
    </>
  );
};

export default React.memo(Layout);

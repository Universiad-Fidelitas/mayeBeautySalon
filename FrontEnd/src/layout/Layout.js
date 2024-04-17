import React, { useEffect } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { useLocation } from 'react-router-dom';
import useLayout from 'hooks/useLayout';
import { Footer } from 'layout/footer/Footer';
import Nav from 'layout/nav/Nav';
import RightButtons from 'layout/right-buttons/RightButtons';
import SidebarMenu from 'layout/nav/sidebar-menu/SidebarMenu';

const Layout = ({ children }) => {
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
        <main className="p-0">
          <Row className="h-100">
            <SidebarMenu />
            <Col className="h-100" id="contentArea">
              {children}
            </Col>
          </Row>
        </main>
        <Footer />
        <RightButtons />
      </>
    );
  }
  return (
    <>
      <Nav />
      <main>
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

import React from 'react';
import { Container } from 'react-bootstrap';

export const HomeView = () => {
  return (
    <div className='homepage-main'>
      <div className="home-page-hero">
        <Container>
          <div className="min-h-100 d-flex align-items-center">
            <div className="w-100 w-lg-75 w-xxl-50">
              <div>
                <div className="mb-5">
                  <h1 className="display-3 text-white">Maye Beauty Salón</h1>
                  <h1 className="display-3 text-white">Refleja tu belleza interior</h1>
                </div>
                <p className="h6 text-white lh-1-5 mb-5">
                  Nuestro equipo de estilistas expertos está aquí para realzar tu estilo en nuestro salón unisex. Accede a tu cuenta para disfrutar de una
                  experiencia exclusiva y descubre un mundo de belleza hecho a tu medida....
                </p>
              </div>
            </div>
          </div>
        </Container>
      </div>
      <div className="video-responsive">
      <h1 className="display-3 text-primary font-weight-bold mb-5">Como agendar citas</h1>
        <iframe src="https://www.youtube.com/embed/t6pTwKRVBFA?si=wFpjdxx6XRXGIKbP" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
      </div>
    </div>
  );
};

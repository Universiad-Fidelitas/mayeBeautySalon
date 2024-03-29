import React from 'react';
import { Button, Row, Col, Card, Dropdown, Badge } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';
import { OverlayScrollbarsComponent } from 'overlayscrollbars-react';
import HtmlHead from 'components/html-head/HtmlHead';
import BreadcrumbList from 'components/breadcrumb-list/BreadcrumbList';
import CsLineIcons from 'cs-line-icons/CsLineIcons';
import { useReports } from 'hooks/react-query/useReports';
import { useReports2 } from 'hooks/react-query/useReports2';
import { useReports3 } from 'hooks/react-query/useReports3';
import ChartCustomHorizontalTooltip from './chart/ChartCustomHorizontalTooltip';
import ChartSmallLine1 from './chart/ChartSmallLine1';
import ChartSmallLine2 from './chart/ChartSmallLine2';
import ChartSmallLine3 from './chart/ChartSmallLine3';
import ChartSmallLine4 from './chart/ChartSmallLine4';
import ChartBubble from './chart/ChartBubble';
import ChartSmallDoughnutChart1 from './chart/ChartSmallDoughnutChart1';
import ChartLargeLineStock from './chart/ChartLargeLineStock';
import ChartSmallDoughnutChart2 from './chart/ChartSmallDoughnutChart2';
import ChartSmallDoughnutChart3 from './chart/ChartSmallDoughnutChart3';
import ChartSmallDoughnutChart4 from './chart/ChartSmallDoughnutChart4';
import ChartSmallDoughnutChart5 from './chart/ChartSmallDoughnutChart5';
import ChartSmallDoughnutChart6 from './chart/ChartSmallDoughnutChart6';
import { CardReport } from './Inventario/CardReport';

const Dashboard = () => {
  const title = 'Panel de control';
  const description = 'Analytic Dashboard';

  const breadcrumbs = [
    { to: '', text: 'Home' },
    { to: 'dashboards', text: 'Dashboards' },
  ];
  const { data: reportsData } = useReports();
  const { data: reports2Data } = useReports2();
  const { data: reports3Data } = useReports3();
  let formFields;
  let profitsArray;
  if (reportsData) {
    formFields = reportsData.items;
    console.log('reportsData1', reportsData);
  } else {
    console.log('reportsData is undefined');
  }
  if (reports2Data) {
    console.log('reportsData2', reports2Data);
  } else {
    console.log('reportsData is undefined');
  }
  if (reports3Data) {
    console.log('reportsData3', reports3Data.items[0]);
    const reports4Data = {
      1: reports3Data.items[0].total_profits_last_6_month,
      2: reports3Data.items[0].total_profits_last_5_month,
      3: reports3Data.items[0].total_profits_last_4_month,
      4: reports3Data.items[0].total_profits_last_3_month,
      5: reports3Data.items[0].total_profits_last_2_month,
      6: reports3Data.items[0].total_profits_this_month,
    };
    profitsArray = Object.values(reports4Data).map(Number);
    console.log('repor4', profitsArray);
  } else {
    console.log('reportsData is undefined');
  }

  return (
    <>
      <HtmlHead title={title} description={description} />
      {/* Title and Top Buttons Start */}
      <div className="page-title-container">
        <Row>
          {/* Title Start */}
          <Col md="7">
            <h1 className="mb-0 pb-0 display-4">{title}</h1>
            <BreadcrumbList items={breadcrumbs} />
          </Col>
          {/* Title End */}
        </Row>
      </div>
      {/* Title and Top Buttons End */}

      <Row>
        <Col lg="12">
          {/* Stats Start */}
          <div className="d-flex">
            <h2 className="small-title">Reporte de Citas</h2>
          </div>
          <div className="mb-5">
            <Row className="g-2">
              <Col sm="6">
                <Card className="sh-11 hover-scale-up cursor-pointer">
                  <Card.Body className="h-100 py-3 align-items-center">
                    <Row className="g-0 h-100 align-items-center">
                      <Col xs="auto" className="pe-3">
                        <div className="bg-gradient-light sh-5 sw-5 rounded-xl d-flex justify-content-center align-items-center">
                          <CsLineIcons icon="navigate-diagonal" className="text-white" />
                        </div>
                      </Col>
                      <Col>
                        <Row className="gx-2 d-flex align-content-center">
                          <Col xs="12" className="col-12 d-flex">
                            <div className="d-flex align-items-center lh-1-25">Ganancias Mensuales</div>
                          </Col>
                          <Col xl="auto" className="col-12">
                            <Row>{reports2Data ? <div className="cta-2 text-primary">{reports2Data.items[0].Ganancias}</div> : null}</Row>
                          </Col>
                        </Row>
                      </Col>
                    </Row>
                  </Card.Body>
                </Card>
              </Col>
              <Col sm="6">
                <Card className="sh-11 hover-scale-up cursor-pointer">
                  <Card.Body className="h-100 py-3 align-items-center">
                    <Row className="g-0 h-100 align-items-center">
                      <Col xs="auto" className="pe-3">
                        <div className="bg-gradient-light sh-5 sw-5 rounded-xl d-flex justify-content-center align-items-center">
                          <CsLineIcons icon="check" className="text-white" />
                        </div>
                      </Col>
                      <Col>
                        <Row className="gx-2 d-flex align-content-center">
                          <Col xs="12" className="col-12 d-flex">
                            <div className="d-flex align-items-center lh-1-25">Citas del día</div>
                          </Col>
                          <Col xl="auto" className="col-12">
                            <Row>{reports2Data ? <div className="cta-2 text-primary">{reports2Data.items[0].Conteo_Hoy}</div> : null}</Row>
                          </Col>
                        </Row>
                      </Col>
                    </Row>
                  </Card.Body>
                </Card>
              </Col>
              <Col sm="6">
                <Card className="sh-11 hover-scale-up cursor-pointer">
                  <Card.Body className="h-100 py-3 align-items-center">
                    <Row className="g-0 h-100 align-items-center">
                      <Col xs="auto" className="pe-3">
                        <div className="bg-gradient-light sh-5 sw-5 rounded-xl d-flex justify-content-center align-items-center">
                          <CsLineIcons icon="alarm" className="text-white" />
                        </div>
                      </Col>
                      <Col>
                        <Row className="gx-2 d-flex align-content-center">
                          <Col xs="12" className="col-12 d-flex">
                            <div className="d-flex align-items-center lh-1-25">Citas de la semana</div>
                          </Col>
                          <Col xl="auto" className="col-12">
                            <Row>{reports2Data ? <div className="cta-2 text-primary">{reports2Data.items[0].Conteo_Semana}</div> : null}</Row>
                          </Col>
                        </Row>
                      </Col>
                    </Row>
                  </Card.Body>
                </Card>
              </Col>
              <Col sm="6">
                <Card className="sh-11 hover-scale-up cursor-pointer">
                  <Card.Body className="h-100 py-3 align-items-center">
                    <Row className="g-0 h-100 align-items-center">
                      <Col xs="auto" className="pe-3">
                        <div className="bg-gradient-light sh-5 sw-5 rounded-xl d-flex justify-content-center align-items-center">
                          <CsLineIcons icon="bitcoin" className="text-white" />
                        </div>
                      </Col>
                      <Col>
                        <Row className="gx-2 d-flex align-content-center">
                          <Col xs="12" className="col-12 d-flex">
                            <div className="d-flex align-items-center lh-1-25">Citas del mes</div>
                          </Col>
                          <Col xl="auto" className="col-12">
                            <Row>{reports2Data ? <div className="cta-2 text-primary">{reports2Data.items[0].Conteo_Mes}</div> : null}</Row>
                          </Col>
                        </Row>
                      </Col>
                    </Row>
                  </Card.Body>
                </Card>
              </Col>
              <Col sm="12">
                <Card className="sh-11 hover-scale-up cursor-pointer">
                  <Card.Body className="h-100 py-3 align-items-center">
                    <Row className="g-0 h-100 align-items-center">
                      <Col xs="auto" className="pe-3">
                        <div className="bg-gradient-light sh-5 sw-5 rounded-xl d-flex justify-content-center align-items-center">
                          <CsLineIcons icon="calendar" className="text-white" />
                        </div>
                      </Col>
                      <Col>
                        <Row className="gx-2 d-flex align-content-center">
                          <Col xs="12" className="col-12 d-flex">
                            <div className="d-flex align-items-center lh-1-25">Citas pendientes</div>
                          </Col>
                          <Col xl="auto" className="col-12">
                            <Row>{reports2Data ? <div className="cta-2 text-primary">{reports2Data.items[0].Conteo_Futuro}</div> : null}</Row>
                          </Col>
                        </Row>
                      </Col>
                    </Row>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </div>
          {/* Stats End */}
        </Col>
      </Row>
      <Row>{formFields ? <CardReport formFields={formFields} /> : null}</Row>

      <h2 className="small-title">Reporte de facturación</h2>
      <Row xs={1} md={2} className="g-4">
        <Col lg="6">
          <Card>
            <Card.Body>
              <Card.Title>Ganancias de productos</Card.Title>
              <Card.Text>{reports3Data ? <div className="cta-2 text-primary">{reports3Data.items[0].profits_products}</div> : null}</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col lg="6">
          <Card>
            <Card.Body>
              <Card.Title>Ganancias de servicios</Card.Title>
              <Card.Text>{reports3Data ? <div className="cta-2 text-primary">{reports3Data.items[0].profits_services}</div> : null}</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col lg="6">
          <Card>
            <Card.Body>
              <Card.Title>Gastos de salarios</Card.Title>
              <Card.Text>{reports3Data ? <div className="cta-2 text-primary">{reports3Data.items[0].salaries}</div> : null}</Card.Text>
            </Card.Body>
          </Card>
        </Col>

        <Col lg="6">
          <Card>
            <Card.Body>
              <Card.Title>Gastos de local</Card.Title>
              <Card.Text>{reports3Data ? <div className="cta-2 text-primary">{reports3Data.items[0].salon_expenses}</div> : null}</Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <br />
      <br />
      {profitsArray && <ChartLargeLineStock profits={profitsArray} />}
    </>
  );
};

export default Dashboard;

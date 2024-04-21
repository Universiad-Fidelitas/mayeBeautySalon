import React from 'react';
import { Row, Col, Card } from 'react-bootstrap';
import HtmlHead from 'components/html-head/HtmlHead';
import CsLineIcons from 'cs-line-icons/CsLineIcons';
import { useReports2 } from 'hooks/react-query/useReports2';
import { useReports3 } from 'hooks/react-query/useReports3';
import { useActionLogs, useErrorLogs } from 'hooks/react-query/useLogs';
import { OverlayScrollbarsComponent } from 'overlayscrollbars-react';
import moment from 'moment';
import 'moment/locale/es';
import classNames from 'classnames';
import { useIntl } from 'react-intl';
import ChartLargeLineStock from './chart/ChartLargeLineStock';
import { CardReport } from './Inventario/CardReport';



const Dashboard = () => {
  const title = 'Panel de control';
  const description = 'Analytic Dashboard';
  moment.locale('es'); // Set the locale to SpanishC

  const { data: actionLogs } = useActionLogs();
  const { data: errorLogs } = useErrorLogs();
  moment.locale('es'); // Set the locale to Spanish
  const { formatDate } = useIntl();


  const breadcrumbs = [];
  const { data: reports2Data } = useReports2();
  const { data: reports3Data } = useReports3();
  let formFields;
  let profitsArray;

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

      <Row>
        <Col lg="12">
          <h2 className="medium-title text-primary mb-3 font-weight-bold">Reporte de Citas</h2>
          <div className="mb-5">
            <Row className="g-2">
              <Col sm="6">
                <Card className="sh-11 hover-scale-up cursor-pointer border border-primary">
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
                            <div className="d-flex align-items-center lh-1-25 font-weight-bold">Ganancias Mensuales</div>
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
                <Card className="sh-11 hover-scale-up cursor-pointer border border-primary">
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
                            <div className="d-flex align-items-center lh-1-25 font-weight-bold">Citas del día</div>
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
                <Card className="sh-11 hover-scale-up cursor-pointer border border-primary">
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
                            <div className="d-flex align-items-center lh-1-25 font-weight-bold">Citas de la semana</div>
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
                <Card className="sh-11 hover-scale-up cursor-pointer border border-primary">
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
                            <div className="d-flex align-items-center lh-1-25 font-weight-bold">Citas del mes</div>
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
                <Card className="sh-11 hover-scale-up cursor-pointer border border-primary">
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
                            <div className="d-flex align-items-center lh-1-25 font-weight-bold">Citas pendientes</div>
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



      <Row>
        {/* Logs Start */}
        <h2 className="medium-title text-primary font-weight-bold mt-6">Registro de actividad</h2>
        <p>Hacer scroll en cada sección, para conocer más registros</p>
        <Col xl="6" className="mb-5">
          <Card className="sh-40 border border-primary logs-card">
            <Card.Body className="mb-n2 scroll-out">
            <h2 className="small-title font-weight-bold">Acciónes de usuarios</h2>
              <OverlayScrollbarsComponent options={{ scrollbars: { autoHide: 'leave' }, overflowBehavior: { x: 'hidden', y: 'scroll' } }}>
                {
                  actionLogs?.map(({ full_name, description: logDescription, date, affected_table, log_type }, index) => (
                    <Row key={index} className={classNames('g-0 mb-2', { 'border-bottom pb-3': index !== actionLogs.length - 1 })}>
                      <Col xs="auto">
                        <div className="sw-3 d-inline-block d-flex justify-content-start align-items-center ">
                          <div className="sh-3">
                            {log_type === 'update' && <CsLineIcons icon="edit" className="text-warning align-top" />}
                            {log_type === 'delete' && <CsLineIcons icon="bin" className="text-danger align-top" />}
                            {log_type === 'create' && <CsLineIcons icon="plus" className="text-success align-top" />}
                            {log_type === 'read' && <CsLineIcons icon="eye" className="text-info align-top" />}
                          </div>
                        </div>
                      </Col>
                      <Row className='flex-column gap-2'>
                        <Col>
                          <div className="text-muted">{ moment(date).calendar(null, {
                            sameDay: '[Hoy] - h:mm A',
                            nextDay: '[Mañana] - h:mm A',
                            nextWeek: 'dddd - h:mm A',
                            lastDay: '[Ayer] - h:mm A',
                            lastWeek: '[El] dddd [pasado] - h:mm A',
                            sameElse: 'L'
                          })}
                          </div>
                        </Col>
                        <Col>
                          <div className="text-alternate mt-n1 lh-1-25"><span className='font-weight-bold text-primary'>{ affected_table }</span> | { logDescription } por { full_name }</div>
                        </Col>
                      </Row>
                    </Row>
                  ))
                }
              </OverlayScrollbarsComponent>
            </Card.Body>
          </Card>
        </Col>
        <Col xl="6" className="mb-5">
          <Card className="sh-40 border border-primary logs-card">
            <Card.Body className="mb-n2 scroll-out">
            <h2 className="small-title font-weight-bold">Alertas</h2>
              <OverlayScrollbarsComponent options={{ scrollbars: { autoHide: 'leave' }, overflowBehavior: { x: 'hidden', y: 'scroll' } }}>
                {
                  errorLogs?.map(({ description: logDescription, date, affected_table, log_type }, index) => (
                    <Row key={index} className={classNames('g-0 mb-2', { 'border-bottom pb-3': index !== errorLogs.length - 1 })}>
                      <Col xs="auto">
                        <div className="sw-3 d-inline-block d-flex justify-content-start align-items-center">
                          <div className="sh-3">
                            {log_type === 'error' && <CsLineIcons icon="warning-hexagon" className="text-danger align-top" />}
                          </div>
                        </div>
                      </Col>
                      <Row className='flex-column gap-2'>
                        <Col>
                          <div className="text-muted">{ moment(date).calendar(null, {
                            sameDay: '[Hoy] - h:mm A',
                            nextDay: '[Mañana] - h:mm A',
                            nextWeek: 'dddd - h:mm A',
                            lastDay: '[Ayer] - h:mm A',
                            lastWeek: '[El] dddd [pasado] - h:mm A',
                            sameElse: 'L'
                          })}
                          </div>
                        </Col>
                        <Col>
                          <div className="text-alternate mt-n1 lh-1-25"><span className='font-weight-bold text-primary'>{ affected_table }</span> | { logDescription }</div>
                        </Col>
                      </Row>
                    </Row>
                  ))
                }
              </OverlayScrollbarsComponent>
            </Card.Body>
          </Card>
        </Col>
        {/* Logs End */}
        </Row>
      <Row>
        <CardReport />{' '}
      </Row>

      <h2 className="medium-title text-primary font-weight-bold mt-6 mb-3">Reporte de facturación</h2>
      <Row xs={1} md={2} className="g-4">
        <Col lg="6">
          <Card className='border border-primary'>
            <Card.Body>
              <Card.Title className='font-weight-bold'>Ganancias de productos</Card.Title>
              <Card.Text>{reports3Data ? <div className="cta-2 text-primary">{reports3Data.items[0].profits_products}</div> : null}</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col lg="6">
          <Card className='border border-primary'>
            <Card.Body>
              <Card.Title className='font-weight-bold'>Ganancias de servicios</Card.Title>
              <Card.Text>{reports3Data ? <div className="cta-2 text-primary">{reports3Data.items[0].profits_services}</div> : null}</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col lg="6">
          <Card className='border border-primary'>
            <Card.Body>
              <Card.Title className='font-weight-bold'>Gastos de salarios</Card.Title>
              <Card.Text>{reports3Data ? <div className="cta-2 text-primary">{reports3Data.items[0].salaries}</div> : null}</Card.Text>
            </Card.Body>
          </Card>
        </Col>

        <Col lg="6">
          <Card className='border border-primary'>
            <Card.Body>
              <Card.Title className='font-weight-bold'>Gastos de local</Card.Title>
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

import React, { useState, useRef, useMemo, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Row, Col, Card, Button, Dropdown } from 'react-bootstrap';
import HtmlHead from 'components/html-head/HtmlHead';
import BreadcrumbList from 'components/breadcrumb-list/BreadcrumbList';
import CsLineIcons from 'cs-line-icons/CsLineIcons';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import bootstrapPlugin from '@fullcalendar/bootstrap';
import moment from 'moment';
import { useIntl } from 'react-intl';
import { useGetMonthAppointments } from 'hooks/react-query/useAppointments';
import ModalAddEdit from './components/ModalAddEdit';
import { setSelectedEvent } from './calendarSlice';
import { AppointmentsModalAddEdit } from './AppointmentsModalAddEdit';

const CustomToggle = React.forwardRef(({ onClick }, ref) => (
  <Button
    ref={ref}
    size="sm"
    variant="foreground"
    className="btn-icon btn-icon-only shadow align-top mt-n2"
    onClick={(e) => {
      e.preventDefault();
      onClick(e);
    }}
  >
    <CsLineIcons icon="more-horizontal" data-cs-size="15" />
  </Button>
));

const Citas = () => {
  const { formatMessage: f, formatDate } = useIntl();
  const htmlTitle = f({ id: 'appointments.appointmentsTitle' });
  const htmlDescription = 'Implementation for a basic events and schedule application that built on top of Full Calendar plugin.';

  const breadcrumbs = [
    { to: '', text: 'Home' },
    { to: 'citas', title: f({ id: 'appointments.appointmentsTitle' }) },
  ];

  const calendarRef = useRef(null);
  const dispatch = useDispatch();
  const { themeValues } = useSelector((state) => state.settings);
  const [dateTitle, setDateTitle] = useState('');
  const [selectedView, setSelectedView] = useState('dayGridMonth');
  const [isShowModalAddEdit, setIsShowModalAddEdit] = useState(false);
  const { data: getMonthData, isSuccess: isGetMonthDataSuccess } = useGetMonthAppointments();

  const appointmentsData = useMemo(() => {
    if (!isGetMonthDataSuccess) {
      return [];
    }
    const { monthAppointments } = getMonthData;
    return monthAppointments.map((appointment) => {
      return {
        color: themeValues.primary,
        ...appointment,
      };
    });
  }, [getMonthData, isGetMonthDataSuccess, themeValues]);

  const onPrevButtonClick = () => {
    const calendarApi = calendarRef.current.getApi();
    calendarApi.prev();
    setDateTitle(calendarApi.view.title);
  };

  const onNextButtonClick = () => {
    const calendarApi = calendarRef.current.getApi();
    calendarApi.next();
    setDateTitle(calendarApi.view.title);
  };
  const onNewEventClick = () => {
    try {
      dispatch(setSelectedEvent({ id: 0, title: 'New Event', start: '', end: '' }));
      setIsShowModalAddEdit(true);
    } catch (e) {
      console.log('This action could not be completed');
    }
  };
  const viewDidMount = ({ view }) => {
    setDateTitle(view.title);
  };
  const changeView = (view) => {
    setSelectedView(view);
    if (calendarRef.current) {
      calendarRef.current.getApi().changeView(view);
    }
  };
  const getToday = () => {
    if (calendarRef.current) {
      calendarRef.current.getApi().today();
    }
  };

  const handleDateSelect = useCallback(
    async (selectInfo) => {
      const calendarApi = selectInfo.view.calendar;
      calendarApi.unselect();
      dispatch(setSelectedEvent({ id: 0, title: 'New Event', startDate: selectInfo.startStr }));
      setIsShowModalAddEdit(true);
    },
    [dispatch]
  );

  const handleEventClick = (clickInfo) => {
    const { id, url } = clickInfo.event;
    if (!url) {
      dispatch(setSelectedEvent(appointmentsData.find((x) => x.id === Number(id))));
      setIsShowModalAddEdit(true);
    }
  };

  const month = useMemo(() => {
    const monthSelected = dateTitle.split(' ')[0];
    const months = {
      January: 'Enero',
      February: 'Febrero',
      March: 'Marzo',
      April: 'Abril',
      May: 'Mayo',
      June: 'Junio',
      July: 'Julio',
      August: 'Agosto',
      September: 'Septiembre',
      October: 'Octubre',
      November: 'Noviembre',
      December: 'Diciembre',
    };
    return `${months[monthSelected]} ${dateTitle.split(' ')[1]}`
    
  }, [dateTitle, formatDate]);

  // handlers that initiate reads/writes via the 'action' props
  // ------------------------------------------------------------------------------------------

  const renderEventContent = (eventInfo) => {
    const { timeText, backgroundColor, borderColor } = eventInfo;
    const { allDay, title } = eventInfo.event;
    if (!allDay) {
      return (
        <>
          <div className="fc-daygrid-event-dot" style={{ backgroundColor, borderColor }} />
          <div className="fc-event-time">{timeText}</div>
          <div className="fc-event-title">{title}</div>
        </>
      );
    }
    return (
      <>
        <div className="fc-event-main-frame">
          <div className="fc-event-title-container">
            <div className="fc-event-title fc-sticky">{title}</div>
          </div>
        </div>
      </>
    );
  };

  const daysOfWeek = useMemo(
    () => ({
      Sun: 'Domingo',
      Mon: 'Lunes',
      Tue: 'Martes',
      Wed: 'Miércoles',
      Thu: 'Jueves',
      Fri: 'Viernes',
      Sat: 'Sábado',
    }),
    []
  );

  return (
    <>
      <HtmlHead title={htmlTitle} description={htmlDescription} />

      {/* Title Start */}
      <div className="page-title-container">
        <Row className="g-0">
          <Col xs="auto" className="mb-2 mb-md-0 me-auto">
            <div className="w-auto sw-md-30">
              <h1 className="mb-0 pb-0 display-4">{htmlTitle}</h1>
            </div>
          </Col>
          <div className="w-100 d-md-none" />
          <Col xs="auto" className="d-flex align-items-start justify-content-end">
            <Button variant="outline-primary" className="btn-icon btn-icon-only ms-1" onClick={onPrevButtonClick}>
              <CsLineIcons icon="chevron-left" />
            </Button>
            <Button variant="outline-primary" className="btn-icon btn-icon-only ms-1" onClick={onNextButtonClick}>
              <CsLineIcons icon="chevron-right" />
            </Button>
          </Col>
          <Col md="auto" className="d-flex align-items-start justify-content-end">
            <Button variant="outline-primary" className="btn-icon btn-icon-start ms-1 w-100 w-md-auto" onClick={onNewEventClick}>
              <CsLineIcons icon="plus" /> <span>{f({ id: 'appointments.addAppointment' })}</span>
            </Button>
          </Col>
        </Row>
      </div>

      {/* Title End */}
      {/* Calendar Title Start */}
      <div className="d-flex justify-content-between">
        <h2 className="small-title">{month}</h2>
        <Dropdown>
          <Dropdown.Toggle as={CustomToggle} id="dropdown-custom-components" />
          <Dropdown.Menu
            className="super-colors shadow dropdown-menu-end"
            popperConfig={{
              modifiers: [
                {
                  name: 'offset',
                  options: {
                    offset: [0, 5],
                  },
                },
                {
                  name: 'computeStyles',
                  options: {
                    gpuAcceleration: false,
                  },
                },
              ],
            }}
          >
            <Dropdown.Item eventKey="dayGridMonth" active={selectedView === 'dayGridMonth'} onClick={() => changeView('dayGridMonth')}>
              {f({ id: 'appointments.month' })}
            </Dropdown.Item>
            <Dropdown.Item eventKey="timeGridWeek" active={selectedView === 'timeGridWeek'} onClick={() => changeView('timeGridWeek')}>
              {f({ id: 'appointments.week' })}
            </Dropdown.Item>
            <Dropdown.Item eventKey="timeGridDay" active={selectedView === 'timeGridDay'} onClick={() => changeView('timeGridDay')}>
              {f({ id: 'appointments.day' })}
            </Dropdown.Item>
            <Dropdown.Divider />
            <Dropdown.Item eventKey="today" onClick={getToday}>
              {f({ id: 'appointments.today' })}
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </div>
      {/* Calendar Title End */}

      <Card body>
        <FullCalendar
          ref={calendarRef}
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin, bootstrapPlugin]}
          headerToolbar={false}
          initialView="dayGridMonth"
          themeSystem="bootstrap"
          editable
          selectable={false}
          selectMirror
          dayMaxEvents
          weekends
          select={handleDateSelect}
          events={appointmentsData}
          eventContent={renderEventContent}
          eventClick={handleEventClick}
          viewDidMount={viewDidMount}
          eventTimeFormat={{
            hour: '2-digit',
            minute: '2-digit',
            meridiem: false,
          }}
          dayHeaderContent={({ date, text }) => {
            return <b>{daysOfWeek[text]}</b>;
          }}
        />
      </Card>
      <AppointmentsModalAddEdit isOpenAddEditModal={isShowModalAddEdit} setIsOpenAddEditModal={setIsShowModalAddEdit} />
    </>
  );
};

export default Citas;

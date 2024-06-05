import CsLineIcons from 'cs-line-icons/CsLineIcons';
import { useGetAllServices } from 'hooks/react-query/useServices';
import moment from 'moment';
import React, { useEffect, useMemo } from 'react';
import { NavLink } from 'react-router-dom';
import { Spinner } from 'react-bootstrap';
import { useIntl } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';
import { setAppointmentServiceInformation, setIsEnd } from 'store/appointments/appointmentsSlice';

export const ThanksTap = () => {
  const dispatch = useDispatch();
  const { appointmentServiceInformation } = useSelector((state) => state.appointments);
  const { service_time, service_date, email } = appointmentServiceInformation;
  const { data, isSuccess: isServicesSuccess } = useGetAllServices();
  const { name, price } = useMemo(
    () => isServicesSuccess && data.services.find(({ service_id }) => service_id === appointmentServiceInformation.service_id),
    [appointmentServiceInformation, isServicesSuccess]
  );

  useEffect(() => {
    dispatch(setIsEnd(true));
  }, []);

  const { formatDate } = useIntl();
  return (
    <div className="d-flex flex-column justify-content-center align-items-center ">
      {!appointmentServiceInformation ? (
        <div className="text-center">
          <Spinner animation="border" variant="primary" />
        </div>
      ) : (
        <div>
          <div className="text-center">
            <NavLink
              to="/"
              onClick={() => {
                dispatch(setAppointmentServiceInformation({}));
              }}
              className="btn btn-icon btn-icon-start btn-primary mb-3 "
            >
              <CsLineIcons icon="arrow-left" /> <span>Volver al inicio</span>
            </NavLink>
            <h1 className="mb-2">¡Tu cita se ha agendado con éxito!</h1>
            <p>
              Hemos enviado la confirmación de tu cita a este correo electrónico: <span className="font-weight-bold text-primary">{email}</span>
            </p>
          </div>

          <div className="border border-primary rounded p-3">
            <h5 className="mb-2">¡Aquí tienes un resumen de tu próximo servicio!</h5>
            <p className="m-0">
              <span className="font-weight-bold text-primary">Servicio seleccionado: </span>
              {name}
            </p>
            <p className="m-0">
              <span className="font-weight-bold text-primary">Fecha: </span>
              {formatDate(moment(service_date, 'YYYY-MM-DD'), { month: 'long', day: 'numeric', year: 'numeric' })}
            </p>
            <p className="m-0">
              <span className="font-weight-bold text-primary">Hora:</span> {moment(service_time, 'HH:mm:ss').format('hh:mm A')}{' '}
            </p>
            <p className="m-0 mb-2">
              <span className="font-weight-bold text-primary">Precio:</span>{' '}
              {parseFloat(price).toLocaleString('es-CR', {
                style: 'currency',
                currency: 'CRC',
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
              })}
            </p>
            <p className="m-0">*El precio final está sujeto a cambios debido a posibles extras o variaciones en el servicio final. </p>
          </div>
        </div>
      )}
    </div>
  );
};

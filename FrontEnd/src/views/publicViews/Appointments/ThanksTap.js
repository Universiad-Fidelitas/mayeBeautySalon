import { useGetAllServices } from 'hooks/react-query/useServices';
import moment from 'moment';
import React, { useMemo } from 'react';
import { Spinner } from 'react-bootstrap';
import { useIntl } from 'react-intl';
import { useSelector } from 'react-redux';

export const ThanksTap = () => {
  const { appointmentServiceInformation } = useSelector((state) => state.appointments);
  const { service_time, service_date, email } = appointmentServiceInformation;
  const { data, isSuccess: isServicesSuccess } = useGetAllServices();
  const { name, price } = useMemo(() =>  isServicesSuccess && data.services.find(({service_id}) => service_id === appointmentServiceInformation.service_id), [appointmentServiceInformation, isServicesSuccess])

  const { formatDate } = useIntl();
  return (
    <div className="d-flex flex-column justify-content-center align-items-center mt-5">
      {!appointmentServiceInformation ? (
        <div className="text-center">
          <Spinner animation="border" variant="primary" />
        </div>
      ) : (
        <div>
          <div className="text-center">
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

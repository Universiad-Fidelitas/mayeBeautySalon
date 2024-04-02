import moment from 'moment';
import React from 'react';
import { Spinner } from 'react-bootstrap';
import { useIntl } from 'react-intl';

export const ThanksTap = ({ savingData }) => {
  const { date, start_time, price, email, serviceName, isLoaded } = savingData;

  const { formatDate } = useIntl();
  return (
    <div className="d-flex flex-column justify-content-center align-items-center mt-5">
      {!isLoaded ? (
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
              {serviceName}
            </p>
            <p className="m-0">
              <span className="font-weight-bold text-primary">Fecha: </span>
              {formatDate(moment(date, 'YYYY-MM-DD'), { month: 'long', day: 'numeric', year: 'numeric' })}
            </p>
            <p className="m-0">
              <span className="font-weight-bold text-primary">Hora:</span> {moment(start_time, 'HH:mm:ss').format('hh:mmA')}{' '}
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

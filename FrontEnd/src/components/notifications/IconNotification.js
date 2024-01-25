import CsLineIcons from 'cs-line-icons/CsLineIcons'
import React from 'react'

export const IconNotification = ({ title, description, toastType }) => {
  return (
    <>
        <div className="mb-2">
        <CsLineIcons icon="notification" width="20" height="20" className={`cs-icon icon text-${toastType} me-3 align-middle`} />
        <span className={`align-middle text-${toastType} heading font-heading`}>{ title }</span>
        </div>
        <div className="text-muted mb-2">{ description }</div>
    </>
  )
}

import React, { useRef } from 'react'
import _ from 'lodash'
import { Label } from 'reactstrap'

import ERPIcon from 'components/Icon'
import ERPButton from 'components/Button'

const FileList = ({
  value, // [], {}
  containerClass,
  fileContainerClass,
  fileContainerStyle,
  multiple,
  onClickPreview,
  fileNameKey,
  fileSizeKey,
  fileTypeKey
}) => {

  let filepond = useRef(null)

  const renderFileIcon = (type) => {
    if (type?.includes('image')) {
      return <ERPIcon featherIcon='FiImage' />
    } else {
      return <ERPIcon featherIcon='FiFile' />
    }
  }

  const renderFile = (item, index) => (
    <div key={index} className='d-flex align-items-center'>
      <div className='custom-uploaded-file preview'>
        <div className={`custom-uploaded-file__icon ${onClickPreview ? 'cursor-pointer' : ''}`}
          onClick={() => onClickPreview ? onClickPreview(item) : {}}>
          {renderFileIcon(fileTypeKey ? item[fileTypeKey] : item.type)}
        </div>
        <div className='d-flex flex-column'>
          <h2>{fileNameKey ? item[fileNameKey] : item.name}</h2>
          <span>{Number(fileSizeKey ? item[fileSizeKey] : item.size) / 1000} KB</span>
        </div>
        <ERPButton
          color={"borderless"}
          customStyle={{ borderRadius: '50%', zIndex: 999, marginLeft: 'auto' }}
          onClick={() => {
            onClickPreview(item)
          }}>
          <ERPIcon featherIcon={"FiEye"} />
        </ERPButton>
      </div>
    </div>
  )

  return (
    <div className={`custom-file-upload ${containerClass || ''}`}>
      {(_.isArray(value) && value.length > 0) && (
        <div
          className={`d-flex flex-wrap g-2 ${fileContainerClass || ''}`}
          style={{ ...fileContainerStyle }}
        >
          {value.map((item, index) => renderFile(item, index))}
        </div>
      )}
      {(!_.isArray(value) && value.name) && (
        <div className={`d-flex flex-wrap g-2`}>
          {renderFile(value, 0)}
        </div>
      )}
    </div>
  )
}

export default FileList
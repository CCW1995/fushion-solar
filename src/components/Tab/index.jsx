import React from 'react'

import './index.scss'

const Tab = ({
  containerClass,
  containerStyle,
  tabSections, // [{label: "Quotation",value: this.props.quotation}]
  selectedSection,

  onChangeSection
}) => {

  return (
    <div className={ `custom-tabs ${ containerClass || '' }` } style={ containerStyle || {}}>
      {
        tabSections.map((tabSection, index) => (
          <div
            key={ index }
            onClick={ () => onChangeSection(tabSection.label) }
            className={ `custom-tab-section ${ tabSection.label === selectedSection ? 'custom-tab-selected' : '' }` }>
            { tabSection.label }
            {
              tabSection.value && (
                <div className="custom-tab-section-value">
                  { tabSection.value }
                </div>
              )
            }
          </div>
        ))
      }
    </div>
  )
}

export default Tab
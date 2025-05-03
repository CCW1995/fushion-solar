import React from 'react'
import _ from 'lodash'

import './Summary.scss'

const ERPSummaryTable = props => {
  let {
    style,
    className,
    rowStyle,
    rowClassName,
    totalStyle,
    totalClassName,
    
    data,
    showTotal,
    totalText
  } = props

  return(
    <table 
      style={ style }
      className={ `summary-table ${ className || '' }` }>
      {
        data?.map( row => (
          <tr
            style={ rowStyle }
            className={ rowClassName || '' }>
            <th>{ row.title }</th>
            <td>{ row.toFixed ? row.value.toFixed( row.toFixed ) : row.value }</td>
          </tr>
        ))
      }
      {
        data?.length > 0 && showTotal && (
          <tr
            style={ totalStyle || rowStyle }
            className={ `total-row ${ totalClassName || rowClassName || '' }`}>
            <th>{ totalText || "Total" }</th>
            <td>{ _.sumBy( data, "value" ).toFixed( 2 ) }</td>
          </tr>
        )
      }
    </table>
  )
}

export default ERPSummaryTable

{/*
Documentation(Summary Table)
  -style: [OBJ] style of table || optional || eg: { fontSize: "18px" }
  -className: [STR] className of table || optional || eg: "table"
  -rowStyle: [OBJ] style of row || optional || eg: { fontSize: "18px" }
  -rowClassName: [STR] className of row || optional || eg: "table"
  -totalStyle: [OBJ] style of last total row || optional, if undefined and rowStyle is defined, rowStyle will be applied || eg: { fontSize: "18px" }
  -totalClassName: [STR] className of last total row || optional, if undefined and rowClassName is defined, rowClassName will be applied || eg: "table"
  
  -data: [OBJ] row and values that is needed || compulsory
    -title: [STR] title text of the row || eg: "Total Gross Amt"
    -value: [INT|STR] value of the row || eg: 1 or "Hello Word"
    -toFixed: [INT] number of decimal places || dont use it on string value || eg: 1
  -showTotal: [BOOL] show last total row || default to false || eg: true
  -totalText: [STR] string text of the last row || optional || eg: "Total"
*/}
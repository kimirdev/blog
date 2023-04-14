import { Spin } from 'antd'
import React from 'react'

import './loader.scss'

function Loader() {
  return (
    <div className="loader">
      <Spin size="large" />
    </div>
  )
}

export default Loader

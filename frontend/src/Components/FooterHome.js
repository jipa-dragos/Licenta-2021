import React from 'react'
import { Layout } from 'antd'
const { Footer } = Layout

function FooterHome() {
  return (
    <Layout>
      <Footer
        style={{
          textAlign: 'center',
          backgroundColor: '#242424',
          color: '#fff',
        }}
      >
        ASE QUIZ @ 2021
      </Footer>
    </Layout>
  )
}

export default FooterHome

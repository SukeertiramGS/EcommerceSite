import { useState } from 'react'
import ProductDetail from './components/product/ProductDetail'

import './App.css'
import Header from './components/layouts/Header';
import Footer from './components/layouts/Footer';
import Home from './components/Home';
import {Route, BrowserRouter as Router, Routes} from 'react-router-dom';
import {HelmetProvider} from 'react-helmet-async';
import {ToastContainer} from 'react-toastify';
import ProductSearch from './components/product/ProductSearch';

function App() {
  const [count, setCount] = useState(0)

  return (
    <Router>
    <div className='App'>
      <HelmetProvider>
          <Header/>
          <div className ="container container-fluid">
              <ToastContainer theme="dark"/>
                  <Routes>
                    <Route path='/' element={<Home/>} />
                    <Route path='/search/:keyword?' element={<ProductSearch/>} />
                    <Route path='/product/:id' element={<ProductDetail/>} />
                  </Routes>
          </div>
          <Footer/>
      </HelmetProvider>
    </div>
    </Router>
  )
}

export default App

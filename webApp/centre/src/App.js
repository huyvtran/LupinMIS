import React    from 'react';
import axios    from 'axios';
import Layout   from './coreAdmin/Layout/Layout.js';
import 'bootstrap/dist/css/bootstrap.min.css';

import './App.css';

// axios.defaults.baseURL = "http://uatlmisapi.iassureit.com/";
axios.defaults.baseURL = "http://qalmisapi.iassureit.com/";
// axios.defaults.baseURL = "http://localhost:3054/";
axios.defaults.headers.post['Content-Type'] = 'application/json';

function App() {
  return (
    <div>
      <Layout />
    </div>
    
    );
}

export default App;

 

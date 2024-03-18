import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import App from './Web/App';
import ArticleDetails from './Web/ArticleDetails';
import Search from './Web/search';
import { ChakraProvider } from '@chakra-ui/react';
import NotFoundPage from './Web/notFoundPage'

ReactDOM.render(
  <ChakraProvider>
    <Router>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/article/:id" element={<ArticleDetails />} />
        <Route path="/search" element={<Search />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Router>
  </ChakraProvider>,
  document.getElementById('root')
);

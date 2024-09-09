// App.js
import React from 'react';
import { Routes, Route} from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import PhotoList from './components/PhotoList';
import PhotoDetails from './components/PhotoDetails';
import './css/custom.css';
import PaginatedQueriesPage from './modules/pagination'
import CreatePhoto from './components/CreatePhoto';
import DeletePhoto from './components/DeletePhoto';
import UpdatePhoto from './components/EditPhoto';
import { BsDash } from 'react-icons/bs';
import Dashboard from './components/Dashboard';
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      refetchOnmount: false,
      refetchOnReconnect: false,
      retry: 1,
      staleTime: 1000 * 600000 * 100000,
    },
  },
});


const App = () => {
  return (<> 
    <QueryClientProvider client={queryClient}>
      <Routes>
      <Route path="/photos/update/:id" element={<UpdatePhoto/>} />
      <Route path="/photos/delete/:id" element={<DeletePhoto/>} />
      <Route path="/photos/page" element={<PaginatedQueriesPage/>} />
      <Route path="/" element={<Dashboard/>} />

          <Route path="/photos" element={<PhotoList/>} />
          <Route path="/photos/create" exact element={<CreatePhoto/>} />
      </Routes>
    </QueryClientProvider>
  </>);
};

export default App;
 
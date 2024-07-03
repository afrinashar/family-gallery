import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import {
  useQuery,
  useMutation,
  useQueryClient,
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'
const queryClient = new QueryClient()
import { BrowserRouter } from 'react-router-dom';

ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
<QueryClientProvider client={queryClient}>
<App />
 
      <ReactQueryDevtools   />
    </QueryClientProvider>
    </BrowserRouter>,
)

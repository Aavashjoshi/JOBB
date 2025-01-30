import { Provider } from 'react-redux';
import store from './redux/store';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Navbar from './components/shared/Navbar';
import Signup from './components/auth/Signup';
import Login from './components/auth/Login';
import Home from './components/Home';
import JobDiscription from './components/JobDiscription';
import Jobs from './components/Jobs';
import Browse from './components/Browse';
import Profile from './components/Profile'
import Companies from './components/admin/Companies'
import CompanyCreate from './components/admin/CompanyCreate';
import CompanySetup from './components/admin/CompanySetup'
import AdminJobs from "./components/admin/AdminJobs";

const appRouter = createBrowserRouter([
  { path: '/', element: <Home /> },
  { path: '/login', element: <Login /> },
  { path: '/signup', element: <Signup /> },
  { path: "/jobs", element: <Jobs /> },
  {
    path: "/description/:id",
    element: <JobDiscription />
  },
  { path: "/browse", element: <Browse /> },
  {
    path: "/profile",
    element: <Profile />
  },
   // admin ke liye yha se start hoga
   {
    path:"/admin/companies",
    element:<Companies/>
  },
  {
    path:"/admin/companies/create",
    element: <CompanyCreate/>
  },
  {
    path:"/admin/companies/:id",
    element:<CompanySetup/> 
  },
  {
    path:"/admin/jobs",
    element:<AdminJobs/>
  },
]);


function App() {
  return (
    <Provider store={store}>
      <RouterProvider router={appRouter} />
    </Provider>
  );
}

export default App;

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
]);

function App() {
  return (
    <Provider store={store}>
      <RouterProvider router={appRouter} />
    </Provider>
  );
}

export default App;

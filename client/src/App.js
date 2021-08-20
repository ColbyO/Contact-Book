import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'

//Routing
import PrivateRoute from './components/routing/PrivateRoute';

//Pages
import SearchPage from './components/pages/SearchPage';
import LoginPage from './components/pages/LoginPage';
import RegisterPage from './components/pages/RegisterPage';
import History from './components/pages/History';
import Settings from './components/pages/Settings';
import Bookmarks from './components/pages/Bookmarks';
import InFolder from './components/pages/inFolder';

const App = () => {
  return (
    <Router>
    <div className="App">
      <Switch>
        {/******************* PRIVATE ROUTES *******************/}
        <PrivateRoute exact path="/" component={SearchPage} />
        <PrivateRoute exact path="/history" component={History} />
        <PrivateRoute exact path="/settings" component={Settings} />
        <PrivateRoute exact path="/bookmarks" component={Bookmarks} />
        <PrivateRoute path="/bookmarks/:folderid" component={InFolder} />
        
        {/******************* ROUTES *******************/}
        <Route exact path="/login" component={LoginPage} />
        <Route exact path="/register" component={RegisterPage} />
      </Switch>
    </div>
    </Router>
  );
}

export default App;

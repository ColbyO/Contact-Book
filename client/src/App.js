import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'

//Routing
import PrivateRoute from './components/routing/PrivateRoute';

//Pages
import SearchPage from './components/pages/SearchPage';
import LoginPage from './components/pages/LoginPage';
import RegisterPage from './components/pages/RegisterPage';

const App = () => {
  return (
    <Router>
    <div className="App">
      <Switch>
        <PrivateRoute exact path="/" component={SearchPage} />
        <Route exact path="/login" component={LoginPage} />
        <Route exact path="/register" component={RegisterPage} />
      </Switch>
    </div>
    </Router>
  );
}

export default App;

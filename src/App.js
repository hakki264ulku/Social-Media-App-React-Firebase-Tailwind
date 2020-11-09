import './App.css';
import 'twin.macro'
import {
  BrowserRouter,
  Route
} from 'react-router-dom'
import HomePage from './components/HomePage';
import Login from './components/Login';
import SignUp from './components/SignUp';
import PostPage from './components/PostPage';

function App() {
  return (
    <BrowserRouter>
      <Route exact path='/' component={HomePage}/>
      <Route exact path='/login' component={Login}/>
      <Route exact path='/signUp' component={SignUp}/>
      <Route path='/post/:id' component={PostPage}/>
    </BrowserRouter>
  );
}

export default App;

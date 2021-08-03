import logo from './logo.svg';
import './App.css';
import Amplify from 'aws-amplify';
import Map from './Map';
import awsconfig from './aws-exports';
import { withAuthenticator, AmplifySignOut } from '@aws-amplify/ui-react';
Amplify.configure(awsconfig);

function App() {
  return (
    <div className="App">
      <div className="App-header">
        <AmplifySignOut />
        <Map className="Map" />
      </div>
    </div>
  );
}

export default withAuthenticator(App);
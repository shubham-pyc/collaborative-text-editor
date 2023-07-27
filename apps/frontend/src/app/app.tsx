// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { useEffect, useState } from 'react';
import styles from './app.module.css';
import { callHello } from '../api';
import SignUp from './pages/singup';
import NxWelcome from './nx-welcome';

export function App() {
  const [loading, setLoading] = useState('something');
  // useEffect(() => {
  //   setLoading('sdfsdf');
  //   const fetchData = async () => {
  //     let x = await callHello();
  //     console.warn(x.data.message);
  //     setLoading(x.data.message);
  //   };

  //   fetchData();
  // }, []);

  return (
    <SignUp></SignUp>
    // <div>
  );
}

export default App;

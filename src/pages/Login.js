import { useState } from 'react';
import styles from '../styles/login.module.css';
import { toast } from "react-toastify";
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks';
 
const Login = () => {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loggingIn, setLoggingIn] = useState(false);
  const auth = useAuth();
  console.log(auth);

  const handeleSubmit = async (e) => {
    e.preventDefault();

    setLoggingIn(true);

    if(!email || !password) {
      toast.error('please.... Enter both email and password correctly')
    }

    const res = await auth.login(email, password);

    if(res.success) {
      toast.success('Successfully Logged in')
    }

    else {
      toast.error(res.message)
    }

    setLoggingIn(false);
  };

  // function handleSubmit(e) {
  //   e.preventDefault();

  //   toast.success("successfull message", {
  //     position: "top-bottom",
  //     autoClose: 3000,
  //     hideProgressBar: false,
  //     closeOnClick: true,
  //     pauseOnHover: true,
  //     draggable: true,
  //     progress: undefined,
  //     theme: "dark",
  //     });
  //   toast.error("error");
  //   toast.warning("toasy");
  //   toast("toast");

  // }
  if(auth.user) {
    return < Navigate  to='/'/>
  }

  return (
    <form className={styles.loginForm} onSubmit={handeleSubmit}>
      <span className={styles.loginSignupHeader}>Log In</span>

      <div className={styles.field}>
        <input type="email" placeholder="Email"  value={email} onChange={(e) => setEmail(e.target.value)} />
      </div>

      <div className={styles.field}>
        <input type="password" placeholder="Paasword"  value={password} onChange={(e) => setPassword(e.target.value)}  />
      </div>

      <div className={styles.field} >
        <button disabled={loggingIn}>
          {loggingIn ? 'Logging in....' : 'Log In'}
        </button>
      </div>
    </form>
  );
};

export default Login;

import { useRef, useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { setCredentials } from './authSlice'
import { useLoginMutation } from './authApiSlice'
import usePersist from '../../hooks/usePersist'
import useTitle from '../../hooks/useTitle'
import PulseLoader from 'react-spinners/PulseLoader'
import "../../assets/css/bootstrap.min.css";
import "../../assets/css/responsive.css";
import "../../assets/css/perfect-scrollbar.css";
import "../../assets/css/custom.css";
import * as images from "../../assets/images/index";

const Login = () => {
    useTitle('Employee Login')

    const userRef = useRef()
    const errRef = useRef()
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [errMsg, setErrMsg] = useState('')
    const [persist, setPersist] = usePersist()

    const navigate = useNavigate()
    const dispatch = useDispatch()

    const [login, { isLoading }] = useLoginMutation()

    useEffect(() => {
        userRef.current.focus()
    }, [])

    useEffect(() => {
        setErrMsg('');
    }, [username, password])


    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            const { accessToken } = await login({ username, password }).unwrap()
            dispatch(setCredentials({ accessToken }))
            setUsername('')
            setPassword('')
            navigate('/dash')
        } catch (err) {
            if (!err.status) {
                setErrMsg('No Server Response');
            } else if (err.status === 400) {
                setErrMsg('Missing Username or Password');
            } else if (err.status === 401) {
                setErrMsg('Unauthorized');
            } else {
                setErrMsg(err.data?.message);
            }
            errRef.current.focus();
        }
    }

    const handleUserInput = (e) => setUsername(e.target.value)
    const handlePwdInput = (e) => setPassword(e.target.value)
    const handleToggle = () => setPersist(prev => !prev)

    const errClass = errMsg ? "errmsg" : "offscreen"

    if (isLoading) return <PulseLoader color={"#FFF"} />

    const content = (
      <div className="full_container">
      <div className="container">
        <div className="center verticle_center full_height">
          <div className="login_section">
            <div className="logo_login">
              <div className="center">
                <img width={210} src={images.logo} alt="#" />
              </div>
            </div>
            <div className="login_form">
              <form onSubmit={handleSubmit}>
                <fieldset>
                  <div className="field">
                    <label className="label_field" htmlFor="username">
                      Username
                    </label>
                    <input
                      type="text"
                      id="username"
                      ref={userRef}
                      value={username}
                      onChange={handleUserInput}
                      autoComplete="off"
                      required
                      placeholder="Username"
                    />
                  </div>
                  <div className="field">
                    <label htmlFor="password" className="label_field">
                      Password
                    </label>
                    <input
                      type="password"
                      id="password"
                      onChange={handlePwdInput}
                      value={password}
                      required
                      placeholder="Password"
                    />
                  </div>
                  <div className="field">
                    <label className="label_field hidden">hidden label</label>
                    <label htmlFor="persist" className="form-check-label">
                      <input
                        type="checkbox"
                        id="persist"
                        onChange={handleToggle}
                        checked={persist}
                        className="form-check-input"
                      />{" "}
                      Remember Me
                    </label>
                    {/* <a className="forgot" href>Forgotten Password?</a> */}
                  </div>
                  <div className="field margin_0">
                    <label className="label_field hidden">hidden label</label>
                      <button className="main_bt">Sign In</button>
                  </div>
                </fieldset>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
    )

    return content
}
export default Login
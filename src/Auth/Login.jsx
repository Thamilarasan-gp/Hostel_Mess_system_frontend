"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import styles from "./Login.module.css"
import { API_BASE_URL } from "../apiurl"
import studentImage from "../assets/boys.jpg"
import wardenImage from "../assets/About.png"
import messImage from "../assets/mess_login_man.jpg"

const Login = ({ userType = "student" }) => {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState(userType)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    roll_number: "",
    name: "",
  })
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const [imageLoaded, setImageLoaded] = useState(false)

  // Animation state
  const [animate, setAnimate] = useState(false)

  useEffect(() => {
    setAnimate(true)
    const timer = setTimeout(() => setAnimate(false), 1000)
    return () => clearTimeout(timer)
  }, [activeTab])

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
    setError("")
  }

  const handleTabChange = (tab) => {
    setActiveTab(tab)
    setError("")
    setImageLoaded(false)
  }

  const handleImageLoad = () => {
    setImageLoaded(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      if (activeTab === "student") {
        const response = await fetch(`${API_BASE_URL}/api/auth/student/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            roll_number: formData.roll_number,
            password: formData.password,
          }),
        })

        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.message || "Login failed")
        }

        localStorage.setItem("studentToken", data.token)
        localStorage.setItem(
          "studentInfo",
          JSON.stringify({
            id: data.studentId,
            name: data.name,
            roll_number: data.roll_number,
            block: data.block,
            room_number: data.room_number,
          }),
        )

        navigate("/studentdash")
      } else if (activeTab === "warden") {
        const response = await fetch(`${API_BASE_URL}/api/auth/warden/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: formData.email,
            password: formData.password,
          }),
        })

        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.message || "Login failed")
        }

        localStorage.setItem("wardenToken", data.token)
        localStorage.setItem(
          "wardenInfo",
          JSON.stringify({
            id: data.wardenId,
            name: data.name,
            email: data.email,
            block: data.block,
          }),
        )

        navigate("/wardendash")
      } else if (activeTab === "mess") {
        const response = await fetch(`${API_BASE_URL}/api/mess/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: formData.name,
            password: formData.password,
          }),
        })

        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.message || "Login failed")
        }

        localStorage.setItem("messId", data.mess.id)
        localStorage.setItem("messName", data.mess.name)

        navigate("/messdash")
      }
    } catch (error) {
      setError(error.message || "Login failed. Please check your credentials.")
    } finally {
      setLoading(false)
    }
  }

  const navigateToSignup = () => {
    navigate("/wardenSigup")
  }

  const getImageForTab = () => {
    switch (activeTab) {
      case "student":
        return studentImage
      case "warden":
        return wardenImage
      case "mess":
        return messImage
      default:
        return studentImage
    }
  }

  const getCaptionForTab = () => {
    switch (activeTab) {
      case "student":
        return {
          title: "Student Portal",
          subtitle: "Access your hostel services and manage your stay",
         
        }
      case "warden":
        return {
          title: "Warden Dashboard",
          subtitle: "Manage hostel operations efficiently",
          
        }
      case "mess":
        return {
          title: "Mess Management",
          subtitle: "Streamline your mess operations",
         
        }
      default:
        return {
          title: "Welcome",
          subtitle: "Login to access your account",
          features: [],
        }
    }
  }

  const caption = getCaptionForTab()

  return (
    <div className={styles.loginContainer}>
      <div className={styles.loginCard}>
        <div className={styles.formSide}>
          <div className={styles.decorativeCircle1}></div>
          <div className={styles.decorativeCircle2}></div>
          <div className={styles.decorativeCircle3}></div>

          <div className={styles.formContent}>
            <div className={styles.logoContainer}>
              <div className={styles.logo}>MessMate</div>
              <div className={styles.liveDemo}>DEMO</div>
            </div>

            <h1 className={`${styles.formTitle} ${animate ? styles.titleAnimation : ""}`}>
              {activeTab === "mess" ? "Mess Login" : `${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Login`}
            </h1>
            {activeTab === "mess" && <p className={styles.formSubtitle}>Log in to your mess account</p>}

            <div className={styles.tabSelector}>
              <button
                className={`${styles.tabButton} ${activeTab === "student" ? styles.activeTab : ""}`}
                onClick={() => handleTabChange("student")}
              >
                <span className={styles.tabIcon}></span> Student
              </button>
              <button
                className={`${styles.tabButton} ${activeTab === "warden" ? styles.activeTab : ""}`}
                onClick={() => handleTabChange("warden")}
              >
                <span className={styles.tabIcon}></span> Warden
              </button>
              <button
                className={`${styles.tabButton} ${activeTab === "mess" ? styles.activeTab : ""}`}
                onClick={() => handleTabChange("mess")}
              >
                <span className={styles.tabIcon}></span> Mess
              </button>
            </div>

            {error && (
              <div className={styles.errorMessage}>
                <p>{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className={styles.loginForm}>
              {activeTab === "warden" ? (
                <div className={styles.formGroup}>
                  <label htmlFor="email">Email</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter your email"
                    required
                  />
                </div>
              ) : activeTab === "student" ? (
                <div className={styles.formGroup}>
                  <label htmlFor="roll_number">Roll Number</label>
                  <input
                    type="text"
                    id="roll_number"
                    name="roll_number"
                    value={formData.roll_number}
                    onChange={handleChange}
                    placeholder="Enter your roll number"
                    required
                  />
                </div>
              ) : (
                <div className={styles.formGroup}>
                  <label htmlFor="name">Mess Name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter mess name"
                    required
                  />
                </div>
              )}

              <div className={styles.formGroup}>
                <label htmlFor="password">Password</label>
                <div className={styles.passwordContainer}>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    required
                  />
               
                </div>
              </div>

              <div className={styles.formOptions}>
                <div className={styles.rememberMe}>
                  <input
                    type="checkbox"
                    id="remember"
                    checked={rememberMe}
                    onChange={() => setRememberMe(!rememberMe)}
                  />
                  <label htmlFor="remember">Remember me</label>
                </div>
                <a href="/forgot-password" className={styles.forgotPasswordLink}>
                  Forgot password?
                </a>
              </div>

              <button type="submit" className={styles.loginButton} disabled={loading}>
                {loading ? (
                  <span className={styles.spinner}></span>
                ) : (
                  `Login as ${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}`
                )}
              </button>
            </form>

            {activeTab === "warden" && (
              <div className={styles.registerSection}>
                <p>
                  Don't have an account?{" "}
                  <span className={styles.registerLink} onClick={navigateToSignup}>
                    Register now
                  </span>
                </p>
              </div>
            )}

            {activeTab === "student" && (
              <div className={styles.helpText}>
                <p>Forgot your password? Contact your warden.</p>
              </div>
            )}

            {activeTab === "mess" && (
              <div className={styles.registerSection}>
                <p>
              Forgot your password? Contact your warden.
                </p>
              </div>
            )}
          </div>
        </div>

        <div className={`${styles.imageSide} ${imageLoaded ? styles.imageLoaded : ""}`}>
          <img
            src={getImageForTab()}
            alt={`${activeTab} login`}
            className={styles.roleImage}
            onLoad={handleImageLoad}
          />
          <div className={styles.imageOverlay}>
            <h2>{caption.title}</h2>
            <p>{caption.subtitle}</p>
       
            <div className={styles.decorativeShapes}>
              <div className={styles.shape1}></div>
              <div className={styles.shape2}></div>
              <div className={styles.shape3}></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login
import './App.css'
import { Provider } from 'react-redux'
import { store } from './store'
import { AuthProvider } from './context/AuthContext'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import LoginPage from './components/LoginPage'
import ProtectedRoute from './components/ProtectedRoute'
import Header from './components/Header'
import ImageGallery from './components/ImageGallery'

function App() {

  return (
    <Provider store={store}>
      <AuthProvider>
        <Router>
          <div className="min-h-screen flex flex-col">
            <Routes>
              <Route path="/login" element={<LoginPage />} />
              <Route
                path="/gallery"
                element={
                  <ProtectedRoute>
                    <>
                      <Header />
                      <main className="flex-1">
                        <ImageGallery />
                      </main>
                    </>
                  </ProtectedRoute>
                }
              />
              <Route path="/" element={<Navigate to="/gallery" replace />} />
            </Routes>
          </div>
        </Router>
      </AuthProvider>
    </Provider>
  )
}

export default App

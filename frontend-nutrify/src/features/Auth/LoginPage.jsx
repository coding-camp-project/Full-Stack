import AuthLayout from "./sections/AuthLayout"
import LoginForm from "./components/LoginForm"

export default function LoginPage() {
  return (
    <AuthLayout isRegister={false}>
      <LoginForm />
    </AuthLayout>
  )
}

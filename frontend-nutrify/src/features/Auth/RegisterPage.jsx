import AuthLayout from "./sections/AuthLayout"
import RegisterForm from "./components/RegisterForm"

export default function RegisterPage() {
  return (
    <AuthLayout isRegister={true}>
      <RegisterForm />
    </AuthLayout>
  )
}

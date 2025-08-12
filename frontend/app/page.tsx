import Movies from './sections/movies'
import Casts from './sections/casts'
import UserInfo from './components/UserInfo'

export default function HomePage() {
  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">
        Welcome to Microservice App
      </h1>
      
      {/* User Information Row */}
      <div className="mb-8">
        <UserInfo />
      </div>
      
      {/* Movies and Casts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Movies />
        <Casts />
      </div>
    </div>
  )
}
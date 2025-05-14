import { cookies } from 'next/headers'
import Navbar from './Navbar'
 
export default async function NavbarServer() {
  const cookieStore = await cookies()
  const token = cookieStore.get('token')
  console.log("in the navbar server",token);
  return <Navbar isLoggedIn={!!token} token={JSON.stringify(token)}/>
}
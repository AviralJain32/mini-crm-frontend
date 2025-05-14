import { cookies } from 'next/headers'
import Navbar from './Navbar'
 
export default async function NavbarServer() {
  const cookieStore = await cookies()
  const token = cookieStore.get('token')
  const token1 = cookieStore.get('token1')
  console.log("in the navbar server",token);
  console.log("in the navbar server",token1);
  return <Navbar isLoggedIn={!!token1} token={JSON.stringify(token1)}/>
}
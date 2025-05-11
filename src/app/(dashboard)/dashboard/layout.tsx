import NavbarServer from "@/components/NavbarServer"

 
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
      <main>
        <NavbarServer/>
        {children}
      </main>
  )
}
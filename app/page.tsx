import { AuroraProvider } from "@/lib/aurora/store"
import { AppShell } from "@/components/aurora/app-shell"

export default function Page() {
  return (
    <AuroraProvider>
      <AppShell />
    </AuroraProvider>
  )
}

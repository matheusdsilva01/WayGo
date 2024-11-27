import { FormEstimateRide } from "@/components/ui"

const Home = () => {
  return (
    <div className="flex h-full w-full">
      <div className="m-auto mt-8 w-full max-w-lg rounded-md border border-zinc-500 bg-zinc-950 p-6 shadow">
        <h1 className="text-xl font-bold text-primary">Pedir uma viagem</h1>
        <FormEstimateRide />
      </div>
    </div>
  )
}

export default Home

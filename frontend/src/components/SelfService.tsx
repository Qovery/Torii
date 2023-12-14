import EmptyState from "@/components/EmptyState.tsx";

interface Props {
  catalogSlug: string
  services: any[]
}

export default function SelfService({catalogSlug, services}: Props) {

  if (services.length === 0) {
    return <EmptyState text="No Services" subText="This catalog has no services."/>
  }

  return <>
    <h1>{catalogSlug}</h1>
    {
      services.map((service) => {
        return <p key={service.name}>{service.name} {service.description}</p>
      })
    }
  </>
}

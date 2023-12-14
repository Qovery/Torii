interface Props {
  catalogSlug: string
}

export default function SelfService({catalogSlug}: Props) {
  return (
    <p id="zero-state">
      Select a catalog to get started {catalogSlug}.
    </p>
  )
}

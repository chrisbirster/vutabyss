export const DeckInfo = (props: { name: string, numberOfCards: number, lastStudied: string }) => {
  return (
    <div>
      <strong>{props.name}</strong>
      <p style="color: gray;">Last Studied {props.lastStudied}</p>
      <p>{props.numberOfCards} cards</p>
    </div>
  )
}

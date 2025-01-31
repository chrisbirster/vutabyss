import { useParams } from "@solidjs/router";
import { ParentProps } from "solid-js";

export default function NotFound(props: ParentProps) {
  const params = useParams();
  return (
    <div>
      <h1>Voidabyss</h1>
      <p>Error retrieving route</p>
      <p>{JSON.stringify(params)}</p>
      <p>{JSON.stringify(props)}</p>
    </div>
  );
}

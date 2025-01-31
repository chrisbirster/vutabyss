import { createResource, Show } from "solid-js";
import { getTemplateByID } from "@/api";
import { CardTemplate } from "@/types";
import { useParams } from "@solidjs/router";

type ResourceData = { template: CardTemplate };

export default function TemplateDetails() {
  const params = useParams();
  const [data] = createResource<ResourceData, string>(() => params.templateID, getTemplateByID);

  return (
    <Show when={!data.loading} fallback={<p>Loading template data...</p>}>
      {JSON.stringify(data())}
    </Show>
  );
};

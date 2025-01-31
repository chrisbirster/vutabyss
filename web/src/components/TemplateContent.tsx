import { createResource, Show } from "solid-js";
import { getTemplates } from "@/api";
import { CardTemplate } from "@/types";
import { TemplatesSection } from "./TemplatesSection";
import { css } from "@linaria/core";
import { A } from "@solidjs/router";

const header = css`
  display: flex;
  justify-content: flex-end; 
  margin-bottom: 20px;
`;

const button = css`
  padding: 10px 20px;
  background-color: #111827;
  color: #ffffff;
  border: none;
  border-radius: 8px;
  text-decoration: none;
  cursor: pointer;
  font-size: 1em;
  transition: background-color 0.2s ease, transform 0.2s ease;

  &:hover {
    background-color: #374151;
    transform: translateY(-2px);
  }

  &:active {
    background-color: #4b5563;
    transform: translateY(0);
  }

  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

type ResourceData = { templates: CardTemplate[] };

export const TemplateContent = () => {
  const [data] = createResource<ResourceData>(getTemplates);

  return (
    <Show when={!data.loading} fallback={<p>Loading template data...</p>}>
      <div class={header}>
        <A class={button} href="/app/templates/new">
          New Template
        </A>
      </div>
      <TemplatesSection
        templates={data()?.templates || []}
      />
    </Show>
  );
};

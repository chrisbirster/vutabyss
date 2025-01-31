import { CardTemplate } from "@/types";
import { css } from "@linaria/core";
import { A } from "@solidjs/router";

const container = css`
  padding: 20px;
  font-family: Arial, sans-serif;
  background-color: #111827;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const templateList = css`
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 100%;
  max-width: 800px;
`;

const templateItem = css`
  background: #1f2937;
  color: white;
  padding: 16px;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  transition: background 0.3s ease;
  cursor: pointer;

  &:hover {
    background: #374151;
  }
`;

const title = css`
  font-size: 18px;
  font-weight: bold;
  margin-top: 5px;
`;

export const TemplatesSection = (props: { templates: CardTemplate[] }) => {
  return (
    <div class={container}>
      <div class={templateList}>
        {props.templates.map((tpl) => (
          <A href={`/app/templates/${tpl.id}`}>
            <div class={templateItem}>
              <p class={title}>{tpl.template_name}</p>
            </div>
          </A>
        ))}
      </div>
    </div >
  );
}

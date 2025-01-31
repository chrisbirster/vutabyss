import { css } from "@linaria/core";
import { DashboardSearch } from "@/components/DashboardSearch";
import { TemplateContent } from "@/components/TemplateContent";

const container = css`
  padding: 24px;
  background-color: #f5f5f5;
  min-height: 100vh;
`;

const pageTitle = css`
  font-size: 22px;
  font-weight: bold;
  margin-bottom: 16px;
`;

const filterContainer = css`
  display: flex;
  flex-direction: row;
  gap: 16px;
  margin-bottom: 24px;
  width: 100%;
  align-items: center;
`;

export default function Templates() {
  return (
    <div class={container}>
      <h2 class={pageTitle}>Templates</h2>
      <div class={filterContainer}>
        <DashboardSearch />
      </div>
      <TemplateContent />
    </div>
  );
};

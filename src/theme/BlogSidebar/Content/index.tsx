import React, { memo, type ReactNode } from "react";
import { useThemeConfig } from "@docusaurus/theme-common";
import Heading from "@theme/Heading";
import type { Props } from "@theme/BlogSidebar/Content";
import { format } from "date-fns-tz";

function groupBlogSidebarItemsByMonth(items) {
  const map = new Map();
  const phoenixTimeZone = "America/Phoenix"; // The IANA timezone name for Phoenix

  items.forEach((item) => {
    const date = new Date(item.date);
    const monthYear = format(date, "MMMM yyyy", { timeZone: phoenixTimeZone });

    if (!map.has(monthYear)) {
      map.set(monthYear, []);
    }
    map.get(monthYear).push(item);
  });

  return Array.from(map.entries());
}

function BlogSidebarYearGroup({
  year,
  yearGroupHeadingClassName,
  children,
}: {
  year: string;
  yearGroupHeadingClassName?: string;
  children: ReactNode;
}) {
  return (
    <div role="group">
      <Heading as="h3" className={yearGroupHeadingClassName}>
        {year}
      </Heading>
      {children}
    </div>
  );
}

function BlogSidebarContent({
  items,
  yearGroupHeadingClassName,
  ListComponent,
}: Props): ReactNode {
  const themeConfig = useThemeConfig();
  if (themeConfig.blog.sidebar.groupByYear) {
    const itemsByMonth = groupBlogSidebarItemsByMonth(items);
    return (
      <>
        {itemsByMonth.map(([month, monthItems]) => (
          <BlogSidebarYearGroup
            key={month}
            year={month}
            yearGroupHeadingClassName={yearGroupHeadingClassName}
          >
            <ListComponent items={monthItems} />
          </BlogSidebarYearGroup>
        ))}
      </>
    );
  } else {
    return <ListComponent items={items} />;
  }
}

export default memo(BlogSidebarContent);

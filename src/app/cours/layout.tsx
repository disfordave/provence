import CourseList from "@/components/CourseList";
import InteractiveSidebarMenu from "@/components/InteractiveSidebarMenu";
import TableOfContents from "@/components/TableOfContents";

const sidebarStyleClassName = "hidden lg:col-span-1 lg:block";
const sidebarContentStyleClassName =
  "h-screen overflow-y-auto sticky top-0 px-4 py-8 lg:px-6 xl:px-8 pb-8";

export default function CourseLayout({ children }: LayoutProps<"/cours">) {
  return (
    <>
      <div className="lg:grid lg:grid-cols-4">
        <div className={`${sidebarStyleClassName}`}>
          <div className={sidebarContentStyleClassName}>
            <CourseList />
          </div>
        </div>
        {children}
        <div className={`${sidebarStyleClassName}`}>
          <div className={sidebarContentStyleClassName}>
            <TableOfContents />
          </div>
        </div>
      </div>
      <InteractiveSidebarMenu>
        <CourseList />
        <hr className="my-4 border-neutral-500/25" />
        <TableOfContents />
      </InteractiveSidebarMenu>
    </>
  );
}

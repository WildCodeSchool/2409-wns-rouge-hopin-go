import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

type SwitchTabsProps = {
  tabs: Tab[];
  tabParams?: string;
  classContainer?: string;
  proposeRef?: React.RefObject<HTMLButtonElement>;
};

export type Tab = {
  label: string;
  content: JSX.Element;
  path: string;
};

const SwitchTabs = ({ tabs, tabParams, classContainer, proposeRef }: SwitchTabsProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const isMyRidesPage = location.pathname.includes("/my-rides");
  const currentTab = tabs.find((tab) => {
    const lastSegment = tab.path.split("/").pop();
    return lastSegment?.toLowerCase() === tabParams?.toLowerCase();
  });
  const currentTabIndex = currentTab ? tabs.indexOf(currentTab) : 1;
  const [activeTab, setActiveTab] = useState<number>(currentTabIndex);

  // rerender the component if a user clicks on the menu
  useEffect(() => {
    const newIndex = currentTab ? tabs.indexOf(currentTab) : 1;
    setActiveTab(newIndex);
  }, [currentTab, tabs]);

  const handleTabClick = (index: number) => {
    setActiveTab(index);
    navigate(tabs[index].path);
  };

  return (
    <div
      className={`border-textDark shadow-xl md:rounded-xl md:border ${
        !isMyRidesPage && "md:max-w-xl"
      } z-50 h-full w-full overflow-hidden`}
    >
      <div className="flex h-fit w-full">
        {tabs.map((tab, index) => (
          <button
            key={index}
            className={`transition-200 h-11 flex-1 font-semibold ${
              isMyRidesPage
                ? activeTab === index
                  ? "text-primary border-primary bg-white text-xl underline"
                  : "text-primary hover:text-primary bg-gray-100"
                : activeTab === index
                  ? "bg-primary text-white underline"
                  : "text-primary bg-gray-100 hover:bg-gray-50"
            } `}
            onClick={() => handleTabClick(index)}
            ref={index === 1 && proposeRef ? proposeRef : null}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className={`${classContainer} h-full w-full overflow-auto`}>
        {tabs[activeTab].content}
      </div>
    </div>
  );
};

export default SwitchTabs;

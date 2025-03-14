import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

type SwitchTabsProps = {
  tabs: Tab[];
  tabParams?: string;
  path?: string;
};

export type Tab = {
  label: string;
  content: JSX.Element;
  path: string;
};

const SwitchTabs = ({ tabs, tabParams }: SwitchTabsProps) => {
  const navigate = useNavigate();
  const currentTab = tabs.find(
    (tab) => tab.label.toLowerCase() === tabParams?.toLowerCase()
  );
  const currentTabIndex = currentTab ? tabs.indexOf(currentTab) : 1;
  const [activeTab, setActiveTab] = useState(currentTabIndex);

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
    <div className="mx-4 max-w-1xl md:max-w-4xl md:mx-auto border border-textDark rounded-md overflow-hidden">
      <div className="flex ">
        {tabs.map((tab, index) => (
          <button
            key={index}
            className={`flex-1 py-4 font-semibold ${
              activeTab === index
                ? "bg-primary text-textLight"
                : "bg-white text-primary"
            }`}
            onClick={() => handleTabClick(index)}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className="w-full rounded-b-md p-10  bg-primary ">
        {tabs[activeTab].content}
      </div>
    </div>
  );
};

export default SwitchTabs;

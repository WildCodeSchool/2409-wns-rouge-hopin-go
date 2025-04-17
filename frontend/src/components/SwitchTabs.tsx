import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

type SwitchTabsProps = {
  tabs: Tab[];
  tabParams?: string;
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
    <div className="border border-textDark rounded-md z-50">
      <div className="flex ">
        {tabs.map((tab, index) => (
          <button
            key={index}
            className={`flex-1 py-4 font-semibold ${
              activeTab === index
                ? "bg-primary text-textLight"
                : "bg-white text-primary"
            } ${index === 0 ? "rounded-tl-md" : ""} ${
              index === tabs.length - 1 ? "rounded-tr-md" : ""
            }`}
            onClick={() => handleTabClick(index)}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className="w-full rounded-b-md p-5  bg-primary ">
        {tabs[activeTab].content}
      </div>
    </div>
  );
};

export default SwitchTabs;

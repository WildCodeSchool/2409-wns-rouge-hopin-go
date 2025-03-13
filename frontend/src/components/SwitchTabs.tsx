import { useEffect, useState } from "react";
import { Tab } from "../pages/Authentication";

type SwitchTabs = {
  tabs: Tab[];
  tabParams?: string;
};

const SwitchTabs = ({ tabs, tabParams }: SwitchTabs) => {
  const currentTab = tabs.find((tab) => tab.label.toLowerCase() === tabParams);
  const initialIndex = currentTab ? tabs.indexOf(currentTab) : 1;
  const [activeTab, setActiveTab] = useState(initialIndex);

  useEffect(() => {
    const newIndex = currentTab ? tabs.indexOf(currentTab) : 1;
    setActiveTab(newIndex);
  }, [currentTab, tabs]);

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
            onClick={() => setActiveTab(index)}
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

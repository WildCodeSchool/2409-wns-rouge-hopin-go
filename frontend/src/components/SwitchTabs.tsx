import { useState } from "react";
import { Tab } from "../pages/Authentication";

type SwitchTabs = {
  tabs: Tab[];
};

const SwitchTabs = ({ tabs }: SwitchTabs) => {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <div className="w-full max-w-4xl mx-auto border border-green-800 rounded-md overflow-hidden">
      <div className="flex  ">
        {tabs.map((tab, index) => (
          <button
            key={index}
            className={`flex-1 ${
              activeTab === index ? "bg-purple-800 " : "bg-white"
            }`}
            onClick={() => setActiveTab(index)}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className="rounded-b-md p-10  bg-purple-800 ">
        {tabs[activeTab].content}
      </div>
    </div>
  );
};

export default SwitchTabs;

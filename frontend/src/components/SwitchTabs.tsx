import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

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

const SwitchTabs = ({
  tabs,
  tabParams,
  classContainer,
  proposeRef,
}: SwitchTabsProps) => {
  const navigate = useNavigate();
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
    <div className="sm:border border-textDark sm:rounded-xl shadow-xl  h-full w-full overflow-hidden z-50">
      <div className="flex h-fit w-full">
        {tabs.map((tab, index) => (
          <button
            key={index}
            className={`flex-1 py-4 font-semibold transition-200 ${
              activeTab === index
                ? "bg-gray-100 text-primary underline"
                : "bg-gray-200 text-primary/50 hover:text-primary"
            } `}
            onClick={() => handleTabClick(index)}
            ref={index === 1 && proposeRef ? proposeRef : null}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className={`${classContainer} w-full h-full overflow-auto`}>
        {tabs[activeTab].content}
      </div>
    </div>
  );
};

export default SwitchTabs;

import { useEffect, useState } from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import { HistorySearch } from "../components/SearchRide";
import { Clock4 } from 'lucide-react';

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
  const location = useLocation();
  const isMyRidesPage = location.pathname.includes("/my-rides");
  const currentTab = tabs.find((tab) => {
    const lastSegment = tab.path.split("/").pop();
    return lastSegment?.toLowerCase() === tabParams?.toLowerCase();
  });
  const currentTabIndex = currentTab ? tabs.indexOf(currentTab) : 1;
  const [activeTab, setActiveTab] = useState<number>(currentTabIndex);
  const historique = localStorage.getItem("searchHistory");
  console.log("Historique des recherches :", historique);

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
            className={`flex-1 py-4 font-semibold transition-200 ${isMyRidesPage
              ? activeTab === index
                ? "bg-gray-100 text-primary underline"
                : "bg-gray-200 text-primary/50 hover:text-primary"
              : activeTab === index
                ? "bg-primary text-white underline"
                : "bg-gray-200 text-primary/50 hover:text-primary"
              } `}
            onClick={() => handleTabClick(index)}
            ref={index === 1 && proposeRef ? proposeRef : null}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className={`${classContainer} w-full h-full overflow-auto flex flex-col items-center justify-center gap-5 3xl:flex-row`}>
        {tabs[activeTab].content}
        <div className="flex flex-col items-center mt-6 text-lg">
          <h2 className="text-white text-center mt-4">
            Historique des recherches :
          </h2>
          <ul className="flex flex-col justify-center mt-6 gap-3">
            {historique ? (
              JSON.parse(historique).map((search: HistorySearch, index: number) => {
                const params = new URLSearchParams();
                params.append("departure_city", search.departureCity);
                params.append("departure_lat", search.departureCoords.lat.toString());
                params.append("departure_lng", search.departureCoords.long.toString());
                params.append("departure_radius", search.departureRadius.toString());
                params.append("arrival_city", search.arrivalCity);
                params.append("arrival_lat", search.arrivalCoords.lat.toString());
                params.append("arrival_lng", search.arrivalCoords.long.toString());
                params.append("arrival_radius", search.arrivalRadius.toString());
                params.append("departure_at", search.departureAt);
                return (
                  <li key={index} className="text-white hover:text-indigo-300 transition-colors">
                    <Link to={`/ride-results?${params.toString()}`} className="flex">
                      <Clock4 className="inline mr-6" />
                      <p>
                        {search.departureCity} &rarr; {search.arrivalCity}
                        <br />
                        {search.departureAt}
                      </p>
                    </Link>
                  </li>
                )
              })
            ) : (
              <li className="text-white text-center">Aucune recherche effectuée</li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default SwitchTabs;

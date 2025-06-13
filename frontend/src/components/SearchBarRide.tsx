type SearchBarRideProps = {
  departureCity: string;
  setDepartureCity: React.Dispatch<React.SetStateAction<string>>;
  arrivalCity: string;
  setArrivalCity: React.Dispatch<React.SetStateAction<string>>;
  departureAt: string;
  setDepartureAt: React.Dispatch<React.SetStateAction<string>>;
  error: Record<string, string[]>;
  handleSubmit: (e: React.FormEvent) => void;
  formatErrors: (errors: string[]) => string;
};

const SearchBarRide = ({
  departureCity,
  setDepartureCity,
  arrivalCity,
  setArrivalCity,
  departureAt,
  setDepartureAt,
  error,
  handleSubmit,
  formatErrors,
}: SearchBarRideProps) => {
  return (
    <>
      <>
        <form
          id="search-ride-form"
          noValidate
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit(e);
          }}
          className="flex flex-row w-full gap-4"
        >
          {/* Ville de départ */}
          <div>
            <label
              htmlFor="departure-city"
              className="block mb-1 text-sm font-medium text-textLight"
            >
              Départ
            </label>
            <input
              type="text"
              id="departure-city"
              required
              className={`${
                error.firstName?.length
                  ? "border-error border-2 bg-red-50 focus:ring-0 placeholder:text-primary[50%]"
                  : "border-gray-300 bg-gray-50"
              } shadow-sm border textDark text-sm rounded-lg focus:outline-none block w-full p-1.5`}
              placeholder="Paris"
              value={departureCity}
              onChange={(e) => setDepartureCity(e.target.value)}
            />
            {error.departureCity && (
              <p className="text-red-400 text-sm">
                {formatErrors(error.departureCity)}
              </p>
            )}
          </div>
          {/* Ville d'arrivée */}
          <div>
            <label
              htmlFor="arrival-city"
              className="block mb-1 text-sm font-medium text-white "
            >
              Arrivée
            </label>
            <input
              type="text"
              id="arrival-city"
              className={`${
                error.arrivalCity?.length
                  ? "border-error border-2 bg-red-50 focus:ring-0 placeholder:text-primary[50%]"
                  : "border-gray-300 bg-gray-50"
              } shadow-sm border textDark text-sm rounded-lg focus:outline-none block w-full p-1.5`}
              placeholder="Lyon"
              value={arrivalCity}
              onChange={(e) => setArrivalCity(e.target.value)}
            />
            {error.arrivalCity && (
              <p className="text-red-400 text-sm">
                {formatErrors(error.arrivalCity)}
              </p>
            )}
          </div>
          {/* Date de départ */}
          <div>
            <label
              htmlFor="departure-at"
              className="block mb-1 text-sm font-medium text-white"
            >
              Date
            </label>
            <input
              type="date"
              id="departure-at"
              className={`${
                error.departureAt?.length
                  ? "border-error border-2 bg-red-50 focus:ring-0 placeholder:text-primary[50%]"
                  : "border-gray-300 bg-gray-50"
              } shadow-sm border textDark text-sm rounded-lg focus:outline-none block w-full p-1.5 ${
                !departureAt ? "text-gray-400" : "text-black"
              }`}
              value={departureAt}
              onChange={(e) => setDepartureAt(e.target.value)}
            />
            {error.departureAt && (
              <p className="text-red-400 text-sm">
                {formatErrors(error.departureAt)}
              </p>
            )}
          </div>
        </form>
      </>
    </>
  );
};

export default SearchBarRide;

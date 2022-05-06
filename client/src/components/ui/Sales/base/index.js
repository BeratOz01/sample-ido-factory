import React from "react";

// Hooks
import { useWeb3 } from "components/providers";

// Components
import { Audio } from "react-loader-spinner";
import { SaleCard } from "components/ui";

// Icons
import { MdDangerous } from "react-icons/md";

const Sales = () => {
  const [isLoading, setIsLoading] = React.useState(false);
  const [page, setPage] = React.useState(1);
  const [indexes, setIndexes] = React.useState();
  const [isNextPageAvailable, setIsNextPageAvailable] = React.useState(false);

  const { web3, factory } = useWeb3();

  const itemPerPage = 3;

  React.useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      let length = await factory.methods.getSalesLength().call();
      length = parseInt(length);

      if (length > itemPerPage) {
        setIsNextPageAvailable(true);
        setIndexes({
          start: itemPerPage * (page - 1),
          end: itemPerPage * page,
        });
      } else {
        setIndexes({
          start: 0,
          end: length,
        });
      }

      setIsLoading(false);
    }

    if (web3 && factory) fetchData();
  }, [web3, factory, page]);

  return (
    <div>
      <p className="text-center mt-5 poppins fs-2">All Sales</p>
      {isLoading ? (
        <div className="d-flex">
          <Audio
            height="150"
            width="100"
            color="#ffc107"
            ariaLabel="loading"
            wrapperClass="mx-auto mt-4"
          />
        </div>
      ) : (
        <div className="d-flex flex-column gap-3 my-5">
          {indexes?.end - indexes?.start > 0 ? (
            <>
              {Array(indexes?.end - indexes?.start)
                .fill()
                .map((_, idx) => indexes?.start + idx)
                .map((elem) => {
                  return <SaleCard key={elem} index={elem} />;
                })}
            </>
          ) : (
            <div className="d-flex w-100 flex-column justify-content-center">
              <p className="text-center poppins fs-4 mb-1">No Sale Available</p>
              <MdDangerous
                className="mx-auto"
                size={80}
                color="red"
              ></MdDangerous>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Sales;

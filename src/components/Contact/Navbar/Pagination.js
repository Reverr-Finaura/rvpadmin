import style from "../AllComponents/style.module.css";

function Pagination({ data, currentPage, totalPages, setPage }) {
  return (
    <div className={style.bottomTable}>
      <div className={style.pagecontent}>
        <p>Showing 1 to 10 of {data.length} entries</p>
      </div>
      <div className={style.pagebutton}>
        {currentPage > 1 && (
          <div
            className={style.pagebtnNext}
            onClick={() => setPage(currentPage - 1)}
          >
            Previous
          </div>
        )}
        {Array.from({ length: totalPages }).map((_, index) => (
          <div
            className={style.pagebtn}
            key={index + 1}
            onClick={() => setPage(index + 1)}
            style={{
              backgroundColor: `${index + 1 === currentPage ? "#1814F3" : ""}`,
              color: `${index + 1 === currentPage ? "#FFF" : ""}`,
            }}
          >
            {index + 1}
          </div>
        ))}
        {currentPage < totalPages && (
          <div
            className={style.pagebtnNext}
            onClick={() => setPage(currentPage + 1)}
          >
            Next
          </div>
        )}
      </div>
    </div>
  );
}

export default Pagination;

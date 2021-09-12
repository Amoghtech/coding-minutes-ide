import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  getCurrentPageNumber,
  getCurrentPageList,
  getNextPageNumber,
  getPreviousPageNumber,
  getTotalPages,
} from '~/store/getters/savelist';
import { fetchSavedCodes } from '~/tasks/savecodelist';
import { setCurrentPage } from '~/store/action/savelist';
import { getLanguageMap } from '~/store/getters/editor';

const Savelist = (props) => {
  const [query, setQuery] = React.useState('');
  const dispatch = useDispatch();
  const savelist = useSelector(getCurrentPageList());
  const currentPageNumber = useSelector(getCurrentPageNumber());
  const totalPages = useSelector(getTotalPages());
  const previousPage = useSelector(getPreviousPageNumber());
  const nextPage = useSelector(getNextPageNumber());
  const languageMap = useSelector(getLanguageMap());

  fetchSavedCodes(dispatch, currentPageNumber, query);

  function changePageNumber(page) {
    dispatch(setCurrentPage(page));
  }

  return (
    <>
      <div className="saved-list-section">
        <div>
          <div>
            <div className="io-header">Saved Codes</div>
            <div className="row no-gutters justify-content-between align-items-center my-4">
              <div className="input-container flex-1">
                <input
                  value={query}
                  placeholder="Search code by filename"
                  type="text"
                  onChange={(e) => setQuery(e.target.value)}
                  className="transparent-input w-100"
                />
                <div className="input-container__icon">
                  <img src="https://minio.codingminutes.com/assets/search.svg" />
                </div>
              </div>
              <div className="t-align-r width-fit ml-4">
                <button
                  className="savelist-pagination-buttons"
                  disabled={!previousPage}
                  onClick={() => changePageNumber(previousPage)}
                >
                  &lt; Prev
                </button>
                <div>
                  Showing {currentPageNumber} of {totalPages}
                </div>
                <button
                  className="savelist-pagination-buttons"
                  disabled={!nextPage}
                  onClick={() => changePageNumber(nextPage)}
                >
                  Next &gt;
                </button>
              </div>
            </div>
          </div>
        </div>

        <div>
          <table className="w-100">
            <thead>
              <tr>
                <th>Name</th>
                <th>Language</th>
                <th>Last Updated</th>
              </tr>
            </thead>
            <tbody>
              {savelist &&
                savelist.map((code) => (
                  <a href={`http://ide.codingminutes/?id=${code.id}`}>
                    <tr key={code.id}>
                      <td>{code.title}</td>
                      <td>{languageMap[code.lang]?.name}</td>
                      <td>{code.updated_at}</td>
                      {/* <td>
                      <a href={`http://ide.codingminutes/?id=${code.id}`}>View Code</a>
                    </td> */}
                    </tr>
                  </a>
                ))}
              <tr className="row-link-container">
                <td>Some Code</td>
                <td>Python</td>
                <td>Today</td>
                <a href={`http://www.youtube.com`} className="row-link"></a>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default Savelist;

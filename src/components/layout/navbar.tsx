import React from 'react';
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { LanguagePicker } from '~/components/editor/language-picker';
import { getIsLoggedIn, getUser } from '~/store/getters/auth';
import { logoutUser } from '~/store/action/auth';
import { setActiveModal, setActivePanel, toggleOptionsMenu } from '~/store/action/ui';
import { LOGIN_MODAL } from '~/constants/modal';
import {
  getCurrentSource,
  getStdin,
  getSelectedLanguage,
  getFilename,
} from '~/store/getters/editor';
import { clearJwt } from '~/utils/jwt';
import { saveUpdateCode } from '~/tasks/save-update-code';
import { setFilename } from '~/store/action/editor';
import { getActivePanel, isOptionsMenuOpen } from '~/store/getters/ui';
import { IO_PANEL, SAVELIST_PANEL } from '~/constants/panel';

export const Navbar: React.FC = () => {
  const [loading, setLoading] = React.useState(false);
  const dispatch = useDispatch();
  const toggleOverlay = () => dispatch(setActiveModal(LOGIN_MODAL));
  const isLoggedIn = useSelector(getIsLoggedIn());
  const user = useSelector(getUser());
  const currentLanguage = useSelector(getSelectedLanguage());
  const filename = useSelector(getFilename());
  const data = {
    lang: currentLanguage?.id || -1,
    source: useSelector(getCurrentSource()),
    input: useSelector(getStdin()),
    title: filename,
  };
  const isMenuOpen = useSelector(isOptionsMenuOpen());
  const activePanel = useSelector(getActivePanel());

  const history = useHistory();

  function toggleMenu() {
    dispatch(toggleOptionsMenu());
  }

  function changePanel(panel) {
    dispatch(setActivePanel(panel));
  }

  const logout = () => {
    dispatch(logoutUser());
    clearJwt();
  };

  async function saveCode() {
    if (!isLoggedIn) {
      return toggleOverlay();
    }
    setLoading(true);
    const queryParams = new URLSearchParams(window.location.search);
    const id = queryParams.get('id');
    try {
      const response = await saveUpdateCode(data, id);
      if (id != response?.id) {
        return history.push(`/?id=${response.id}`);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  function copyCode() {
    const sourceCode = data.source;
    navigator.clipboard.writeText(sourceCode);
  }

  function changeFilename(event) {
    const value = event?.target?.value;
    dispatch(setFilename(value));
  }

  return (
    <div className="navbar-top">
      <div className="h-inherit">
        <div className="row no-gutters align-items-center justify-content-between py-2 h-inherit">
          <div className="row no-gutters align-items-center">
            <a href="https://codingminutes.com/" target="_blank" className="mr-4">
              <img
                src="https://minio.codingminutes.com/assets/cm-logo-oneline.svg"
                alt="Coding Minutes Logo"
                style={{ height: '20px' }}
              />
            </a>

            <div className="save-button-container navbar-top__option">
              <input type="text" name="save-code-text" onChange={changeFilename} value={filename} />
              <button onClick={saveCode} disabled={loading} style={{ outline: 'none' }}>
                <img
                  src="https://minio.codingminutes.com/assets/save.svg"
                  className="d-lg-none d-block"
                  style={{ height: '25px' }}
                />
                <span className="d-lg-block d-none">
                  {!loading && <>Save</>}
                  {loading && <>Saving</>}
                </span>
              </button>
            </div>

            <a
              className="navbar-top__option"
              href="https://ide.codingminutes.com/"
              rel="noopener"
              target="_blank"
            >
              <img
                src="https://minio.codingminutes.com/assets/new.svg"
                className="d-lg-none d-block"
                style={{ height: '25px' }}
              />
              <span className="d-lg-block d-none">New</span>
            </a>

            <div className="navbar-top__option" onClick={copyCode}>
              <img
                src="https://minio.codingminutes.com/assets/copy_code.svg"
                className="d-lg-none d-block"
                style={{ height: '25px' }}
              />
              <span className="d-lg-block d-none">Copy Code</span>
            </div>
            {/* <div className="navbar-top__option">Share</div> */}
          </div>
          <div className="row no-gutters align-items-center">
            <LanguagePicker />
            {isLoggedIn && (
              <div className="logged-in-user-menu">
                <div
                  className="row no-gutters align-items-center justify-content-between logged-in-user-box"
                  onClick={toggleMenu}
                >
                  <div className="mr-4">
                    Hi, {user.first_name} {user.last_name}
                  </div>
                  <div className="icon">&gt;</div>
                </div>
                {isMenuOpen && (
                  <div className="floating-menu floating-menu--hidden">
                    {activePanel != SAVELIST_PANEL && (
                      <a
                        className="row no-gutters align-items-center mb-3"
                        onClick={() => changePanel(SAVELIST_PANEL)}
                      >
                        <div>Saved Codes</div>
                      </a>
                    )}
                    {activePanel != IO_PANEL && (
                      <a
                        className="row no-gutters align-items-center mb-3"
                        onClick={() => changePanel(IO_PANEL)}
                      >
                        <div>Input/Output</div>
                      </a>
                    )}
                    <button onClick={logout}>Log Out</button>
                  </div>
                )}
              </div>
            )}
            {!isLoggedIn && (
              <button className="button-primary" onClick={toggleOverlay}>
                Login Now
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

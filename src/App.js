import React, { useState, useEffect } from "react";
import Loader from "./Components/Loader";
import Error from "./Components/Error";
import { constants } from "./modules/constants";
import arrowLeft from "./Images/arrow-left.svg";
import arrowRight from "./Images/arrow-right.svg";
import axios from "axios";
import DialogBox from "./Components/DialogBox";

function App() {
  const [isFilesHovered, setIsFilesHovered] = useState(false);
  const [selectedFile, setFileSelected] = useState(null);
  const [isFileSelected, setIsFileSelected] = useState(false);
  const [fileName, setFileName] = useState(null);
  const [totalFiles, setTotalFiles] = useState(0);
  const [isTableVisible, setIsTableVisible] = useState(false);
  const [tableHeaderData, setTableHeaderData] = useState(null);
  const [tableBodyData, setTableBodyData] = useState(null);
  const [isTableDataLoading, setIsTableDataLoading] = useState(false);
  const [hasErrorOccured, setHasErrorOccured] = useState(false);
  const [isChooseFilesVisible, setIsChooseFilesVisible] = useState(false);
  const [error, setError] = useState(null);
  const [isDialogVisible, setIsDialogVisible] = useState(false);
  const [dialogText, setDialogText] = useState(null);

  const setFile = (event) => {
    const files = event.target.files;
    setFileSelected(files);
    setIsFileSelected(true);
    setTotalFiles(files.length);
  };

  const sendData = (e) => {
    e.preventDefault();
    axios.interceptors.request.use(
      function (config) {
        config.headers["Content-Type"] = "application/json";
        return config;
      },
      function (err) {
        return Promise.reject(err);
      }
    );
    const files = Object.keys(selectedFile).map(
      (index, value) => selectedFile[index]
    );

    const bodyFormData = new FormData();
    files.map((file) => bodyFormData.append("file", file));
    // bodyFormData.append("file", files[0]);

    setIsTableDataLoading(true);

    axios({
      method: "POST",
      url: constants.SERVICE_URLS.SHOW_RESULT,
      data: bodyFormData,
    })
      .then((response) => {
        setIsTableDataLoading(false);
        // const headers = Object.keys(response.data).map((data) => data);
        // const body = Object.values(response.data).map((data) => data);
        const dupsuper = Object.keys(response.data).map((data) =>
          Object.keys(data).map((index, value) => response.data[index])
        );

        const headers = Object.keys(dupsuper).map((index, value) =>
          Object.keys(dupsuper[index][0]).map((data) => data)
        );
        const merged = [].concat.apply([], headers);
        // console.log(...new Set(merged));
        // console.log();
        // setTableHeaderData(response.data);
        setTableBodyData(response.data);
      })
      .catch((error) => {
        if (error.response) {
          console.log(error);
          setIsTableDataLoading(false);
          setHasErrorOccured(true);
          setError(error.response.status);
        }
      });
  };

  useEffect(() => {
    if (selectedFile) {
      const slice = selectedFile[0].name.split(".");
      const fileName =
        totalFiles > 1 ? slice[0].slice(0, 3) : slice[0].slice(0, 6);
      const extenstion = slice[1];
      const fullFileName =
        fileName + (fileName > slice[0] ? "... ." : ".") + extenstion;
      setFileName(fullFileName);
    }
  }, [selectedFile, fileName, totalFiles]);
  return hasErrorOccured ? (
    <Error status={error} />
  ) : (
    <div className="homePage">
      {!isTableVisible ? (
        !isChooseFilesVisible ? (
          <div className="homePage__about">
            <p>
              <strong>Welcome</strong>, this application will look into your
              resume and extract some information that it will find useful.
              Click on this arrow to begin...
              <img
                className="homePage__arrows"
                src={arrowRight}
                alt=""
                style={{
                  display: "inline",
                  cursor: "pointer",
                  marginBottom: "-.5rem",
                  marginLeft: ".5rem",
                }}
                height="30px"
                title="Look at the table"
                onClick={() => {
                  setIsChooseFilesVisible(true);
                  setIsFileSelected(true);
                }}
              />
            </p>{" "}
          </div>
        ) : (
          <>
            <div className="homePage__heading">
              <img
                className="homePage__arrows"
                src={arrowLeft}
                alt=""
                height="30px"
                title="Go Back"
                style={{ cursor: "pointer", margin: "0 4rem 4rem 0" }}
                onClick={() => {
                  setIsChooseFilesVisible(false);
                  setIsFileSelected(false);
                }}
              />
              <div className="homePage__heading--div">
                Let's look into your document
              </div>
              {isFileSelected && tableBodyData ? (
                <img
                  className="homePage__arrows"
                  src={arrowRight}
                  alt=""
                  style={{ margin: "0 11rem 4rem 0", cursor: "pointer" }}
                  height="30px"
                  title="Look at the table"
                  onClick={() => {
                    setIsFileSelected(false);
                    setIsTableVisible(true);
                  }}
                />
              ) : null}
            </div>
            <input
              type="file"
              title=" "
              id="files"
              style={{ display: "none" }}
              className="custom-file-input"
              multiple
              accept={"application/pdf"}
              onChange={(e) => setFile(e)}
            />
            <label
              htmlFor="files"
              className="homePage__customFileInput"
              onMouseOver={() => setIsFilesHovered(true)}
              onMouseOut={() => setIsFilesHovered(false)}
              style={
                selectedFile
                  ? {
                      left: "30%",
                    }
                  : null
              }
            >
              <div
                style={
                  isFilesHovered
                    ? {
                        transform: "translateY(-4px)",
                        transition: "all .2s",
                      }
                    : {
                        transition: "all .2s",
                      }
                }
              >
                Choose Files
              </div>
            </label>
          </>
        )
      ) : null}

      {selectedFile && isFileSelected ? (
        <>
          <div className="homePage__selectedFile">
            <div>
              {fileName} {totalFiles > 1 ? `+ ${totalFiles - 1} more` : null}
            </div>
          </div>
          <div className="">
            <div
              className="homePage__sendButton--button"
              onClick={(e) => {
                sendData(e);
                setIsFileSelected(false);
                setIsTableVisible(true);
              }}
            >
              Send
            </div>
          </div>
        </>
      ) : null}
      {isTableDataLoading ? (
        <div className="loaderWrapper">
          <Loader />
        </div>
      ) : isTableVisible ? (
        <>
          {isDialogVisible ? (
            <DialogBox
              text={dialogText}
              setIsDialogVisible={setIsDialogVisible}
            />
          ) : null}
          <div className="homePage__tableContainer">
            <div className="homePage__heading--flex">
              <img
                className="homePage__arrows"
                src={arrowLeft}
                alt=""
                height="40px"
                title="Go Back"
                style={{ cursor: "pointer" }}
                onClick={() => {
                  setIsTableVisible(false);
                  setIsFileSelected(true);
                }}
              />{" "}
              This is what we found
            </div>{" "}
            {/*homePage__heading homePage__heading--margin*/}
            <table className="homePage__tableData">
              <tr>
                <th>Name</th>
                <th>Location</th>
                <th>Email Address</th>
                <th>College Name</th>
                <th>Graduation Year</th>
                <th>Degree</th>
                <th>Companies Worked At</th>
                <th>YEARS OF EXPERIENCE</th>
                <th>Skills</th>
                <th>Designation</th>
              </tr>

              {tableBodyData
                ? Object.values(tableBodyData).map((value) => (
                    <tr>
                      <td>
                        {value.NAME ? (
                          value.NAME.length > 100 ? (
                            <span href="#">
                              {value.NAME.slice(0, 100)}{" "}
                              <a
                                href="#"
                                onClick={() => {
                                  setDialogText(value.NAME);
                                  setIsDialogVisible(true);
                                }}
                                style={{ cursor: "pointer" }}
                              >
                                {" "}
                                ...more
                              </a>
                            </span>
                          ) : (
                            value.NAME
                          )
                        ) : (
                          "NA"
                        )}
                      </td>
                      <td>
                        {value.LOCATION ? (
                          value.LOCATION.length > 100 ? (
                            <span href="#">
                              {value.LOCATION.slice(0, 100)}{" "}
                              <a
                                href="#"
                                onClick={() => {
                                  setDialogText(value.LOCATION);
                                  setIsDialogVisible(true);
                                }}
                                style={{ cursor: "pointer" }}
                              >
                                {" "}
                                ...more
                              </a>
                            </span>
                          ) : (
                            value.LOCATION
                          )
                        ) : (
                          "NA"
                        )}
                      </td>
                      <td>
                        {value["EMAIL ADDRESS"] ? value["EMAIL ADDRESS"] : "NA"}
                      </td>
                      <td>
                        {value["COLLEGE NAME"] ? value["COLLEGE NAME"] : "NA"}
                      </td>
                      <td>
                        {value["GRADUATION YEAR"]
                          ? value["GRADUATION YEAR"]
                          : "NA"}
                      </td>
                      <td>{value.DEGREE ? value.DEGREE : "NA"}</td>
                      <td>
                        {value["COMPANIES WORKED AT"]
                          ? value["COMPANIES WORKED AT"]
                          : "NA"}
                      </td>
                      <td>
                        {value["YEARS OF EXPERIENCE"]
                          ? value["YEARS OF EXPERIENCE"]
                          : "NA"}
                      </td>
                      <td style={{ width: "30%" }}>
                        {value.SKILLS ? (
                          value.SKILLS.length > 100 ? (
                            <span href="#">
                              {value.SKILLS.slice(0, 100)}{" "}
                              <a
                                href="#"
                                onClick={() => {
                                  setDialogText(value.SKILLS);
                                  setIsDialogVisible(true);
                                }}
                                style={{ cursor: "pointer" }}
                              >
                                {" "}
                                ...more
                              </a>
                            </span>
                          ) : (
                            value.SKILLS
                          )
                        ) : (
                          "NA"
                        )}
                      </td>
                      <td>{value.DESIGNATION ? value.DESIGNATION : "NA"}</td>
                    </tr>
                  ))
                : null}
            </table>
          </div>
        </>
      ) : null}
    </div>
  );
}

export default App;

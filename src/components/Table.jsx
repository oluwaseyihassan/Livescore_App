import React, { useEffect, useState } from "react";
import { Link, json, useParams } from "react-router-dom";
import Error from "./Error";
import Loading from "./Loading";
import Standing from "./Standing";

const Table = ({ toggleMode }) => {
  const [table, setTable] = useState([]);
  const [homeTable, setHomeTable] = useState([]);
  const [awayTable, setAwayTable] = useState([]);
  const [mappedTable, setMappedTable] = useState(table);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [topScorers, setTopScorers] = useState([]);
  const [changeTable, setChangeTable] = useState("all");
  const [teamKeys, setTeamKeys] = useState([]);
  const [results, setResults] = useState([]);
  const [leagueFixtures, setLeagueFixtures] = useState([]);
  const [selectFrom, setSelectFrom] = useState(null);
  const [selectTo, setSelectTo] = useState(null);
  const [stageName, setStageName] = useState("Current");

  const { id } = useParams();
  const date = new Date();
  const fromDate = `${date.getFullYear() - 3}-${
    date.getMonth() + 1
  }-${date.getDate()}`;
  const toDate = `${date.getFullYear() + 1}-${
    date.getMonth() + 1
  }-${date.getDate()}`;
  const [from, setFrom] = useState(fromDate);
  const [to, setTo] = useState(toDate);
  const home = () => {
    setChangeTable("home");
    setMappedTable(homeTable);

  };
  const away = () => {
    setChangeTable("away");
    setMappedTable(awayTable);
  };
  const all = () => {
    setChangeTable("all");
    setMappedTable(table);
  };

  const api_key = import.meta.env.VITE_api_key;

  useEffect(() => {
    async function getData() {
      setLoading(true);
      await fetch(
        `https://apiv2.allsportsapi.com/football/?&met=Standings&leagueId=${id}&APIkey=${api_key}`
      )
        .then((res) => res.json())
        .then((json) => {
          setTable(json.result.total);
          setStageName(json.result.total[0].stage_name);
          setTeamKeys(json.result.total.map((k) => k.team_key));
          setMappedTable(json.result.total);
          setHomeTable(json.result.home);
          setAwayTable(json.result.away);
          setError(false);
          setLoading(false);
        })
        .catch((err) => {
          console.log(err);
          setError(true);
          setLoading(false);
        });
    }
    getData();
  }, [id]);
  useEffect(() => {
    async function getData() {
      await fetch(
        `https://apiv2.allsportsapi.com/football/?&met=Topscorers&leagueId=${id}&APIkey=${api_key}`
      )
        .then((res) => res.json())
        .then((scorers) => {
          setTopScorers(scorers.result);
        })
        .catch((err) => {});
    }
    getData();
  }, [id]);
  useEffect(() => {
    async function getData() {
      await fetch(
        `https://apiv2.allsportsapi.com/football/?met=Fixtures&leagueId=${id}&APIkey=${api_key}&from=${from}&to=${to}`
      )
        .then((res) => res.json())
        .then((fix) => {
          setLeagueFixtures(fix.result);
        });
    }
    getData();
  }, [id]);
 

  return (
    <div className="">
      {error && <Error />}
      {loading && <Loading />}
      {table && table.length == 0 && <h3>No data found</h3>}
      <div
        className={`${
          toggleMode ? "text-darkText" : "text-lightText"
        } gap-4 w-full lg:grid grid-cols-3 `}
      >
        <Standing
          table={table}
          changeTable={changeTable}
          mappedTable={mappedTable}
          toggleMode={toggleMode}
          all={all}
          home={home}
          away={away}
          stageName={stageName}
        />

        <div className=" col-span-1 ">
          <div>
            <input
              type="date"
              name=""
              id=""
              onChange={(e) => setSelectFrom(e.target.value)}
              max="06-12-2021"
            />
            <input
              type="date"
              name=""
              id=""
              onChange={(e) => selectTo(e.target.value)}
            />
          </div>
          {topScorers && table.length != 0 && (
            <div className="  h-fit w-full bg-customBg2 divide-y divide-black px-4 sticky top-[80px] ">
              <div className=" text-2xl md:text-[40px] text-center py-2">
                League Top Scorers
              </div>
              <div className=" text-[20px] sm:text-[24px]  flex justify-between p-2">
                <div>Player</div>
                <div>Goals</div>
              </div>
              {
                <div className=" divide-y divide-black sm:text-base text-xs">
                  {topScorers &&
                    topScorers.map((top, index) => (
                      <div
                        className="flex justify-between p-2 py-2"
                        key={index}
                      >
                        <div className="flex items-center gap-2">
                          <div>
                            {index + 1}. {top.player_name}
                          </div>
                          <img
                            src={`https://apiv2.allsportsapi.com/logo/${
                              top.team_key
                            }_${top.team_name
                              .replace(" ", "-")
                              .toLowerCase()}.jpg`}
                            className=" h-5"
                            alt=""
                          />
                        </div>
                        <div>{top.goals}</div>
                      </div>
                    ))}
                </div>
              }
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Table;

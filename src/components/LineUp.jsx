import React, { useRef, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import PlayerStat from "./PlayerStat";
import ClickAwayListener from "react-click-away-listener";

const LineUp = ({
  statToggle,
  lineUp,
  windowWidth,
  toggleMode,
  playerStat,
}) => {
  const [showStatToggle, setShowStatToggle] = useState(false);
  const [clickedPlayer, setClickedPlayer] = useState(null);
  const reff = useRef(null);
  useEffect(() => {
    document.addEventListener("mousedown", (e) => {
      if (!reff.current.contains(e.target)) {
        setShowStatToggle(false);
      }
    });
  }, []);



  const showPlayerStat = (clickedPlayerKey) => {
    if (!showStatToggle) {
      setShowStatToggle(true);
      setClickedPlayer(clickedPlayerKey);
    }
  };
  return (
    <div
      className={`${
        windowWidth < 1024 &&
        (statToggle.includes("Line-Up") ? "block" : "hidden")
      } ${toggleMode ? "text-darkText" : "text-lightText"} `}
    >
      {lineUp.map((l, index) =>
        l.home_team.starting_lineups.length == 0 ? (
          <div>No line up yet</div>
        ) : (
          <div key={index}>
            <div
              className={`${
                toggleMode ? "bg-customBgLight" : "bg-customBg2"
              } text-xl font-bold text-customBg mb-4 p-2 rounded-lg `}
            >
              Line Up
            </div>
            <span>Click on player to see player stat</span>
            <div
              className={`${
                toggleMode ? "bg-customBgLight" : "bg-customBg2"
              } flex justify-between flex-col sm:flex-row lg:animate-zoom animate-swipe p-2 rounded-lg `}
            >
              <div className=" sm:w-[48%] w-full  ">
                <div className="  ">
                  {lineUp &&
                    lineUp.map((coach) =>
                      coach.home_team.coaches.map((coache, index) => (
                        <div key={index} className=" text-base">
                          {coache.coache}
                          <div className=" opacity-60">(coach)</div>
                        </div>
                      ))
                    )}
                  <div className=" hover:">
                    {lineUp &&
                      lineUp.map((lineUp, index) => (
                        <div key={index} className="">
                          <div className=" text-base sm:text-lg font-semibold text-customBg text-center sm:text-left">
                            Home Line-Up
                          </div>
                          {lineUp.home_team.starting_lineups
                            .sort(
                              (a, b) =>
                                parseInt(a.player_position) -
                                parseInt(b.player_position)
                            )
                            .map((startingLineUp, index) => (
                              <div
                                key={index}
                                className="py-2 flex gap-2 px-2 text-xs sm:text-base "
                              >
                                <div
                                  className=" flex gap-4 items-center cursor-pointer rounded-r-full  border border-solid border-gray-700  "
                                  onClick={() =>
                                    showPlayerStat(startingLineUp.player_key)
                                  }
                                >
                                  <div className="  opacity-60  h-7 w-7 flex justify-center items-center rounded-full border-r border-solid border-gray-700">
                                    {startingLineUp.player_number}
                                  </div>
                                  <div className={` pr-4 `}>
                                    {startingLineUp.player}
                                  </div>
                                </div>
                              </div>
                            ))}
                        </div>
                      ))}
                    <div
                      className={`${
                        showStatToggle ? "visible" : "invisible"
                      } fixed bottom-2 right-2 w-full sm:w-[400px] outline outline-blue-600 outline-2`}
                      ref={reff}
                    >
                      {playerStat &&
                        playerStat.map((stat, index) => (
                          <div>
                            {stat.home
                              .filter(
                                (stat) => stat.player_key == clickedPlayer
                              )
                              .map((stat, index) => (
                                <PlayerStat
                                  reff={reff}
                                  stat={stat}
                                  setShowStatToggle={setShowStatToggle}
                                  key={index}
                                />
                              ))}
                          </div>
                        ))}
                    </div>
                  </div>
                </div>
                <div className="">
                  <div className=" text-base sm:text-lg text-center sm:text-left font-semibold mt-4 text-customBg">
                    Home Sub
                  </div>
                  {lineUp &&
                    lineUp.map((lineUp) =>
                      lineUp.home_team.substitutes.map((sub, index) => (
                        <div
                          key={index}
                          className="py-2 flex gap-2 px-2 text-xs sm:text-base "
                        >
                          <div
                            className=" flex gap-4 items-center cursor-pointer rounded-r-full  border border-solid border-gray-700 "
                            onClick={() => showPlayerStat(sub.player_key)}
                          >
                            <div className="opacity-60   h-7 w-7 flex justify-center items-center rounded-full border-r border-solid border-gray-700">
                              {sub.player_number}
                            </div>
                            <div className={` pr-4 `}>{sub.player}</div>
                          </div>
                        </div>
                      ))
                    )}
                  <div
                    className={`${
                      showStatToggle ? "visible" : "invisible"
                    } fixed bottom-2 right-2  md:w-[400px]  `}
                    ref={reff}
                  >
                    {playerStat &&
                      playerStat.map((stat) => (
                        <div>
                          {stat.away
                            .filter((stat) => stat.player_key == clickedPlayer)
                            .map((stat, index) => (
                              <PlayerStat
                                reff={reff}
                                stat={stat}
                                setShowStatToggle={setShowStatToggle}
                                key={index}
                              />
                            ))}
                        </div>
                      ))}
                  </div>
                </div>
              </div>
              <div className=" sm:w-[48%] ">
                <div className="">
                  {lineUp &&
                    lineUp.map((coach) =>
                      coach.away_team.coaches.map((coache, index) => (
                        <div key={index} className=" sm:text-right text-base">
                          {coache.coache}
                          <div className=" opacity-60">(coach)</div>
                        </div>
                      ))
                    )}
                  <div className=" text-base sm:text-lg font-semibold sm:text-right text-customBg text-center">
                    Away Line-Up
                  </div>
                  {lineUp &&
                    lineUp.map((lineUp, index) => (
                      <div key={index} className=" ">
                        {lineUp.away_team.starting_lineups
                          .sort(
                            (a, b) =>
                              parseInt(a.player_position) -
                              parseInt(b.player_position)
                          )
                          .map((startingLineUp, index) => (
                            <div
                              key={index}
                              className=" py-2 flex sm:justify-end px-2 text-xs sm:text-base"
                            >
                              <div className=" flex  gap-2">
                                <div
                                  className=" flex gap-4 sm:flex-row flex-row-reverse items-center cursor-pointer border border-solid border-gray-700 sm:rounded-l-full sm:rounded-r-none rounded-r-full"
                                  onClick={() =>
                                    showPlayerStat(startingLineUp.player_key)
                                  }
                                >
                                  <div className={`pr-4 sm:pr-0 sm:pl-4 `}>
                                    {startingLineUp.player}
                                  </div>
                                  <div className="opacity-60  h-7 w-7 flex justify-center items-center rounded-full border-l border-solid border-gray-700">
                                    {startingLineUp.player_number}
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                      </div>
                    ))}
                  <div
                    className={`${
                      showStatToggle ? "visible" : "invisible"
                    } fixed bottom-2 right-2 w-full md:w-[400px]`}
                    ref={reff}
                  >
                    {playerStat &&
                      playerStat.map((stat) => (
                        <div>
                          {stat.away
                            .filter((stat) => stat.player_key == clickedPlayer)
                            .map((stat, index) => (
                              <PlayerStat
                                reff={reff}
                                stat={stat}
                                setShowStatToggle={setShowStatToggle}
                                toggleMode={toggleMode}
                                key={index}
                              />
                            ))}
                        </div>
                      ))}
                  </div>
                </div>
                <div className=" ">
                  <div className=" text-base sm:text-lg font-semibold mt-4 sm:text-right text-customBg text-center">
                    Away Sub
                  </div>
                  {lineUp &&
                    lineUp.map((lineUp) =>
                      lineUp.away_team.substitutes.map((sub, index) => (
                        <div
                          key={index}
                          className="py-2 flex sm:justify-end px-2 text-xs sm:text-base "
                        >
                          <div className=" flex sm:flex-row flex-row-reverse gap-2">
                            <div
                              className=" flex gap-4 sm:flex-row flex-row-reverse items-center cursor-pointer border border-solid border-gray-700 sm:rounded-l-full sm:rounded-r-none rounded-r-full "
                              onClick={() => showPlayerStat(sub.player_key)}
                            >
                              <div className={` pr-4 sm:pr-0 sm:pl-4 `}>
                                    {sub.player}
                                  </div>
                              <div className="opacity-60   h-7 w-7 flex justify-center items-center rounded-full border-l border-solid border-gray-700">
                                {sub.player_number}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  <div
                    className={`${
                      showStatToggle ? "visible" : "invisible"
                    } fixed bottom-2 right-2 w-full md:w-[400px an `}
                    ref={reff}
                  >
                    {playerStat &&
                      playerStat.map((stat) => (
                        <div>
                          {stat.away
                            .filter((stat) => stat.player_key == clickedPlayer)
                            .map((stat, index) => (
                              <PlayerStat
                                reff={reff}
                                stat={stat}
                                setShowStatToggle={setShowStatToggle}
                                key={index}
                              />
                            ))}
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )
      )}
    </div>
  );
};

export default LineUp;

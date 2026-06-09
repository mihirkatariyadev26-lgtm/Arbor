import React, { useEffect, useState } from "react";
import axios from "axios";
import "./UserRepolist.css";

import PublicIcon from "@mui/icons-material/Public";
import ShieldOutlinedIcon from "@mui/icons-material/ShieldOutlined";
const UserRepolist = () => {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchUserRepo = async () => {
      try {
        setLoading(true);
        const cleanid = localStorage
          .getItem("userId")
          .trim()
          .replace(/['"]+/g, "");
        // console.log(cleanid);
        const res2 = await axios.get(
          `https://arbor-backend-qr7t.onrender.com/repo/user/${cleanid}`,
        );
        // console.log("Length:", cleanid.length);
        // console.log("Encoded:", encodeURIComponent(cleanid));
        setList(res2.data);
        setLoading(false);
        console.log(res2.data);
        return res2.data;
      } catch (e) {
        console.log("error in fetching ", e);
        setList([]);
      } finally {
        setLoading(false);
      }

      return list;
    };
    fetchUserRepo();
  }, []);
  return (
    <div className="UserRepolist">
      <p className="-header">Your Repositoies </p>

      {loading ? (
        <p>Loading Repositories</p>
      ) : list.length > 0 ? (
        list.map((e) => {
          return (
            <div
              key={e._id}
              className="repo"
              style={{ justifyContent: "space-between" }}>
              {e.name}
              <div style={{ width: "10%", paddingRight: "1.25rem" }}>
                {e.visibility ? (
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                    }}>
                    <PublicIcon />
                    <span>Public</span>
                  </div>
                ) : (
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                    }}>
                    <ShieldOutlinedIcon />
                    <span>Privet</span>
                  </div>
                )}
              </div>
            </div>
          );
        })
      ) : (
        <p>No Repositories</p>
      )}
    </div>
  );
};

export default UserRepolist;

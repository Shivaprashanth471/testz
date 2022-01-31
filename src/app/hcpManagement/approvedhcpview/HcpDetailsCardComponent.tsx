import RoomIcon from "@material-ui/icons/Room";
import { Avatar } from "@material-ui/core";
import { useParams } from "react-router-dom";
import { useCallback, useEffect, useState } from "react";
import { CommonService } from "../../../helpers";
import { ENV } from "../../../constants";

const HcpDetailsCardComponent = () => {
  const params = useParams<{ id: string }>();
  const { id } = params;
  const [hcpBasicDetails, setBasicDetails] = useState<any | null>(null);
  const init = useCallback(() => {
    // config
    CommonService._api
      .get(ENV.API_URL + "hcp/user/" + id)
      .then((resp) => {
        console.log(resp);

        setBasicDetails(resp.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [id]);
  useEffect(() => {
    init();
  }, [init]);
  return (
    <div>
      <div className="position-relative">
        <div className="pb-16 d-flex items-center">
          <Avatar alt="user photo" style={{ height: "70px", width: "70px" }} src={"https://images.unsplash.com/photo-1510832198440-a52376950479?ixid=MnwxMjA3fDB8MHxzZWFyY2h8NHx8Z2lybHxlbnwwfHwwfHw%3D&ixlib=rb-1.2.1&w=1000&q=80"} />
          <div className="mrg-left-20 items-center">
            <h2>
              {hcpBasicDetails?.first_name} &nbsp; {hcpBasicDetails?.last_name}
            </h2>
            <div className="d-flex items-center location pdd-0">
              <div>
                <RoomIcon className="location_icon" />
              </div>
              <p className="location_name">{hcpBasicDetails?.address?.region}</p>
            </div>
          </div>
        </div>
        <div>
          <h3 className="hcp_type">{hcpBasicDetails?.role}</h3>
        </div>
      </div>
    </div>
  );
};

export default HcpDetailsCardComponent;

import moment from "moment";
import React, { PropsWithChildren } from "react";
import NoDataToShowCardComponent from "../../../../components/NoDataToShowCardComponent";
import { CommonService } from "../../../../helpers";

export interface HcpVolunteerExperienceComponentProps {
  volunteerExperience: any;
}

const HcpVolunteerExperienceComponent = (props: PropsWithChildren<HcpVolunteerExperienceComponentProps>) => {
  const volunteerExperience = props?.volunteerExperience;
  const sortedExpData = volunteerExperience && CommonService.sortDatesByLatest(volunteerExperience, "start_date");

  return (
    <div>
      {volunteerExperience?.length > 0 ? (
        sortedExpData?.map((item: any, index: any) => {
          return (
            <div className={index !== 0 ? "mrg-top-30" : ""}>
              <h4 className="title-count ">Volunteer Experience {index + 1}</h4>
              <div className="d-flex">
                <div className="flex-1">
                  <h4>Organization Name</h4>
                  <p>{item?.facility_name}</p>
                </div>
                <div className="flex-1">
                  <h4>Location</h4>
                  <p>{item?.location}</p>
                </div>
                <div className="flex-1">
                  <h4>Speciality</h4>
                  <p>{item?.specialisation}</p>
                </div>
              </div>
              <div className="d-flex">
                <div className="flex-1">
                  <h4>Start and End Date</h4>
                  <p>
                    {moment(item?.start_date).format("MMMM, YYYY")}&nbsp;-&nbsp;{item?.end_date !== "" ? moment(item?.end_date).format("MMMM, YYYY") : "N/A"}
                  </p>
                </div>
                <div className="flex-1">
                  <h4>Position Title</h4>
                  <p>{item?.position_title}</p>
                </div>
                <div className="flex-1">
                  <h4>Still Working Here</h4>
                  <p>{item?.still_working_here === 0 ? "NO" : "YES"}</p>
                </div>
              </div>
              <div className="d-flex">
                <div className="flex-1">
                  <h4>Skill</h4>
                  <p>{item?.skills ? item?.skills : "N/A"} </p>
                </div>
              </div>
            </div>
          );
        })
      ) : (
        <NoDataToShowCardComponent />
      )}
    </div>
  );
};

export default HcpVolunteerExperienceComponent;

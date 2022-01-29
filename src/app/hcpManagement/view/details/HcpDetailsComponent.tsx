import moment from 'moment';
import React, { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import LoaderComponent from '../../../../components/LoaderComponent';
import NoDataToShowCardComponent from '../../../../components/NoDataToShowCardComponent';
import CustomFile from '../../../../components/shared/CustomFile';
import { ENV } from '../../../../constants';
import { CommonService } from '../../../../helpers';
import HcpContractComponent from '../contract/HcpContractComponent';
import "./HcpDetailsComponent.scss";

const HcpDetailsComponent = (props: any) => {
    const params = useParams<{ id: string }>();
    const { id } = params
    const hcpBasicDetails = props?.hcpBasicDetails;
    const [attachmentsDetails, setAttachmentsDetails] = useState<any | null>(null);
    const [sortedAttachments, setSortedAttachments] = useState<any | null>(null);
    const [attachmentLoading, setAttachmentLoading] = useState<boolean>(false)

    const getAttachmentsDetails = useCallback(() => {
        setAttachmentLoading(true)
        CommonService._api.get(ENV.API_URL + 'hcp/' + id + '/attachments').then((resp) => {
            setAttachmentsDetails(resp?.data);
            setAttachmentLoading(false)
        }).catch((err) => {
            console.log(err)
            setAttachmentLoading(false)
        })
    }, [id])

    // console.log(attachmentsDetails)

    useEffect(() => {
        getAttachmentsDetails()
    }, [getAttachmentsDetails])

    useEffect(() => {
        const required_attachments = [{ name: "Physical Test", index: -1 },
        { name: "TB Test", index: -1 },
        { name: "Chest X-ray", index: -1 },
        { name: "CPR/BLS Card", index: -1 },
        { name: "Driver's Licence", index: -1 },
        { name: "SSN Card", index: -1 },
        { name: "License", index: -1 },
        { name: "Covid Certificate", index: -1 },
        { name: "Covid Vaccine Card", index: -1 },
        { name: "Covid Test Result", index: -1 },
        { name: "Livescan", index: -1 },
        { name: "Vaccine Exemption Letter", index: -1 }]
        let tempAttachemnts: any = []
        required_attachments?.forEach((item: any) => {
            attachmentsDetails?.forEach((attachment: any) => {
                if (item.name === attachment?.attachment_type) {
                    tempAttachemnts.push(attachment)
                }
            })
        })

        setSortedAttachments([...tempAttachemnts])
    }, [attachmentsDetails])
    console.log(sortedAttachments)

    const StyledLoader = () => {
        return <div className='pdd-20' style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <LoaderComponent position='block' />
        </div>
    }

    return <div className="hcp_details">
        <div className="custom-border pdd-20 pdd-left-40 pdd-right-40 mrg-top-15">
            <div className="d-flex profile-status-wrapper">
                <h3>Basic Details</h3>
                <div className="d-flex">
                    <h2 className="status mrg-right-0">Status</h2> <h2 className="status">&nbsp;:&nbsp;{hcpBasicDetails?.status}</h2>
                </div>
            </div>
            <div className="d-flex">
                <div className="flex-1">
                    <h4>First Name</h4>
                    <p>{hcpBasicDetails?.first_name} </p>
                </div>
                <div className="flex-1">
                    <h4>Last Name</h4>
                    <p>{hcpBasicDetails?.last_name} </p>
                </div>
                <div className="flex-1">
                    <h4>Contact Number</h4>
                    <p>{hcpBasicDetails?.contact_number}</p>
                </div>
            </div>
            <div className="d-flex">
                <div className="flex-1">
                    <h4>Email</h4>
                    <p>{hcpBasicDetails?.email}</p>
                </div>
                <div className="flex-1">
                    <h4>Gender</h4>
                    <p>{hcpBasicDetails?.gender}</p>
                </div>
                <div className="flex-1">
                    <h4>Role</h4>
                    <p>{hcpBasicDetails?.hcp_type}</p>
                </div>
            </div>
            <div className="d-flex">
                <div className="flex-1">
                    <h4>Region Name</h4>
                    <p>{hcpBasicDetails?.address?.region}</p>
                </div>
                <div className="flex-1">
                    <h4>Street</h4>
                    <p>{hcpBasicDetails?.address?.street}</p>
                </div>
                <div className="flex-1">
                    <h4>City</h4>
                    <p>{hcpBasicDetails?.address?.city}</p>
                </div>
            </div>
            <div className="d-flex">
                <div className="flex-1">
                    <h4>State</h4>
                    <p>{hcpBasicDetails?.address?.state}</p>
                </div>
                <div className="flex-1">
                    <h4>Country</h4>
                    <p>{hcpBasicDetails?.address?.country}</p>
                </div>
                <div className="flex-1">
                    <h4>Zip Code</h4>
                    <p>{hcpBasicDetails?.address?.zip_code}</p>
                </div>
            </div>
            <div className="mrg-top-10">
                <h4>About the HCP</h4>
                <p className="summary">{hcpBasicDetails?.about}</p>
            </div>
        </div>
        <div className="custom-border mrg-top-10 pdd-20 pdd-left-40 pdd-right-40">
            <h3>Professional Details</h3>
            <div className="d-flex">
                <div className="flex-1">
                    <h4>Years of Experience</h4>
                    <p>{hcpBasicDetails?.professional_details?.experience}</p>
                </div>
                <div className="flex-1">
                    <h4>Speciality</h4>
                    <p>{hcpBasicDetails?.professional_details?.speciality}</p>
                </div>
            </div>
            <div>
                <h4>Professional Summary</h4>
                <p className="summary">{hcpBasicDetails?.professional_details?.summary}</p>
            </div>
        </div>

        {!attachmentLoading && sortedAttachments ?
            <div className="custom-border mrg-top-10 pdd-20 pdd-left-40 pdd-right-40">
                <h3>Attachments</h3>
                {
                    sortedAttachments?.length === 0 && <p>  <NoDataToShowCardComponent /></p>
                }
                <div className="attachments_wrapper">
                    {sortedAttachments?.map((item: any) => {
                        return (
                            <div className="attachments"><CustomFile data={item} /></div>
                        )
                    })}

                </div>
            </div>
            : <div className='custom-border mrg-top-10 pdd-20 pdd-left-40 pdd-right-40'>
                <StyledLoader />
            </div>}
        <div>
            <HcpContractComponent hcpDetails={hcpBasicDetails} />
        </div>

        <div className="custom-border mrg-top-10 pdd-20 pdd-left-40 pdd-right-40">
            <h3>Travel Preference</h3>
            <div className="d-flex mrg-top-20">
                {
                    hcpBasicDetails?.nc_details?.travel_preferences && hcpBasicDetails?.nc_details?.travel_preferences.length > 0 ?
                        hcpBasicDetails?.nc_details?.travel_preferences.map((item: any) => <p className='flex-1'>{item} Miles</p>) : <p>N/A</p>
                }
            </div>
        </div>

        <div className="custom-border mrg-top-10 pdd-20 pdd-left-40 pdd-right-40 pdd-bottom-35">
            <h3>NC Section</h3>
            <div className="d-flex">
                <div className="flex-1">
                    <h4>DNR</h4>
                    <p>{hcpBasicDetails?.nc_details?.dnr}</p>
                </div>
                <div className="flex-1">
                    <h4>Preferred Location to Work</h4>
                    <p>{hcpBasicDetails?.nc_details?.location_preference}</p>
                </div>

                <div className="flex-1">
                    <h4>Vaccine</h4>
                    <p>{hcpBasicDetails?.nc_details?.vaccine === "half" ? "1st Dose" : hcpBasicDetails?.nc_details?.vaccine}</p>
                </div>
            </div>

            <div className="d-flex">
                <div className="flex-1">
                    <h4>First Shot Date</h4>
                    <p>{hcpBasicDetails?.nc_details?.vaccination_dates?.first_shot ? hcpBasicDetails?.nc_details?.vaccination_dates?.first_shot : "N/A"}</p>
                </div>

                <div className="flex-1">
                    <h4>Latest Shot Date</h4>
                    <p>{hcpBasicDetails?.nc_details?.vaccination_dates?.first_shot ? hcpBasicDetails?.nc_details?.vaccination_dates?.latest_shot : "N/A"}</p>
                </div>

                <div className="flex-1">
                    <h4>Contact Type</h4>
                    <p>{hcpBasicDetails?.nc_details?.contact_type}</p>
                </div>

            </div>


            <div className="d-flex">
                <div className="flex-1">
                    <h4>Preference Shift Type</h4>
                    <p>{hcpBasicDetails?.nc_details?.shift_type_preference}</p>
                </div>
                <div className="flex-1">
                    <h4>Zone Assignment</h4>
                    <p>{hcpBasicDetails?.nc_details?.zone_assignment !== "" ? hcpBasicDetails?.nc_details?.zone_assignment : "N/A"}</p>
                </div>
                <div className="flex-1">
                    <h4>Last Call Date</h4>
                    <p>{hcpBasicDetails?.nc_details?.last_call_date ? moment(hcpBasicDetails?.nc_details?.last_call_date).format('MMMM Do YYYY, hh:mm A') : "N/A"}</p>
                </div>
            </div>
            <div className="d-flex">

                <div className="flex-1">
                    <h4>Do you have a Full-time Job ?</h4>
                    <p>{hcpBasicDetails?.nc_details?.is_fulltime_job !== "" ? hcpBasicDetails?.nc_details?.is_fulltime_job === "true" ? "Yes" : "No" : "N/A"}</p>
                </div>
                <div className="flex-1">
                    <h4>Covid (or) Non Covid Facility ?</h4>
                    <p>{hcpBasicDetails?.nc_details?.covid_facility_preference}</p>
                </div>
                <div className="flex-1">
                    <h4>What Is More Important for You ?</h4>
                    <p>{hcpBasicDetails?.nc_details?.more_important_preference !== "" ? hcpBasicDetails?.nc_details?.more_important_preference : "N/A"}</p>
                </div>
            </div>

            <div className="d-flex">
                <div className="flex-1">
                    <h4>Is this a Supplement to your Income ?</h4>
                    <p>{hcpBasicDetails?.nc_details?.is_supplement_to_income !== "" ? hcpBasicDetails?.nc_details?.is_supplement_to_income === "true" ? "Yes" : "No" : "N/A"}</p>
                </div>
                <div className="flex-1">
                    <h4>Are you Studying ?</h4>
                    <p>{hcpBasicDetails?.nc_details?.is_studying !== "" ? hcpBasicDetails?.nc_details?.is_studying === "true" ? "Yes" : "No" : "N/A"}</p>
                </div>
                <div className="flex-1">
                    <h4>Gusto</h4>
                    <p>{hcpBasicDetails?.nc_details?.gusto_type !== "" ? hcpBasicDetails?.nc_details?.gusto_type : "N/A"}</p>
                </div>
            </div>

            <div className="d-flex">
                <div className="flex-1">
                    <h4>Is Gusto Invited ?</h4>
                    <p>{hcpBasicDetails?.nc_details?.is_gusto_invited !== "" ? hcpBasicDetails?.nc_details?.is_gusto_invited === "true" ? "Yes" : "No" : "N/A"}</p>
                </div>
                <div className="flex-1">
                    <h4>Is Gusto Onboarded ?</h4>
                    <p>{hcpBasicDetails?.nc_details?.is_gusto_onboarded !== "" ? hcpBasicDetails?.nc_details?.is_gusto_onboarded === "true" ? "Yes" : "No" : "N/A"}</p>
                </div>
                <div className="flex-1">
                    <h4>Legally Authorised to work in United States ?</h4>
                    <p>{hcpBasicDetails?.nc_details?.is_authorized_to_work !== "" ? hcpBasicDetails?.nc_details?.is_authorized_to_work === "true" ? "Yes" : "No" : "N/A"}</p>
                </div>
            </div>

            <div className='d-flex'>
                <div className="flex-1">
                    <h4>Require Sponsorship for Employment in United States?</h4>
                    <p>{hcpBasicDetails?.nc_details?.is_require_employment_sponsorship !== "" ? hcpBasicDetails?.nc_details?.is_require_employment_sponsorship === "true" ? "Yes" : "No" : "N/A"}</p>
                </div>
            </div>
            <div className="d-flex">
                <div className="flex-1">
                    <h4>Family Considerations</h4>
                    <p>{hcpBasicDetails?.nc_details?.family_consideration}</p>
                </div>
            </div>

            <div className="d-flex">
                <div className="flex-1">
                    <h4>Other Information Gathered</h4>
                    <p>{hcpBasicDetails?.nc_details?.other_information}</p>
                </div>
            </div>
        </div>
    </div>

}


export default HcpDetailsComponent;

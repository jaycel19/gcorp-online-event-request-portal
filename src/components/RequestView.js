import React from 'react';
import '../css/RequestView.css';

const RequestView = ({ data, viewSingle, setViewSingle, id, monoblock_single, armchairs, speakers, tables, whiteboard, microphones }) => {

    return (
        <div className="RequestView" style={{display: `${viewSingle ? 'flex' : 'none'}`}}>
            <div className="modal-content">
                <button onClick={() => setViewSingle(false)}>X</button>
                <p>Facility: {data.facility}</p>
                <p>Title of event: {data.title_of_event}</p>
                <p>Requestor's full name: {data.user_name}</p>
                <p>Department: {data.department}</p>
                <p>Contact Number: {data.contact_number}</p>
                <p>Type of event: {data.type_of_event}</p>
                <p>Event/Activity Duration: {data.duration_from_time}, {data.duration_to} {data.duration_to_time}</p>
                <p>Description of activity: {data.description_of_activity}</p>
                <p>Single Monoblock Chair: {monoblock_single}</p>
                <p>Armchairs: {armchairs}</p>
                <p>Tables: {tables}</p>
                <p>Microphones: {microphones}</p>
                <p>Speakers: {speakers}</p>
                <p>Whiteboard: {whiteboard}</p>
                <p>Other Specifications: </p>
                <p>Open to the public? {data.open_to_the_public ? "YES" : "NO" }</p>
                <p>Expected Number of Attendees From Gordon College: {data.expected_num_attend_gc}</p>
                <p>Expected Number of Attendees From Outside of Gordon College: {data.expected_num_attend_out}</p>
                <p>With Food Catering?: {data.cater ? "YES" : "NO"}</p>
                <p>Open to the public?: {data.cater_open_public ? "YES" : "NO"}</p>
                <p>Additional Information: </p>
            </div>
        </div>
    )
}

export default RequestView
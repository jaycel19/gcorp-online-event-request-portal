import React from 'react';
import '../css/RequestView.css';

const RequestView = ({ data, viewSingle, setViewSingle, id, monoblock_single, armchairs, speakers, tables, whiteboard, microphones }) => {


    return (
        <div className="RequestView" style={{display: `${viewSingle ? 'flex' : 'none'}`, zIndex: '10'}}>
            <div className="modal-content">
                <div style={{
                    display: 'flex',
                    justifyContent: 'flex-end',
                    width: '100%',
                    marginBottom: '20px'
                }}>
                    <button style={{
                        border: 'none',
                        backgroundColor: 'transparent',
                        fontWeight: '1000',
                        cursor: 'pointer'
                    }} onClick={() => setViewSingle(false)}>X</button>
                </div>
  <table style={{
    width: '100%'
  }}>
    <thead>
      <tr>
        <th colspan="2" style={{backgroundColor: 'green', color: 'white'}}>Request Details</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>Facility:</td>
        <td>{data.facility}</td>
      </tr>
      <tr>
        <td>Title of Event:</td>
        <td>{data.title_event}</td>
      </tr>
      <tr>
        <td>Requestor's full name:</td>
        <td>{data.user_name}</td>
      </tr>
      <tr>
        <td>Department:</td>
        <td>{data.department}</td>
      </tr>
      <tr>
        <td>Contact Number:</td>
        <td>{data.contact_number}</td>
      </tr>
      <tr>
        <td>Type of Event:</td>
        <td>{data.type_of_event}</td>
      </tr>
      <tr>
        <td>Event/Activity Duration:</td>
        <td>{data.duration_from_time}, {data.duration_to} {data.duration_to_time}</td>
      </tr>
      <tr>
        <td>Description of Activity:</td>
        <td>{data.description_of_activity}</td>
      </tr>
      <tr>
        <td>Single Monoblock Chair:</td>
        <td>{monoblock_single}</td>
      </tr>
      <tr>
        <td>Armchairs:</td>
        <td>{armchairs}</td>
      </tr>
      <tr>
        <td>Tables:</td>
        <td>{tables}</td>
      </tr>
      <tr>
        <td>Microphones:</td>
        <td>{microphones}</td>
      </tr>
      <tr>
        <td>Speakers:</td>
        <td>{speakers}</td>
      </tr>
      <tr>
        <td>Whiteboard:</td>
        <td>{whiteboard}</td>
      </tr>
      <tr>
        <td>Open to the Public?</td>
        <td>{data.open_to_the_public ? "YES" : "NO" }</td>
      </tr>
      <tr>
        <td>Expected Number of Attendees from Gordon College:</td>
        <td>{data.expected_num_attend_gc}</td>
      </tr>
      <tr>
        <td>Expected Number of Attendees from Outside of Gordon College:</td>
        <td>{data.expected_num_attend_out}</td>
      </tr>
      <tr>
        <td>With Food Catering?</td>
        <td>{data.cater ? "YES" : "NO"}</td>
      </tr>
      <tr>
        <td>Open to the Public?</td>
        <td>{data.cater_open_public ? "YES" : "NO"}</td>
      </tr>
      <tr>
        <td>Additional Information:</td>
        <td>{data.additional_info}</td>
      </tr>
    </tbody>
  </table>
</div>
        </div>
    )
}

export default RequestView
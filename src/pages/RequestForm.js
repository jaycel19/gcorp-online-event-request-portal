import React from 'react';

const RequestForm = () => {
  return (
    <div className="RequestForm">
        <div className="title">
            <h2>REQUEST FORM FOR USE OF GC FACILITIES</h2>
        </div>
        <div className="first">
            <div className="titleHead">
                <p>Please indicate the specific facility to use by checking the box:</p>
            </div>
            <div className="facilityList">
                <input type="chekbox" />
                <span>FUNCTION HALL</span>
                <input type="chekbox" />
                <span>P.E ROOM</span>
                <input type="chekbox" />
                <span>OTHER: </span>
                <input type="text" />
            </div>
            <div className="eventInfo">
                <div className="info">
                    <p>TITLE OF EVENT:</p>
                    <input type="text" />
                </div>
                <div className="info">
                    <p>REQUESTOR'S FULL NAME:</p>
                    <input type="text" />
                </div>
                <div className="info">
                    <p>DEPARTMENT:</p>
                    <input type="text" />
                </div>
                <div className="info">
                    <p>CONTACT NUMBER:</p>
                    <input type="text" />
                </div>
                <div className="info">
                    <p>TYPE OF EVENT:</p>
                    <input type="text" />
                </div>
            </div>
        </div>
        <div className="second">
            <div className="duration">
                <div className="header">
                    <p>EVENT/ACTIVITY DURATION:</p>
                    <h3>FROM</h3>
                </div>
                <div  className="fromTO">
                    <div className="item">
                        <div className="singleItem">
                            <div className="singleDate">
                                <p>DATE:</p>
                                <input type="text" />
                            </div>
                            <div className="singleDate">
                                <p>TIME:</p>
                                <input type="text" />
                            </div>
                        </div>
                    </div>
                    <div className="to">
                        <h3>TO</h3>
                    </div>
                    <div className="item">
                        <div className="singleItem">
                            <div className="singleDate">
                                <p>DATE:</p>
                                <input type="text" />
                            </div>
                            <div className="singleDate">
                                <p>TIME:</p>
                                <input type="text" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="descriptionAct">
                <p>DESCRIPTION OF ACTIVITY:</p>
                <textarea>

                </textarea>
            </div>
        </div>
        <div className="third">
            <div className="equipTitle">
                <h3>EQUIPMENT/MATERIALS NEEDED:</h3>
            </div>
            <div className="equipQuan">
                <div className="quan">
                    <h3>QUANTITY</h3>
                </div>
                <div className="checkQuan">
                    <div className="everyItem">
                        <input type="checkbox" />
                        <p>Single Monoblock Chair</p>
                        <input type="text" />
                    </div>
                    <div className="everyItem">
                        <input type="checkbox" />
                        <p>Armchairs</p>
                        <input type="text" />
                    </div>
                    <div className="everyItem">
                        <input type="checkbox" />
                        <p>Tables</p>
                        <input type="text" />
                    </div>
                    <div className="everyItem">
                        <input type="checkbox" />
                        <p>Microphones {"(Max.2)"}</p>
                        <input type="text" />
                    </div>
                    <div className="everyItem">
                        <input type="checkbox" />
                        <p>Speakers</p>
                        <input type="text" />
                    </div>
                    <div className="everyItem">
                        <input type="checkbox" />
                        <p>Whiteboard</p>
                        <input type="text" />
                    </div>
                    <div className="everyItem">
                        <input type="checkbox" />
                        <p className="specify">
                            <span>Others</span>
                            <span>pls.Specify</span>
                            <input type="text" />
                        </p>
                        <input type="text" />
                    </div>
                </div>
            </div>
        </div>
        <div className="fourth">
            <div className="otherSpec">
                <h3>OTHER SPECIFICATIONS:</h3>
            </div>
            <div className="pubOpen">
                <p>Open to the public?</p>
                <div className="opItem">
                    <p>Yes</p>
                    <input type="checkbox" />
                </div>
                <div className="opItem">
                    <p>No</p>
                    <input type="checkbox" />
                </div>
            </div>
            <div className="otherSpec">
                <div className="attendGc">
                    <p>Expected Number of Attedees</p>
                    <p>From Gordon College:</p>
                    <textarea>

                    </textarea>
                </div>
            </div>
            <div className="otherSpec">
                <div className="attendGc">
                    <p>Expected Number of Attedees</p>
                    <p>From Gordon College:</p>
                    <textarea>

                    </textarea>
                </div>
            </div>
            <div className="otherSpec">
                <div className="caterFood">
                    <div className="caterItem">
                        <p>With Food Catering?</p>
                        <div className="foodItem">
                            <p>Yes</p>
                            <input type="checkbox" />
                        </div>
                        <div className="foodItem">
                            <p>No</p>
                            <input type="checkbox" />
                        </div>
                    </div>
                </div>
                <div className="caterFood">
                    <p className="public">
                        <span>Open to the public?</span>
                        <span>
                            <span>How many:</span>
                            <input type="text" />
                        </span>
                    </p>
                    <div className="foodItem">
                        <p>Yes</p>
                        <input type="checkbox" />
                    </div>
                    <div className="foodItem">
                        <p>No</p>
                        <input type="checkbox" />
                    </div>
                </div>
            </div>
            <div className="addInfo">
                <div className="disc">
                    <h3>Additional Information:</h3>
                    <p>IF THERE ARE GUEST SPEAKERS OR VIP VISITORS PLEASE WRITE THEIR NAMES BELOW TO NOTIFY THE SECURITY:</p>
                    <textarea>
                        
                    </textarea>
                </div>
            </div>
        </div>
    </div>
  )
}

export default RequestForm
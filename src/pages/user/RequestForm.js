import React from 'react';
import '../../css/RequestForm.css';

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
                <input type="checkbox" />
                <span>FUNCTION HALL</span>
                <input type="checkbox" />
                <span>P.E ROOM</span>
                <input type="checkbox" />
                <span>OTHER: </span>
                <input className="other" style={{backgroundColor: "#fff", borderBottom: "1px solid #000", padding: "5px"}} type="text" />
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
                    <div className="from">
                        <h3>FROM</h3>
                    </div>
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
                        <div className="nthItems">
                            <input type="checkbox" />
                            <p>Single Monoblock Chair</p>
                        </div>
                        <input type="text" />
                    </div>
                    <div className="everyItem">
                        <div className="nthItems">
                            <input type="checkbox" />
                            <p>Armchairs</p>
                        </div>
                        <input type="text" />
                    </div>
                    <div className="everyItem">
                        <div className="nthItems">
                            <input type="checkbox" />
                            <p>Tables</p>
                        </div>
                        <input type="text" />
                    </div>
                    <div className="everyItem">
                        <div className="nthItems">
                        <input type="checkbox" />
                        <p>Microphones {"(Max.2)"}</p>
                        </div>
                        <input type="text" />
                    </div>
                    <div className="everyItem">
                        <div className="nthItems">
                            <input type="checkbox" />
                            <p>Speakers</p>
                        </div>
                        <input type="text" />
                    </div>
                    <div className="everyItem">
                        <div className="nthItems">
                            <input type="checkbox" />
                            <p>Whiteboard</p>
                        </div>
                        <input type="text" />
                    </div>
                    <div className="everyItem">
                        <div className="nthItems">
                            <input type="checkbox" />
                            <p className="specify">
                                <span>Others </span>
                                <span>pls.Specify </span>
                                <input style={{borderBottom: "1px solid #000", backgroundColor: "#fff", width: "100px"}} type="text" />
                            </p>
                        </div>
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
                    <div className="attendP">
                        <p>Expected Number of Attedees</p>
                        <p>From Gordon College:</p>
                    </div>
                    <textarea>

                    </textarea>
                </div>
            </div>
            <div className="otherSpec">
                <div className="attendGc">
                    <div className="attendP">
                        <p>Expected Number of Attedees</p>
                        <p>Outside of Gordon College:</p>
                    </div>
                    <textarea>

                    </textarea>
                </div>
            </div>
            <div className="otherSpec">
                <div className="caterItem">
                    <p>With Food Catering?</p>
                    <div className="right">
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
                        <span className="many">
                            <span>How many:</span>
                            <input style={{backgroundColor: "#fff", borderBottom: "1px solid #000", width: "55px"}} type="text" />
                        </span>
                    </p>
                    <div className="cateRight">
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
            </div>
            <div className="addInfo">
                <div className="disc">
                    <h3>Additional Information:</h3>
                    <p>IF THERE ARE GUEST SPEAKERS OR VIP VISITORS PLEASE WRITE THEIR NAMES BELOW TO NOTIFY THE SECURITY:</p>
                    <textarea>
                        
                    </textarea>
                    <div className="subBtn">
                        <button>SUBMIT REQUEST <br />FORM</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
  )
}

export default RequestForm
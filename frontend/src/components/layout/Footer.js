import React, { Fragment, useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { Modal } from 'react-bootstrap'
import TermsAndConditions from '../home/TermsAndConditions'
import ReturnAndRefund from '../home/ReturnAndRefund' 
import PrivacyPolicy from '../home/PrivacyPolicy'

const Footer = () => {

    const { user } = useSelector(state => state.auth)
    const [show, setShow] = useState(false);
    const [showPolicy, setShowPolicy] = useState(false);
    const [showPrivacy, setShowPrivacy] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const handleClosePolicy = () => setShowPolicy(false);
    const handleShowPolicy = () => setShowPolicy(true);

    const handleClosePrivacy = () => setShowPrivacy(false);
    const handleShowPrivacy = () => setShowPrivacy(true);


  return (
    <Fragment>
        {
            user && user.role !== "Customer" ?
                ''
                : 
            <>
        <footer>
            <div className="main-footer widgets-dark typo-light">
                <div className="container">
                    <div className="row">

                        <div className="col-xs-12 col-sm-6 col-md-4">
                        <div className="widget subscribe no-box">
                        <h5 className="widget-title">Fleuret PH/TK<span></span></h5>
                            <p style={{ marginBottom: '0px' }}>Contact Us </p>
                            <p>09166064511</p>
                        </div>
                        </div>

                
                        <div className="col-xs-12 col-sm-6 col-md-4">
                        <div className="widget no-box">
                        <h5 className="widget-title">Quick Links<span></span></h5>
                        <ul className="quickLink" style={{paddingLeft: '0px'}}>

                        <li>
                        <div className="thumb-content" ><span data-toggle="modal" onClick={handleShow} id = "footerQuickLinks">Terms and Conditions </span></div> 

                        <Modal size="lg" show={show} onHide={handleClose} scrollable={true} >
                                    <Modal.Header closeButton>
                                        <Modal.Title>Terms and Conditions</Modal.Title>
                                    </Modal.Header>
                                    <Modal.Body>
                                        <TermsAndConditions/>
                                    </Modal.Body>
                                  
                                </Modal>
                         </li>
                        <li>
                            <div className="thumb-content" data-toggle="modal" onClick={handleShowPolicy}  id = "footerQuickLinks" style={{paddingLeft: '0px'}}><span>Return and Refund Policy</span></div> 
                            <Modal size="lg" show={showPolicy} onHide={handleClosePolicy} scrollable={true} >
                                    <Modal.Header closeButton>
                                        <Modal.Title>Return and Refund Policy</Modal.Title>
                                    </Modal.Header>
                                    <Modal.Body>
                                        <ReturnAndRefund/>
                                    </Modal.Body>
                                  
                                </Modal>
                        </li>
                        <div className="thumb-content" ><span data-toggle="modal" onClick={handleShowPrivacy} id = "footerQuickLinks">Privacy Policy </span></div> 
                        <Modal size="lg" show={showPrivacy} onHide={handleClosePrivacy} scrollable={true} >
                                    <Modal.Header closeButton>
                                        <Modal.Title>Privacy Policy</Modal.Title>
                                    </Modal.Header>
                                    <Modal.Body>
                                        <PrivacyPolicy/>
                                    </Modal.Body>
                                  
                                </Modal>

                        
                        </ul>
                        </div>
                       
                               
                        </div>
                        

                

                        <div className="col-xs-12 col-sm-6 col-md-4">
                        <div className="widget no-box">
                        <h5 className="widget-title">Follow Us<span></span></h5>
                            
                            <a href="https://www.instagram.com/fleuret.ph/"><i id="fajanela" className="fa-brands fa-instagram"></i></a>
                        </div>
                        </div>
                        
                     
                  



                        </div>
                        </div>
                        </div>
                        
                        
                        
                      
                        
                        
                        </footer>
                        </>    }   
    </Fragment>
  )
}

export default Footer
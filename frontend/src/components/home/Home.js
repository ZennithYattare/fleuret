import React from 'react'
import Metadata from "../layout/Metadata"
import { Link } from 'react-router-dom'
import ProductList from '../product/ProductList'

const Home = () => {
    return (
        <>
            <section className="banner-area" id="home">
                <div className = "background">
                </div>
                <Metadata title={'Home'}/>
            <div className = "welcome">
                <div className = "child">
                <h1>DEPLOYMENT</h1>
                <p className = "text-centers">Just say it with flowers.</p>
            
                    <a href = "/products" className = "shopBtn">SHOP NOW!</a>
                </div>
            </div>
            </section>
            <section class="services">
    <div class="containerHome grid-3 center">
      <div>
        <span class="fa-stack fa-4x custom">
          <i class="fa-solid fa-circle fa-stack-2x"></i>
          <i class="fa-brands fa-instagram fa-stack-1x" style={{color: "white"}}></i>
        </span>
        <h3>Instagram</h3>
        <p>We started at Instagram and are still active. Try to check us out there as well!</p>
      </div>
      <div>
        <span class="fa-stack fa-4x custom">
          <i class="fa-solid fa-circle fa-stack-2x"></i>
          <i class="fa-solid fa-truck-fast fa-stack-1x" style={{color: "white"}}></i>
        </span>
        <h3>Delivery</h3>
        <p>We offer delivery services. </p>
      </div>
      <div>
        <span class="fa-stack fa-4x custom">
          <i class="fa-solid fa-circle fa-stack-2x icon-background"></i>
          <i class="far fa-envelope-open fa-stack-1x" style={{color: "white"}}></i>
        </span>
        <h3>Personal Letters</h3>
        <p>Is it for a special someone? Don't forget to add your letter before checking out.</p>
      </div>
    </div>
  </section>

  <section class="about bg-light">
    <div class="containerHome">
      <div class="grid-2">
        <div class="center">
          <span class="fa-stack fa-7x custom">
          <i class="fa-solid fa-circle fa-stack-2x icon-background"></i>
          <i class="fa-solid fa-laptop-code fa-stack-1x" style={{color: "white"}}></i>
        </span>
        </div>
        <div>
          <h3>About Us</h3>
          <p>Fleuret PH/TK is a start-up florist and floral designer business reputed for it warm, classy, and aesthetic designs. With the great passion for flowers of the owner, Frances Mariscotes, was determined to help its consumers to delivery unspoken messages to their loved ones. With its tagline “Just say is with flowers”, feelings were expressed through flowers. 
          Fleuret PH/TK is a one-stop-shop for variety of dried flower arrangements that is perfect for home décor, gift, centerpiece, private events to corporate events, festival décor and more. You can easily order any floral arrangement from our website, secured in the knowledge that you are getting the best value for your money. </p>
        </div>
      </div>
    </div>
  </section>
        </>
    )
}

export default Home

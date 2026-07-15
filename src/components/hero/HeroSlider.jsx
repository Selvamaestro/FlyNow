import "./HeroSlider.css";
import heroSlides from "../../data/heroSlides";

import { ArrowRight } from "lucide-react";

import { useState, useEffect } from "react";

const HeroSlider = () => {

  const [current, setCurrent] = useState(0);

  useEffect(() => {

    const interval = setInterval(() => {

      setCurrent((prev) => (prev + 1) % heroSlides.length);

    }, 4000);

    return () => clearInterval(interval);

  }, []);

  return (

    <section className="hero">

      <div className="hero-content">

        <span className="offer-tag">

          🔥 Limited Time Offer

        </span>

        <h1>

          {heroSlides[current].title}

        </h1>

        <h2>

          {heroSlides[current].subtitle}

        </h2>

        <p>

          {heroSlides[current].description}

        </p>

<div className="hero-buttons">

  <button className="primary-btn">

    {heroSlides[current].button}

    <ArrowRight size={18} />

  </button>

  <button className="secondary-btn">

    Browse Categories

  </button>

</div>
<div className="hero-stats">

  <div>

    <h2>12K+</h2>

    <p>Offers</p>

  </div>

  <div>

    <h2>500+</h2>

    <p>Brands</p>

  </div>

  <div>

    <h2>20K+</h2>

    <p>Coupons</p>

  </div>

</div>

      </div>

      <div className="hero-image">

        <img

          src={heroSlides[current].image}

          alt="Hero"

        />

      </div>

      <div className="slider-dots">

        {heroSlides.map((_, index) => (

          <span

            key={index}

            className={current === index ? "active" : ""}

            onClick={() => setCurrent(index)}

          ></span>

        ))}

      </div>

    </section>

  );

};

export default HeroSlider;
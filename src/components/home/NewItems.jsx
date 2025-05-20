//** MH 5.19.25 */

import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import ReactOwlCarousel from "react-owl-carousel";
import 'owl.carousel/dist/assets/owl.carousel.css';
import 'owl.carousel/dist/assets/owl.theme.default.css';


const Countdown = ({ expiryDate }) => {
  const [timeLeft, setTimeLeft] = useState("");

  useEffect(() => {
    const formatTime = (ms) => {
      const totalSeconds = Math.floor(ms / 1000);
      const hours = Math.floor(totalSeconds / 3600);
      const minutes = Math.floor((totalSeconds % 3600) / 60);
      const seconds = totalSeconds % 60;
      return `${hours}h ${minutes}m ${seconds}s`;
    };

    const update = () => {
      const now = Date.now();
      const remaining = Math.max(0, new Date(expiryDate).getTime() - now);
      setTimeLeft(remaining > 0 ? formatTime(remaining) : "Expired");
    };

    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, [expiryDate]);

  return <div className="de_countdown">{timeLeft}</div>;
};

const NewItems = () => {
  const [newItems, setNewItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchNewItems = async () => {
    try {
      const response = await axios.get(
        "https://us-central1-nft-cloud-functions.cloudfunctions.net/newItems"
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching new items", error);
      return null;
    }
  };

  useEffect(() => {
    const loadNewItems = async () => {
      const data = await fetchNewItems();
      if (data) {
          setNewItems(data);
          setLoading(false);
      }
    };
    loadNewItems();
  }, []);

  const renderSkeletons = () => {
    return Array(4)
      .fill(0)
      .map((_, index) => (
        <div className="item" key={index}>
          <div className="nft__item">
            <div className="author_list_pp">
              <div className="skeleton skeleton-img-circle"></div>
            </div>
            <div className="de_countdown skeleton skeleton-text"></div>
            <div className="nft__item_wrap">
              <div className="skeleton skeleton-img"></div>
            </div>
            <div className="nft__item_info">
              <div className="skeleton skeleton-text title"></div>
              <div className="price-likes">
                <div className="skeleton skeleton-text price"></div>
                <div className="skeleton skeleton-text likes"></div>
              </div>
            </div>
          </div>
        </div>
      ));
  };

  const carouselOptions = {
    items: 4,
    margin: 20,
    loop: true,
    nav: true,
    dots: false,
    autoplay: false,
    smartSpeed: 500,
    responsive: {
      0: { items: 1 },
      768: { items: 2 },
      992: { items: 3 },
      1200: { items: 4 },
    },
  };

  return (
    <section id="section-items" className="no-bottom">
      <div className="container">
        <div className="row">
          <div className="col-lg-12">
            <div className="text-center">
              <h2>New Items</h2>
              <div className="small-border bg-color-2"></div>
            </div>
          </div>
  
          {loading ? (
            <ReactOwlCarousel className="owl-theme" {...carouselOptions}>
              {renderSkeletons()}
            </ReactOwlCarousel>
          ) : (
            <ReactOwlCarousel
              key={newItems.length} 
              className="owl-theme"
              {...carouselOptions}
            >
              {newItems.map((item, index) => (
                <div className="item" key={item.id || index}>
                  <div className="nft__item">
                    <div className="author_list_pp">
                      <Link
                        to="/author"
                        data-bs-toggle="tooltip"
                        data-bs-placement="top"
                        title="Creator: Monica Lucas"
                      >
                        <img className="lazy" src={item.authorImage} alt="" />
                        <i className="fa fa-check"></i>
                      </Link>
                    </div>
                      <Countdown expiryDate={item.expiryDate} />
                    <div className="nft__item_wrap">
                      <div className="nft__item_extra">
                        <div className="nft__item_buttons">
                          <button>Buy Now</button>
                          <div className="nft__item_share">
                            <h4>Share</h4>
                            <a href="#" target="_blank" rel="noreferrer">
                              <i className="fa fa-facebook fa-lg"></i>
                            </a>
                            <a href="#" target="_blank" rel="noreferrer">
                              <i className="fa fa-twitter fa-lg"></i>
                            </a>
                            <a href="#">
                              <i className="fa fa-envelope fa-lg"></i>
                            </a>
                          </div>
                        </div>
                      </div>
                      <Link to="/item-details">
                        <img
                          src={item.nftImage}
                          className="lazy nft__item_preview"
                          alt=""
                        />
                      </Link>
                    </div>
                    <div className="nft__item_info">
                      <Link to="/item-details">
                        <h4>{item.title}</h4>
                      </Link>
                      <div className="nft__item_price">{item.price} ETH</div>
                      <div className="nft__item_like">
                        <i className="fa fa-heart"></i>
                        <span>{item.likes}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </ReactOwlCarousel>
          )}
        </div>
      </div>
    </section>
  );
};

export default NewItems;
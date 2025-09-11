 import React, { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { getPriceQueryParams } from "../helpers/helpers";
import { PRODUCT_CATEGORIES } from "../constants/constants";
import StarRatings from "react-star-ratings";

const Filters = () => {
  const navigate = useNavigate();
  let [searchParams] = useSearchParams();

  const [min, setMin] = useState(searchParams.get("min") || "");
  const [max, setMax] = useState(searchParams.get("max") || "");

  // Controlled check for category/ratings
  const isChecked = (type, value) => searchParams.get(type) === value?.toString();

  const handleCheckbox = (e) => {
    const { name, value, checked } = e.target;

    const newParams = new URLSearchParams(searchParams.toString());

    if (checked) {
      newParams.set(name, value);
    } else {
      newParams.delete(name);
    }

    navigate(`${window.location.pathname}?${newParams.toString()}`);
  };

  const handlePriceSubmit = (e) => {
    e.preventDefault();
    let newParams = getPriceQueryParams(searchParams, "min", min);
    newParams = getPriceQueryParams(newParams, "max", max);
    navigate(`${window.location.pathname}?${newParams.toString()}`);
  };

  return (
    <div className="border p-3 filter">
      <h3>Filters</h3>
      <hr />
      <h5 className="filter-heading mb-3">Price</h5>
      <form id="filter_form" className="px-2" onSubmit={handlePriceSubmit}>
        <div className="row">
          <div className="col">
            <input
              type="text"
              className="form-control"
              placeholder="Min ($)"
              name="min"
              value={min}
              onChange={(e) => setMin(e.target.value)}
            />
          </div>
          <div className="col">
            <input
              type="text"
              className="form-control"
              placeholder="Max ($)"
              name="max"
              value={max}
              onChange={(e) => setMax(e.target.value)}
            />
          </div>
          <div className="col">
            <button type="submit" className="btn btn-primary">
              GO
            </button>
          </div>
        </div>
      </form>
      <hr />
      <h5 className="mb-3">Category</h5>

      {PRODUCT_CATEGORIES?.map((category) => (
        <div className="form-check" key={category}>
          <input
            className="form-check-input"
            type="checkbox"
            name="category"
            id={`category-${category}`}
            value={category}
            checked={isChecked("category", category)}
            onChange={handleCheckbox}
          />
          <label className="form-check-label" htmlFor={`category-${category}`}>
            {category}
          </label>
        </div>
      ))}

      <hr />
      <h5 className="mb-3">Ratings</h5>

      {[5, 4, 3, 2, 1].map((rating) => (
        <div className="form-check" key={rating}>
          <input
            className="form-check-input"
            type="checkbox"
            name="ratings"
            id={`rating-${rating}`}
            value={rating}
            checked={isChecked("ratings", rating)}
            onChange={handleCheckbox}
          />
          <label className="form-check-label" htmlFor={`rating-${rating}`}>
            <StarRatings
              rating={rating}
              starRatedColor="#ffb829"
              numberOfStars={5}
              name="rating"
              starDimension="21px"
              starSpacing="1px"
            />
          </label>
        </div>
      ))}
    </div>
  );
};

export default Filters;

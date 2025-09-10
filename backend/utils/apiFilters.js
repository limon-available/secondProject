 // backend/utils/apiFilters.js

class apiFilters {
  constructor(query, queryStr) {
    this.query = query;       // Mongoose query object
    this.queryStr = queryStr; // Request query parameters
  }

  // Search by keyword
  search() {
    const keyword = this.queryStr.keyword
      ? {
          name: {
            $regex: this.queryStr.keyword,
            $options: "i",
          },
        }
      : {};

    this.query = this.query.find({ ...keyword });
    return this;
  }

  // Filters for price, ratings, category, etc.
  filters() {
    const queryCopy = { ...this.queryStr };

    // Remove fields that are not used in MongoDB filter
    const fieldsToRemove = ["keyword", "page"];
    fieldsToRemove.forEach((el) => delete queryCopy[el]);

    let filterObj = {};

    // Price filter handling
    if (queryCopy["price[gte]"] || queryCopy["price[lte]"]) {
      filterObj.price = {};
      if (queryCopy["price[gte]"]) filterObj.price.$gte = Number(queryCopy["price[gte]"]);
      if (queryCopy["price[lte]"]) filterObj.price.$lte = Number(queryCopy["price[lte]"]);
    } else {
      if (queryCopy.min || queryCopy.max) {
        filterObj.price = {};
        if (queryCopy.min) filterObj.price.$gte = Number(queryCopy.min);
        if (queryCopy.max) filterObj.price.$lte = Number(queryCopy.max);
      }
    }

    // Ratings filter
    if (queryCopy.ratings) {
      filterObj.ratings = { $gte: Number(queryCopy.ratings) };
    }

    // Other filters (like category)
    Object.keys(queryCopy).forEach((key) => {
      if (!["min", "max", "ratings", "price[gte]", "price[lte]"].includes(key)) {
        filterObj[key] = queryCopy[key];
      }
    });

    console.log("MongoDB query object:", filterObj); // Debug
    this.query = this.query.find(filterObj);

    return this;
  }

  // Pagination
  pagination(resPerPage) {
    const currentPage = Number(this.queryStr.page) || 1;
    const skip = resPerPage * (currentPage - 1);
    this.query = this.query.limit(resPerPage).skip(skip);
    return this;
  }
}

export default apiFilters;

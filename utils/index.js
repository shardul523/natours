class MongoAPIFeatures {
  constructor(query, requestQuery) {
    this.query = query;
    this.requestQuery = requestQuery;
  }

  filter() {
    const excludedFields = ["sort", "limit", "page", "fields"];
    const filterObject = { ...this.requestQuery };

    excludedFields.forEach((field) => delete filterObject[field]);

    const filterStr = JSON.stringify(filterObject).replace(
      /\b(gt|gte|lt|lte)\b/g,
      (match) => `$${match}`,
    );
    this.query = this.query.find(JSON.parse(filterStr));

    return this;
  }

  sort() {
    const sortBy = this.requestQuery.sort
      ? this.requestQuery.sort.replaceAll(",", " ")
      : "-createdAt";
    this.query = this.query.sort(sortBy);

    return this;
  }

  select() {
    const selectionFields = this.requestQuery.fields
      ? this.requestQuery.fields.replaceAll(",", " ")
      : "-__v -createdAt -updatedAt";
    this.query = this.query.select(selectionFields);

    return this;
  }

  paginate() {
    const page = +this.requestQuery.page || 1;
    const limit = +this.requestQuery.limit || 10;
    const skip = (page - 1) * limit;

    this.query = this.query.skip(skip).limit(limit);

    return this;
  }
}

module.exports = MongoAPIFeatures;

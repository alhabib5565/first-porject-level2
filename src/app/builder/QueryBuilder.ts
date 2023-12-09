import { FilterQuery, Query } from "mongoose";

export class QueryBuilder<T> {
    public modelQuery: Query<T[], T>
    public query: Record<string, unknown>
    constructor(queryModel: Query<T[], T>, query: Record<string, unknown>) {
        this.modelQuery = queryModel;
        this.query = query
    }

    search(searchableFields: string[]) {
        const searchTerm = this?.query?.searchTerm
        if (searchTerm) {
            this.modelQuery = this.modelQuery.find({
                $or: searchableFields.map((filed) => ({
                    [filed]: { $regex: searchTerm, $options: 'i' }
                }) as FilterQuery<T>)
            })
        }
        // console.log('this from query builder', this)
        return this
    }

    filter() {
        const queryObj = { ...this.query }
        const excludeFields = ['searchTerm', 'sort', 'limit', 'page', 'fileds'];
        //excludeFields 
        excludeFields.forEach((el) => delete queryObj[el]);

        this.modelQuery = this.modelQuery.find(queryObj as FilterQuery<T>)
        return this
    }

    sort() {
        if (this.query.sort) {
            this.modelQuery = this.modelQuery.sort(this.query.sort as string)
        }

        return this
    }

    paginate() {
        const page = Number(this?.query?.page) || 1
        const limit = Number(this?.query?.limit) || 10
        const skip = (page - 1) * limit

        this.modelQuery = this.modelQuery.skip(skip).limit(limit)
        return this
    }

    fields() {
        const fileds = (this?.query.fileds as string)?.split(',').join(' ')
        this.modelQuery = this.modelQuery.select(fileds)

        return this
    }
}
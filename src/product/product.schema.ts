import * as mongoose from 'mongoose'
import * as mongoosePaginate from 'mongoose-paginate-v2'

export const ProductSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    images: { type: String },
    original_price: { type: Number, required: true },
    sell_price: { type: Number, required: true },
    sell_off: { type: Number },
    quantity: { type: Number, required: true },
    enable: { type: Boolean, default: true },
    created_by: { type: mongoose.Types.ObjectId, required: true }
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
    versionKey: false
  }
)
ProductSchema.plugin(mongoosePaginate)

mongoosePaginate.paginate.options = {
  page: 1,
  limit: 15,
  customLabels: {
    docs: 'data',
    totalDocs: 'total',
    totalPages: 'total_pages',
    pagingCounter: false,
    prevPage: false,
    nextPage: false,
    meta: 'pagination'
  }
}

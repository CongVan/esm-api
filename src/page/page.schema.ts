import * as mongoose from 'mongoose'

export const PageSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    access_token: { type: String,required: true },
    page_id: { type: String, required: true },
    user_id: { type: mongoose.Types.ObjectId, required: true },
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
    versionKey: false
  }
)
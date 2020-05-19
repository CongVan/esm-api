import * as mongoose from 'mongoose'

export const PostSchema = new mongoose.Schema(
  {
    page_id: { type: String, required: true },
    post_id: { type: String, required: true },
    content: { type: String },
    publish_time: { type: Date }
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
    versionKey: false
  }
)

import * as mongoose from 'mongoose'

export const CommentSchema = new mongoose.Schema(
  {
    comment_id: { type: String, required: true },
    comment_parent_id: { type: String, default: null },
    post_id: { type: String, required: true },
    from_id: { type: String },
    from_name: { type: String },
    message: { type: String },
    attachments: { type: Object },
    publish_time: { type: Date }
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
    versionKey: false
  }
)
